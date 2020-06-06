---
title: "zsh + iterm2"
date: "2012-12-19"
comments: true
categories: 
---
之前用过一段时间的zsh，是结合oh-my-zsh这个来使用的。开始感觉还不错，可是后来越来越慢，最后还是切换到了bash了，bash还是比较快。缺点是 bash 的个性化配置不好找，自己也懒得动手，而最近发现了iterm2，看了一下，觉得不错，想结合zsh更加nice的。

简单的记录一下：

首先当然是安装iterm2了，brew install 即可，或者下载安装包
接着安装oh-my-zsh
		
	curl -L https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh | sh
	
然后是在iterm2中设置所要使用的shell
	
	type zsh ==> /usr/local/bin/zsh
	
我还想默认的shell为bash

	
	chsh -s /bin/bash leslie
	
	
	
 参考
 
* https://en.wikipedia.org/wiki/Chsh	
