---
title: "firefox and go agent in Mac "
date: "2013-02-01"
comments: true
categories: go_agent
---

我现在采用很暴力的手段解决ssh证书问题（也是firefox上使用go_agent的唯一问题），方法如下：

1、删除之前所有的文件，包括证书
2、在钥匙管理中，添加新生成的go_agent的根证书
3、在firefox的advanced/encyption/ view certificates 中，添加根证书

注意： 不需要自己手动添加每个需要证书的网站，比如twitter，youtube等
