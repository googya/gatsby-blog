---
title: "mac下常用的命令"
date: "2012-07-28"
comments: true
categories: 
---
linux与mac下部分命令有差异，比如我经常需要知道哪个端口号被占用，linux下使用如下命令就可以看出来：

**netstat -ntlp**

但在mac使用lsof则可以查到相关：

**sudo lsof -ni | ack -i  listen**



