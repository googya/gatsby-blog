---
title: "mac下openjdk的fastdebug版本"
date: "2011-12-26"
comments: true
categories: 
---
虽然java有很多的缺点，但是它是我最早接触的、开始最喜欢的一门语言。我是个喜新不厌旧的人，尽管我目前更喜欢Ruby和lisp，但是对于java从来也没有放弃过，特别是对于jvm那块的内容，我更是有非常大的热情想了解。。。哈哈

最近在看jrockit和java performance，真想系统的知道jvm的运行原理、调优方面的知识。。。这点真得向淘宝的莫枢学习，他真是很有专研精神，而且在jvm研究上国内能出其由者寥寥无几。。。。

言归正传。。在mac上安装了一个fastdebug版本的jdk，主要用来测试一些东西，如添加一些开发环境下的命令：XX:….等等

其实在哪个平台下java的安装都差不多，无非是java_home,path 的设定。一般情况下，用不到特殊版本，所以只是临时的使用一下：

	export JAVA_HOME=/..../
	PATH=$JAVA_HOME/bin:$PATH



