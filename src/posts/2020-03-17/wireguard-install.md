---
title: "如何在 Centos 上安装 wireguard"
date: "2020-03-17"
comments: true
tags: [java,ruby,jar,gem,mysql-lib]

---

## on home

```
wg genkey  | tee my_private | wg pubkey > my_public
ip link add wg0 type wireguard
ip addr add 192.168.2.2/24 dev wg0
wg set wg0 private-key ./my_private # way to add peer
ip link set wg0 up
```

## 

## add peer

```
wg set wg0 peer OM5NlntS3l0hCBrrlvFGnVoThIniVICuulbszIQ0Lhs= allowed-ips 192.168.2.0/24 endpoint  106.13.13.13:38371 persistent-keepalive 15
```

## 

## remove peer

```
sudo wg set wg0 peer peer_publickey remove
# 抓包
tcpdump -i wg0 -nn
tcpdump -i wg0 -nn icmp
```

## 

## upgrade kernel

```
rpm --import https://www.elrepo.org/RPM-GPG-KEY-elrepo.org

rpm -Uvh https://www.elrepo.org/elrepo-release-7.0-3.el7.elrepo.noarch.rpm

# 注意是 lt long time support, ml 指的是 main line 最新版本， 保险起见， 不用最新的
yum --enablerepo=elrepo-kernel install kernel-lt

yum --enablerepo=elrepo-kernel -y swap kernel-headers -- kernel-lt-headers

yum --enablerepo=elrepo-kernel -y swap kernel-tools-libs -- kernel-lt-tools-libs

yum --enablerepo=elrepo-kernel -y install kernel-lt-tools

yum --enablerepo=elrepo-kernel -y swap kernel-devel -- kernel-lt-devel

yum -y remove kernel

# 查看内核版本
sudo awk -F\' '$1=="menuentry " {print i++ " : " $2}' /etc/grub2.cfg

# 设置默认项, 4.4 之类的
sudo grub2-set-default 0
sudo grub2-mkconfig -o /boot/grub2/grub.cfg
sudo reboot
```

## 

## install wireguard

```
# install copr
yum install yum-plugin-copr
sudo yum copr enable jdoss/wireguard
sudo yum install epel-release wireguard-dkms wireguard-tools
```

## 

## iptables 相关操作（主要检查 NAT 机器）

当出现能 ping 通， 但是不能访问对应服务的时候， 多半需要检查服务器上的防火墙规则。

有些服务器的默认防火墙规则会禁止 NAT 操作， 比如 ping 之类的.

```
iptables -S | grep icmp-host-prohibited # 查找对应的 规则
iptables -L --line-numbers | grep icmp-host-prohibited # 列出对应的规则， 找到编号
iptables -D INPUT num1 # 删除 INPUT 规则
ipdatles -D FORWARD num2 # 删除 FORWARD 规则
```

## 

## 增加路由

```
# 增加路由规则
ip route add 192.168.1.0/24 via 192.168.1.19 dev ens160

# 生效
sudo service network restart
```

### 

### 防火墙

```
# add rule
firewall-cmd --permanent --add-port=port_number/tcp
# reload
firewall-cmd --reload

# stop
systemctl stop firewalld.service

# disable
systemctl disable firewalld.service
```

## 

## 问题

1. 为什么不连 VPN 的时候， 都不能访问作为内网网关的服务器（关闭掉内网网关上的 wg0 后， 又能访问）?
2. 能 ping 通， 但提示 no route to host
   1. 出现该问题， 要检查防火墙的配置

参考：

[How to install kernel 4.x on CentOS 7.x](https://qiita.com/tkprof/items/2ec4ed58790efba3778d)

[How to Upgrade the Linux Kernel on CentOS 7](https://www.howtoforge.com/tutorial/how-to-upgrade-kernel-in-centos-7-server/)

[WireGuard Setup 的配置项](http://portal.altispeed.com/kb/faq.php?id=201)

[Centos6.5 升级完内核到3.10后,  无法安装kernel-devel](https://www.jianshu.com/p/00d9c6c361e2)

[ICMP host unreachable - admin prohibited](https://openstack.nimeyo.com/88925/openstack-neutron-icmp-host-unreachable-admin-prohibited)