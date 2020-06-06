---
title: "短网址解析功能(使用ruby和shell)"
date: "2013-03-13"
comments: true
categories: 
---
上twitter的时候，经常发现一些链接，点进去之后，链接到一个短网址，而因为一些原因，这些短网址没法解析。为了解析短网址，需要去一些专门的网站，贴上地址，点击解析，然后才能看到网址的真正面目。过程不复杂，但是经常这样很烦。今天终于不甚其烦，想写个shell命令，实现这个解析功能（当然是调用别人的已有的api完成此事）。无奈，shell不是很熟悉，写bash脚本尚有些难度，只好把ruby搬出来了，ruby与shell可是好朋友啊。

功能很简单，脚本也不复杂。

		require 'rubygems'
		require 'httpclient'
		
		
		API_URL = "http://imbolo.com/unshortenurl/api.php"
		def unshorten(url)
		   url = 'http://' + url unless url.start_with?('http')
		   
		   puts "Debug: url => #{url} "
		   
		   start_time = Time.now 
		   res =  HTTPClient.get(API_URL, {:url => "#{url}"})
		   end_time = Time.now
		   puts "Debug: status => #{res.code}"
		   puts "Debug: time costs #{end_time - start_time}"
		   res.body
		end
		
		result = unshorten(ARGV[0])
		if result =~ /^http/
		   system("open #{result}")
		end


可以看到，调用的是 http://imbolo.com/unshortenurl/api.php 提供的api，参数只需要url即可。代码很简陋，且没有异常处理，但基本上能满足我个人的需求。

要在终端中能调用需要另外做两件事情。

1、给文件执行权限
	
	chmod +x unshorten.rb 
	
	
2、在.bash_profile或者.bash 文件中添加 
		
	alias unshort='/usr/bin/ruby /Users/wenleslie/unshorten.rb'
	
	
source一下文件，就可以在终端中执行ruby代码，并且打开相应的页面.
