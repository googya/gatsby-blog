---
title: "如何把 Ruby 打成一个 jar"
date: "2020-03-16"
comments: true
tags: [java,ruby,jar,gem,mysql-lib]

---



有两个需求点：隐秘信息， 不用安装程序

有时候需要在服务器上运行一些 Ruby 脚本， 方便完成一些任务。 有些任务会涉及到一些隐秘信息，比如数据库密码、邮件服务的用户信息等。 直接放在那里当然没啥问题， 不过总是担心会泄漏， 被别人看见了不好。

还有些时候，机器上没有安装 Ruby， 出于某些原因， 也不希望安装 Ruby， 只是希望有个文件， 运行一下， 然后收工。

以上两点， 都涉及 Ruby， 但又不止是 Ruby， 自然而然， 想到了 JRuby 。结合 Ruby 的灵活和丰富的 Java 生态， 很可惜， 可能有其问题， 终究是没有大流行。不过 JRuby 作者一直在努力推进 JRuby 的发展， 这态度让我敬佩。

先看结果：



```shell
.
├── Gemfile
├── asset_export.jar
├── bin
│   └── mysql_jruby.rb
├── config
│   └── warble.rb
└── lib
    └── mysql-connector-java-5.1.47-bin.jar

```



最终的结构是这样。

主要关注的是依赖。 依赖来自两方面： 一方面是 Ruby 生态的， 通过 Gemfile 来处理， 另外一方面是 jar 包。

- bundle init 

  添加 Ruby 相关的依赖放， 和一般 Ruby 项目的依赖没啥不同

- 添加 jar 包。 

  将需要的 jar 包放到 lib 下面， 比较好管理。（更好的办法可能是通过 maven 管理 jar ）

- mdkir config; warble config

   生成打包时候配置文件， 做相应修改即可

- warble jar 生成 jar 文件



更复杂的等以后用到的是再尝试。 

如果 gravval 起来了， 或许 JRuby 能更有应用空间。大小、启动时间等都不再是问题了。

之前也有尝试， 不过没注意项目结构， 一直没成功。 这次我一直在想要怎么才能打成功了， 抛弃了之前的固有想法， 参照了 WIKI， 结果真就打成了。。





##### 参考：

[[JRuby][Warbler]Rubyで書いたソースからJARを作成する](https://dev.classmethod.jp/etc/jruby_warbler_ruby_source_create_jar/)

[JRuby wiki](https://github.com/jruby/jruby/wiki)

