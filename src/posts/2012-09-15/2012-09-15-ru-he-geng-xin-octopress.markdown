---
title: "如何更新Octopress"
date: "2012-09-15"
comments: true
categories: 
---
因为换了系统的用户，之前clone下来的octopress会产生路径问题，pull和push都不能正常工作，索性，删之，然后重新拉下来。


下决心这么干了。

这个octopress博客是在真正接触rails之前搭的，有很多东西是照着别人的教程做的，虽然能正常工作，但是仍不解其意。现在对ruby、rails以及git稍微有些了解了，所以就能知其然也知其所以然了。于是就相当于重新搭一遍吧，果然还是有些可以记录的地方。

首先是同步自己之前github上的博客项目，遇到两个问题，如下：

##问题一： 如何同步Octopress的最新代码？
本博客是在2011年11月份左右搭建的，但是Octopress用的是Ruby版本是1.9.2，而经过这么长时间，其官方设置已有很多更新了，如何更新为最新的Octopress呢?

方法如下：
	
	1、git clone git@github.com/yourname.github.com.git
	   并且切换到source分支。此时，与Octopress还没发生任何关系。
	   
	2、git remote add octopress https://github.com/imathis/octopress.git

		如果有必要的话，把下面增加到最底端 .git/config
 			[branch  "maste"]
				remote = octopress
				merge = refs/heads/master
	  
	3、git pull octopress master
	   将项目拉到source分支下面，然后合并，解决冲突（我不会使用命令解决冲突，借助sourcetree可以很好的完成这个）
	 


这样就用起了最新的Octopress项目。


###问题二，  如何更改部署方式？
octopress默认的部署方式是rsync的，如果没有ssh等设置的话，是无法work的，需要更换部署的方式，Rakefile有相应的任务，

	rake setup_github_pages
	
 该命令会提示您输入你在github上的repos的地址。
 
 设置完成之后就能部署了
 
	 rake gen_deploy


