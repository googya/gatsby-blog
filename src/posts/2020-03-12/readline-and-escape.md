

---
title: "在命令行下如何移动一个字符、一个单词"
date: "2020-03-12"
comments: true
tags: [read, escape, emacs]

---

命令行下， 移动字符、单词的快捷键一般跟 emacs 中的相同， 诸如： 

```shell
Ctrl + a 跳转到开头
Ctrl + e 跳到尾部 
```

一般， 幸运的话， 这些都有默认的支持； 如果没有支持， 自己配置起来也非难事。

相关的配置可以放在 ～/.inputrc 或者 /etc/inputrc 下

```shell
"\eOd": backward-word
"\eOc": forward-word
"\e[1;3D": backward-word
"\e[1;3C": forward-word
```

里面有些奇怪的字符， 后面有单词， 大致能猜出含义： 向前（后）一个单词。前面的是怎么来的呢？

如果在命令行下输入  readline 然后 按 option/alt + left arrow

```shell
read
^[[1;3D
```

这个就是读入的 option/alt + left arrow 组合键。

这个字符与配置中的似乎不一样嘛

```shell
\e 表示的是 escape
^[ 表示的也是 escape (?)
```

