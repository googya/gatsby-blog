---
title: "firefox下echofon异常的解决方法"
date: "2012-01-02"
comments: true
categories: 
---
firefox下的echofon是我非常喜欢的一个twitter工具，操作非常简单的同时也能满足我基本的需要，所以我一直就是用的它。既然说道twitter，那么不得不提一下翻墙那些事。我使用的是goagent，一个google的app engine项目，对于我们这些需求的不高的人来说，还是比较合适的。当然我也希望自己能写一个ruby的，能部署到heroku或者cloudfoundry上面，这是后话了。

今天要说的主要是firefox下echofon出现的问题。之前用这个插件是没有问题的，但最近老是登不上，提示连接被拒绝
	SSL routines:SSL3_READ_BYTES:tlsv1 alert access denied 。

网上出现类似错误的也比较少，所以也没有找到解决的方法。今天想把这个小问题解掉，所以多留意了一下它提示的错误，联想到之前firefox升级到了10,估计在这方面会有影响。后来发现也不是。只是自己没有将api.twitter.com.crt设置为信任。所以解决方法就是将它设置为信任即可。。。困扰了我很久了。
以下是图：

![wenwen](../images/firefox_edit_trust.png)





有时候还是要注意最基本情况
