---
title: "同时提交到两个仓库"
date: "2019-04-19"
comments: true
tags: [GIT]


---

首先， 需要添加 metalist 仓库的地址(下面以 exchange-admin 为例)

```shell
git remote add metalist http://git03.ops.metaps:803/metalist-exchange/exchange-admin.git
# 目前该仓库不支持 ssh
```

这样， 该项目下， 应该有两个远端仓库地址， 使用 

```shell
git remote -v

metalist	http://git03.ops.metaps:803/metalist-exchange/exchange-admin.git (fetch)
metalist	http://git03.ops.metaps:803/metalist-exchange/exchange-admin.git (push)
origin	git@10.21.2.7:exchange/exchange-admin.git (fetch)
origin	git@10.21.2.7:exchange/exchange-admin.git (push)
```



关联一个本地分支到远端 metalist 的 master（ 或者其他分支）， 操作如下：

```shell
# 新建一个分支
git checkout -b metalist_master 

git pull metalist master

# 将此分支与远端 metalist 的 master 关联, 这样， 就可以同步 metalist 上 master 分支的更新
git branch --set-upstream-to=metalist/master metalist_master

```



同步远端 metalist master 分支：

```shell

git checkout metalist_master

git pull --rebase metalist master

```



在本地完成修改之后， 可推送到远端：

```shell
# 将本地 metalist_master 的更新， 推送到远端 metalist 的 master 分支：
git push metalist metalist_master:master

```

