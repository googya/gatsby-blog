---
title: "mysql中case when 的用法"
date: "2011-12-15"
comments: true
categories: 
---


今天碰到一个sql题目，分组统计一个表。表的结构如下，

日期				胜负

2011－12－12		胜

2011－12－12		负

2011－12－12		胜

2011－12－12		负

2011－12－13		胜

2011－12－13		负

要求得到如下形式的结果：
	
日期				胜		负

2011－12－12 	2		2

2011－12－13		1		1

当时脑子堵住了，不知道怎么写，后来人家提示说用case when语句，可惜我一时没反应过来，还是不知道怎么弄。

回来之后就查了点资料，搞定了它

	select riqi, sum(case when shengfu='sheng' then 1 end ) as sheng, sum(case when shengfu= 'fu' then 1 end ) as fu from bisai group by riqi


主要是不了解case when的用法。。。。其实这跟ruby中的case when基本上是差不多的。。
纪录一下。。。。。
