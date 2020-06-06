---
title: "how to commit only parts of modified files using git"
date: "2012-06-29"
comments: true
categories: 
---
* git add -i交互式命令
	把需要提交的文件勾上，使用update选项
* git stash 将其余文件放入暂存区
* git commit -m ’提交'
* git rebase (git svn rebase 如使用svn)
* git push (git svn dcommit 如使用svn)

	做完之后，需将之前暂存的部分取出来了：
	git stash apply
