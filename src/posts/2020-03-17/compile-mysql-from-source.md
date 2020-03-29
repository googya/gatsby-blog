---
title: "如何从源代码编译 MySQL"
date: "2020-03-29"
comments: true
tags: [source, mysql, compile, centos]

---

缘起：要改变数据库的默认安装位置， 但不知道如何下手， 只得从源码着手了



```shell
# 获取源码
wget -c https://cdn.mysql.com//Downloads/MySQL-5.6/mysql-5.6.47.tar.gz

# 安装必要类库
yum install cmake gcc-c++ ncurses-devel perl-Data-Dumper boost boost-doc boost-devel openssl-devel bison

# 编译

cmake . -DCMAKE_INSTALL_PREFIX=/data/mysql \
-DMYSQL_DATADIR=/data/mysql/data \
-DSYSCONFDIR=/data/mysql/etc \
-DEFAULT_CHARSET=utf8mb4 \
-DDEFAULT_COLLATION=utf8mb4_general_ci \
-DENABLED_LOCAL_INFILE=1 \
-DEXTRA_CHARSETS=all

# 初始化数据库, 注意 basedir 和 datadir 的表示
/data/mysql/scripts/mysql_install_db --basedir=/data/mysql --datadir=data --user=mysql

# 添加 mysql 账号 并且需要设置相应的权限 
groupadd mysql 
useradd -g mysql mysql


# 执行 mysql_secure_installation 命令 （其会寻找默认的 mysql.sock 根据需要设置，执行后可 unlink）
ln -s /real_path/mysql.sock /var/lib/mysql/mysql.sock
mysql_secure_installation # Do your stuff
unlink /var/lib/mysql/mysql.sock

```



以上是基本的操作， 需要注意的点在于不要搞错路径， 特别是初始化 db 的时候， basedir 和 datadir 要确认好， 否则会出现表找不到的情况（因为路径不对）