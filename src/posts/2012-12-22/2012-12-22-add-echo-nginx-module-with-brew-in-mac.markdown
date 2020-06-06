---
title: "add echo-nginx-module with brew in Mac "
date: "2012-12-22"
comments: true
categories: 
---
今天在看 [agentzh的Nginx教程](http://agentzh.org/misc/nginx/agentzh-nginx-tutorials-zhcn.html) 的时候，看到里面有如下Nginx设置：

		
	server {
        listen 8080;

        location /test {
            set $foo hello;
            echo "foo: $foo";
        }
    }
    
    
我还以为echo是内建的指令，用起来应该不会有什么问题，结果reload Nginx 的时候就出现了问题，提示不能识别 echo 指令，google了一下才知道，需要安装一个 echo-nginx-module 模块。从源代码编译不难，也有相应的操作流程，可是我安装工具基本上是通过 brew 来的，而brew默认没有提供相应的支持。于是只好去看 brew 中有关 nginx 的formular，然后再修改它。

使用命令可以把formular调出来
		
		brew edit nginx
		

刚开始摸不着头脑，不知道如何下手，看了nginx对passenger的做法之后，大概知道如何处理，因为对passenger的支持也是通过 --add-module来实现的：

	def passenger_config_args
    	passenger_root = `passenger-config --root`.chomp

    	if File.directory?(passenger_root)
      		return "--add-module=#{passenger_root}/ext/nginx"
    	end

    	puts "Unable to install nginx with passenger support. The passenger"
    	puts "gem must be installed and passenger-config must be in your path"
    	puts "in order to continue."
    	exit
  	end
  	
  	
  	
另外还有：
		
		args << passenger_config_args if build.include? 'with-passenger'
		
		
于是我就添加了：

		args << "--add-module=/path/to/echo-nginx-module" if build.include? 'with-echo'
		
这样一来，就可以安装echo模块了。。。




