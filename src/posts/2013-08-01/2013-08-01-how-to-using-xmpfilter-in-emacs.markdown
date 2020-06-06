---
title: "how to using xmpfilter in Emacs"
date: "2013-08-01"
comments: true
categories: xmpfilter, emacs
---

今天终于知道了 @avdi 的视频中的  输入一段 Ruby 代码， 然后后面接着能输出相应的结果的“特技了”。 用的是 xmpfilter， 安装了 rcodetools 就有这个命令了。



参照 rcodetools 的说明， 和 Avid 他自己在视频中的讲解的安装到Emacs的方法：

1、首先安装 rcodetools

		gem install rcodetools
		
2、找到相应的gem包
	
		cd  .rvm/gems/ruby-1.9.3-p448/gems/rcodetools-0.8.5.0
		
		ls .
		
		

		CHANGES                  README.ja                Rakefile                 bin                      rcodetools.elc           setup.rb
		README                   README.method_analysis   Rakefile.method_analysis icicles-rcodetools.el    rcodetools.gif           test
		README.TDC               README.vim               THANKS                   lib                      rcodetools.sxmp
		README.emacs             README.xmpfilter         anything-rcodetools.el   rcodetools.el            rcodetools.vim
		
		
		

3、把 rcodetools.el  复制到 .emacs.d 目录下（其实随便哪个目录都成， 只要能找到即可）	
4、在 init.el 中写入如下代码：

```lisp
  (require 'rcodetools)
  (define-key ruby-mode-map (kbd "C-c C-c") 'xmp)
	;;(define-key ruby-mode-map (kbd "C-c C-c") 'rct-complete-symbol)
```

那么就可以在 emacs 中玩耍了：


```ruby
	Beer = Struct.new(:brewery, :name, :abv, :ipu)                                                                                                                
	
	hopback = Beer.new("Troegs", "Hopback Amber Ale", "6.0%", 55)                                                                                                 
	                                                                                                                                                              
	class A                                                                                                                                                       
	  def a                                                                                                                                                       
	    'a'                                                                                                                                                       
	  end                                                                                                                                                         
	end                                                                                                                                                           
	                                                                                                                                                              
                                                                                                                                                                                                                                                                                                                                                                                                              	                                                                                                                                                  	a = A.new  # => #<A:0x007f8d7991a218>   
	hopback                                                                                                                                                       
	# => #<struct Beer                                                                                                                                            
	#     brewery="Troegs",                                                                                                                                       
	#     name="Hopback Amber Ale",                                                                                                                               
	#     abv="6.0%",                                                                                                                                             
	#     ipu=55> 
```
	
这样就大功告成了。。。
	
					
