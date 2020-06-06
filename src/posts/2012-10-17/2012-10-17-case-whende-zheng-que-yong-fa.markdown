---
title: "case when的正确用法"
date: "2012-10-17"
comments: true
categories: ruby
---

case when 语法利用了 ＝＝＝ 操作，三等号操作比较有意思：



	[1] pry(main)> 'sss' === String

	=> false

	[2] pry(main)> String === 'sss'

	=> true

当三等号右边是左边的实例、子类的时候，返回true


错误的使用方法：
	
	num = 10
	case num.class

     when Numeric

          puts  "Right class"

     else 

          puts "Wrong class"

	end
	


判断的过程是这样的：

num.class 是 Numeric, 在when语句会有这样的比较

Numeric === Numeric,显然，根据 ===比较的含义，会返回false，于是else那条语句得到执行， 返回 Wrong class。

知道什么是错的，离正确的做法也不远了：

	num = 10

	case num

     when Numeric

          puts  "Right class"

     else 

          puts "Wrong class"

	end







