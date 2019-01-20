---
title: "mac上的nginx与passenger"
date: "2013-01-30"
comments: true
categories: nginx
---

安装brew，相信用mac的基本都会安装吧

之前都是通过passenger来安装nginx，每次passenger或者ruby更新之后都出现问题，所以很烦。现在通过brew安装nginx的时候，提供是否安装nginx的选项，很好


	brew info nginx

	ginx: stable 1.2.6, devel 1.3.10
	http://nginx.org/
	Depends on: pcre
	/usr/local/Cellar/nginx/1.2.6 (11 files, 2.7M) *
	  Installed with: --with-debug, --with-passenger
	https://github.com/mxcl/homebrew/commits/master/Library/Formula/nginx.rb
	==> Options
	--with-debug
		Compile with support for debug log
	--with-passenger
		Compile with support for Phusion Passenger module
	--with-webdav
		Compile with support for WebDAV module
	==> Caveats
	In the interest of allowing you to run `nginx` without `sudo`, the default
	port is set to localhost:8080.
	
	If you want to host pages on your local machine to the public, you should
	change that to localhost:80, and run `sudo nginx`. You'll need to turn off
	any other web servers running port 80, of course.
	
	You can start nginx automatically on login running as your user with:
	  mkdir -p ~/Library/LaunchAgents
	  cp /usr/local/Cellar/nginx/1.2.6/homebrew.mxcl.nginx.plist ~/Library/LaunchAgents/
	  launchctl load -w ~/Library/LaunchAgents/homebrew.mxcl.nginx.plist
	
	Though note that if running as your user, the launch agent will fail if you
	try to use a port below 1024 (such as http's default of 80.)
	
	To have launchd start nginx at login:
	    ln -sfv /usr/local/opt/nginx/*.plist ~/Library/LaunchAgents
	Then to load nginx now:
	    launchctl load ~/Library/LaunchAgents/homebrew.mxcl.nginx.plist
	    
	    
	    
	    

brew install nginx --with-passenger	    
	    

	    
