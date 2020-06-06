---
title: "how to uninstall global  bundler under rvm?"
date: "2013-03-13"
comments: true
categories: 
---
	
之前经常遇到这样的问题：

	Fetching gem metadata from http://rubygems.org/.........
	Bundler could not find compatible versions for gem "bundler":
	In Gemfile:
	    rails (= 3.0.1) ruby depends on
	      bundler (~> 1.0.0) ruby
	
	Current Bundler version:
	    bundler (1.
	This Gemfile requires a different version of Bundler.
	
估计就是安装了好几个版本的bundler，而当前项目需要的不是当前版本的bundler，因此产生了这样的问题，解决办法是bundle的时候，指定所需要的版本，比如1.0.22
		
	bundle _1.0.22_ install
	
但是每次部署都这样也不是办法，特别是时间一长，有些操作都忘记了，那时候就特别头疼。


今天在stackoverflow上看到别人提的这样一个问题： [Rvm: Cannot uninstall bundler 1.1.0](http://stackoverflow.com/questions/9810108/rvm-cannot-uninstall-bundler-1-1-0)，终于明白了问题的关键在于

		*it is because gems are also installed in global gemset, and you can uninstall it using:*

	
		rvm @global do gem uninstall bundler
	
rvm下有个全局的 bundler，把它卸除就ok了。。。

