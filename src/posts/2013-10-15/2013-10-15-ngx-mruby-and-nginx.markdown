---
title: "ngx_mruby and Nginx"
date: "2013-10-15"
comments: true
categories: MRuby, Nginx
---

今天突然看到 @igrigorik 发的 tweet， 
> @igrigorik: ngx_mruby: script nginx with mruby @ http://t.co/o3dsNt4XSZ - now that looks exciting! awesome work by @yukihiro_matz!
>

看到很惊喜， 之前只见过用 Lua 写的 Nginx 代码， 这下终于可以有 Ruby  版本的了。 立马试用了一下， 感觉很亲切。

参照这个网址的安装使用说明 [What's ngx_mruby](http://matsumoto-r.github.io/ngx_mruby/)


我是在 Mac 上， 通过 brew 安装 Nginx 的， 由于默认的 nginx.rb 不能满足要求， 需要自己手动修改一下。 具体步骤如下：

1、使用 rvm 安装 mruby
		
		rvm  install mruby

2、在 ~/Gits/Servers/Nginx 下 clone ngx_mruby 
	
		git clone https://github.com/matsumoto-r/ngx_mruby.git
		
3、编辑 nginx.rb
	
		brew edit nginx
		
		args << "--add-module=/Users/leslie/Gits/Servers/Nginx/ngx_mruby"

4、设定访问路径
		
		 52         location /mruby {
		 53           mruby_content_handler ./conf.d/hello.rb;
		 54         }
		 
hello.rb  的内容是：

		Nginx.rputs(Time.now.to_s + "hello mruby world for nginx.")



具体的效果, 见

[dropbox](https://www.dropbox.com/s/974vx48qag04yky/mruby_and_nginx.png)


参考：

* [Add Echo-nginx-module With Brew in Mac](http://googya.github.io/blog/2012/12/22/add-echo-nginx-module-with-brew-in-mac/)

* [Ngx mruby](http://matsumoto-r.github.io/ngx_mruby/)

* [gist](https://gist.github.com/jugyo/3798703/raw/fc35406346bf11e06cbf88a4f0c2e3df16311e2a/ngx_mruby.md)
