---
title: "how to use Dtrace tracing ruby executing"
date: "2013-03-31"
comments: true
categories: dtrace
---
最近看了点关于Dtrace的东西，它是个通用型的工具，但我主要集中于分析ruby程序的执行上面。关于操作系统的性能分析，比如cpu、内存、io、文件系统等，使用起来貌似挺复杂，木有细看。


这里简单的输出一条命令：

	sudo dtrace -n 'ruby$target:::object-create {@objects[copyinstr(arg0)]=count();}' -c 'ruby -e "puts :hello"'
	
	
输出的结果是：
		
		
		dtrace: description 'ruby$target:::object-create ' matched 1 probe
		-e:1: unterminated string meets end of file
		dtrace: pid 15203 has exited
		
		  #<Class:0x007fabf38e0700>                                         1
		  ARGF.class                                                        1
		  IOError                                                           1
		  Mutex                                                             1
		  NoMemoryError                                                     1
		  SyntaxError                                                       1
		  SystemStackError                                                  1
		  ThreadGroup                                                       1
		  Time                                                              1
		  LoadError                                                         2
		  Object                                                            2
		  Gem::Specification                                                8
		  Gem::Version                                                     10
		  Hash                                                             11
		  Gem::Requirement                                                 23
		  Array                                                            96
		  String                                                          260
	
	

[ruby2.0已经有支持probe了](https://bugs.ruby-lang.org/projects/ruby/wiki/DTraceProbes)，所以可以使用dtrace

2.0之前的如果要使用dtrace的话，要使用 [ruby-dtrace](https://github.com/chrisa/ruby-dtrace)这个gem


另外在学习的时候，写了dtrace的脚本，其实就是D语言了， rb_flowinfo.d，查看ruby方法的调用过程：

		
		#!/usr/sbin/dtrace -Zs
		#pragma D option quiet
		#pragma D option switchrate=10
		
		self int depth;
		
		dtrace:::BEGIN
		{
		   printf("%s %6s %10s %16s:%-4s %-8s -- %s\n", "C", "PID", "DELTA(us)", "FILE", "LINE", "TYPE", "NAME");
		}
		
		ruby*:::method-entry, 
		ruby*:::method-return
		/self->last == 0/
		{
		   self->last = timestamp;
		}
		
		ruby*:::method-entry
		/copyinstr(arg0) == "Object"/
		{
		   this->delta = (timestamp - self->last) / 1000;
		   this->name = strjoin(strjoin(copyinstr(arg0), "::"), copyinstr(arg1));
		   printf("%d %6d %10d %16s:%-4d %-8s %*s-> %s\n", cpu, pid, this->delta,
		         basename(copyinstr(arg2)), arg3, "method", self->depth * 2, "", this->name);
		
		   self->depth++;
		   self->last = timestamp;
		}
		
		ruby*:::method-return
		/copyinstr(arg0) == "Object"/
		{
		   this->delta = (timestamp - self->last) / 1000;
		   self->depth -= self->depth > 0 ? 1 : 0;
		   this->name = strjoin(strjoin(copyinstr(arg0), "::"), copyinstr(arg1));
		   printf("%d %6d %10d %16s:%-4d %-8s %*s<- %s\n", cpu, pid, this->delta,
		         basename(copyinstr(arg2)), arg3, "method", self->depth * 2, "", this->name);
		   self->last = timestamp;
		}
		



用于测试的ruby脚本， trace_method_call.rb

		
		dtrace_ruby $ cat trace_method_call.rb 
		#!/Users/wenleslie/.rvm/rubies/ruby-2.0.0-p0/bin/ruby
		def func_c
		   puts "Function C"
		   sleep 1
		end
		
		def func_b
		   puts "Function B"
		   sleep 6
		   func_c
		end
		
		def func_a
		   puts "Function A"
		   func_b
		end
		
		func_a		
		
		

 执行：
 		
 		sudo ./rb_flowinfo.d -c ./trace_method_call.rb
 		

结果如下：

	
	C    PID  DELTA(us)             FILE:LINE TYPE     -- NAME
	Function A
	Function B
	4  15702      35986 trace_method_call.rb:13   method   -> Object::func_a
	4  15702         55 trace_method_call.rb:7    method     -> Object::func_b
	Function C0  15702    6001065 trace_method_call.rb:2    method       -> Object::func_c
	
	6  15702    1000922 trace_method_call.rb:5    method       <- Object::func_c
	6  15702         27 trace_method_call.rb:11   method     <- Object::func_b
	6  15702         19 trace_method_call.rb:16   method   <- Object::func_a
	^C
 				
 				

[我的evernote上关于dtrace笔记 ](https://www.evernote.com/shard/s21/sh/18e6d4ec-1160-4fa1-95cb-4bf8bf8749e8/c26ffcba6a0ed6f6b5b3c600a70bb9ab)有稍微详细一点的内容，有兴趣的话，可以看看				

