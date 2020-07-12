---
title: "crontab issue"
date: "2020-07-12"
comments: true
tags: [crontab, environment arg, redirect]

---





写了个 slack 的 bot， 完成数据统计之类的简单工作，并将其打包成 jar，  写了 crontab 任务。该程序有个环境变量的依赖， 写在了 .bashrc 中。

手动执行此任务， 能得到预期的输出结果； crontab 调度任务也执行了（通过查看 crontab 的日志验证）， 但没有预期结果（bot 并没有发送 message）。通过查找 crontab 的日志， 错误信息等， 也没有任务失败的提示（比如找不到环境变量之类的）。



后来到网上搜索了下， 找到了一篇博客 [Cron Script does not Execute as Expected from crontab – Troubleshoot](https://www.thegeekdiary.com/cron-script-does-not-execute-as-expected-from-crontab-troubleshoot/) , 搜索的关键词大概是 crontab no error not working， 意思也是 crontab 没达到预期。这里面提到了



> ## The Problem
>
> Running a script using the cron service, that executes normally from the shell but does not exhibit the same behavior when running from crontab.
>
> ## Root Cause
>
> One of the most frequent causes for the crontab job not being correctly executed is that a cronjob does not run under the user’s shell environment. Another reason can be – not specifying the absolute path of the commands used in the script. When the script is run manually the environment variable such as PATH can be different than when running from the cron. So it is always recommended to include the absolute paths of the commands used in the script.
>
> ​	



crontab 没达到预期效果， 一般是由于绝对路径和环境变量引起的。

我将 java -jar bot.jar 改写成了一段 shell 脚本

```shell

#!/bin/sh -e

source ~/.bashrc
cd /root
/bin/java -jar ~/bot.jar
```

将对应的环境变量加载， 以便排除环境所带来的影响。 结果是能达到预期效果， bot 发送了对应的消息。



后到 [程序员技术分享群](https://t.me/gotoshare) 问了下， 有群友说， 用重定向的方式，  可将错误等信息输出到指定文件。 我尝试过了， 但是没有任何输出，也许是使用方法不当，不过这个技巧可以记下（尽管之前应该用过）.



问题虽然解决了， 但是有个地方我还是没搞明白， crontab 任务执行的时候， 加载的什么环境配置文件， 什么环境变量是生效的，为什么执行有问题却不报错。。



后来查了一些资料， 如下

[Where can I set environment variables that crontab will use?](https://stackoverflow.com/questions/2229825/where-can-i-set-environment-variables-that-crontab-will-use)

[What does “rc” in .bashrc stand for?](https://unix.stackexchange.com/questions/3467/what-does-rc-in-bashrc-stand-for)

以及 man 5 crontab， 得知， crontab 并不会主动去找环境变量， 如果有需要



1. 可以 source 指定的文件

2. 可以直接在任务中设定 , 比如

   ```shell
   LANG=nb_NO.UTF-8
   LC_ALL=nb_NO.UTF-8
   # m h  dom mon dow   command
   
   * * * * * sleep 5s && echo "yo"
   ```

对 crontab 的用法有个大概的了解了， 希望以后用的时候，遇到奇怪的问题， 可以快速定位， 避免不必要的时间浪费