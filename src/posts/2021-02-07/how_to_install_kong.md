---
title: "How to install and deploy Kong api gateway"
date: "2021-02-07"
comments: true
categories: 
---

使用 Postgres 作为数据库

## 进入 sql
sudo -u postgres psql 
CREATE USER kong; CREATE DATABASE kong OWNER kong;

## 修改密码
sudo -u kong psql kong
alter user kong with password '123456';

## 连接数据库
psql -dkong -Ukong -W -h 127.0.0.1


#kong
sudo apt-get update

sudo apt-get install /absolute/path/to/package.deb (dkpg -i ...)

/etc/kong/kong.conf
sudo kong migrations bootstrap

启动

sudo kong start --vv


注册服务：

```shell

curl -i -X POST \
  --url http://192.168.33.10:8001/services/ \
  --data 'name=example-service' \
  --data 'url=http://api01.bitspaceman.com:8000/news/qihoo'

curl -i -X POST \
  --url http://192.168.33.10:8001/services/ \
  --data 'name=163-service' \
  --data 'url=http://3g.163.com/touch/jsonp/sy/recommend'

```

添加路由

```shell
curl -i -X POST \
  --url http://192.168.33.10:8001/services/example-service/routes \
  --data 'hosts[]=news.com'

curl -i -X POST \
  --url http://192.168.33.10:8001/services/163-service/routes \
  --data 'paths[]=/news'  \
  --data 'hosts[]=news.com'
```


查询结果：

```shell
   curl -i -X GET   --url http://192.168.33.10:8000/news/0-9.html   --header 'Host: news.com'



HTTP/1.1 404 Not Found
Content-Type: text/html; charset=UTF-8
Content-Length: 28246
Connection: keep-alive
Date: Fri, 05 Feb 2021 09:31:27 GMT
Server: nginx
Accept-Ranges: bytes
x-varnish: 1979135420
Via: kong/2.3.1
x-varnish-cache: MISS
x-envoy-upstream-service-time: 5
X-Via: 1.1 hanyidong86:15 (Cdn Cache Server V2.0)
X-Ws-Request-Id: 601d106f_ong83_2679-11193
X-Cache-Remote: MISS
cdn-ip: 222.42.238.207
cdn-source: chinanetcenter
cdn-user-ip: 223.104.20.215
X-Kong-Upstream-Latency: 131
X-Kong-Proxy-Latency: 0

<!DOCTYPE html>
<html>
        <head>
                <meta charset="UTF-8">
                <title>404!页面找不到了！</title>

                <meta name="viewport" content="width=750,target-densityDpi=device-dpi,user-scalable=no">
                <meta content="telephone=no" name="format-detection">
                <meta name="keywords" content="手机网易网">
                <meta name="description" content="手机网易网">
                <style>body,div,span,object,iframe,h1,h2,h3,h4,h5,h6,p,blockquote,a,code,em,img,q,small
```


列出所有服务:

```shell
curl http://192.168.33.10:8001/services
```



鉴权服务：

```shell

create demo service

   curl -i -X POST \
  --url http://192.168.33.10:8001/services/ \
  --data 'name=example-service' \
  --data 'url=http://mockbin.org/request'


  curl -i -X POST \
  --url http://192.168.33.10:8001/services/example-service/routes \
  --data 'paths[]=/auth-sample'


curl http://192.168.33.10:8000/auth-sample

增加 auth 插件

curl -i -X POST \
  --url http://192.168.33.10:8001/services/example-service/plugins/ \
  --data 'name=key-auth'

```



负载均衡


```shell

# 创建一个upstream
curl -X POST http://kong:8001/upstreams \
    --data "name=address.v1.service"

# 给upstream添加两个target
curl -X POST http://kong:8001/upstreams/address.v1.service/targets \
    --data "target=192.168.33.10:8888" \
    --data "weight=100"
curl -X POST http://kong:8001/upstreams/address.v1.service/targets \
    --data "target=192.168.33.10:9989" \
    --data "weight=50"

# 创建一个把Blue上游作为目标的Service
curl -X POST http://kong:8001/services/  \
    --data "name=address-service"  \
    --data "host=address.v1.service" \
    --data "path=/address"

# 最后，为Service添加Route
$ curl -X POST http://kong:8001/services/address-service/routes/ \
    --data "hosts[]=address.mydomain.com"



====================================================


蓝绿部署

# 为地址服务v2，创建一个新的Green upstream
curl -X POST http://kong:8001/upstreams \
    --data "name=address.v2.service"

# 给upstream添加两个目标
curl -X POST http://kong:8001/upstreams/address.v2.service/targets \
    --data "target=192.168.33.10:7788" \
    --data "weight=100"
curl -X POST http://kong:8001/upstreams/address.v2.service/targets \
    --data "target=192.168.33.10:7799" \
    --data "weight=100"

# 将服务从Blue环境转换为Green环境, v1 -> v2
curl -X PATCH http://kong:8001/services/address-service \
    --data "host=address.v2.service"


认证相关

basic auth




  # 为服务创建认证类型
  curl --request POST \
  --url http://192.168.33.10:8001/services/address-service/plugins \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data name=basic-auth \
  --data config.hide_credentials=true


# 为路由创建认证类型
  curl --request POST \
  --url http://192.168.33.10:8001/routes/f30e08fb-8ce0-4dae-a88d-906b4597e87d/plugins \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data name=basic-auth \
  --data config.hide_credentials=true


# 生成一个 consumer
  curl --request POST \
  --url http://192.168.33.10:8001/consumers \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data username=leslie \
  --data custom_id=leslie_zhaung

# 创建凭证
  curl --request POST \
  --url http://192.168.33.10:8001/consumers/fe441fde-62d9-4279-af95-1c188d0d5728/basic-auth \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data username=Leslie \
  --data password=123456

# 使用凭证
  curl --request GET \
  --url http://192.168.33.10:8000/ \
  --header 'Authorization: Basic TGVzbGllOjEyMzQ1Ng==' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --header 'Host: address.mydomain.com' \
  --data username=Leslie \
  --data password=123456


```

OAuth2 验证：



用  [kong-oauth2-hello-world](https://github.com/Kong/kong-oauth2-hello-world) 作为 oauth2 的验证 demo，以下为操作步骤：

```shell
# 增加一个 test service

curl -X POST \
  --url "http://127.0.0.1:8001/services" \
  --data "name=mock-service" \
  --data "url=http://mockbin.org/request"
  
# 为这个服务增加 router
curl -X POST \
  --url "http://127.0.0.1:8001/services/mock-service/routes" \
  --data 'hosts[]=mockbin.org' \
  --data 'paths[]=/mock'
  
# 访问刚才新建的 API
curl -X GET \
  --url "http://127.0.0.1:8000/mock" \
  --header "Host: mockbin.org"
  
 # 增加 OAuth2 插件
 curl -X POST \
  --url http://127.0.0.1:8001/services/mock-service/plugins/ \
  --data name=oauth2 \
  --data config.scopes=email \
  --data config.scopes=phone \
  --data config.scopes=address \
  --data config.mandatory_scope=true \
  --data config.enable_authorization_code=true
  
  
  # 此时如果再请求， 则会报错， 提示{"error_description":"The access token is missing","error":"invalid_request"}
  
  curl -X GET \
  --url "http://127.0.0.1:8000/mock" \
  --header "Host: mockbin.org"
  
  
  # 现在创建一个 Kong consumer， 名为 thefosk
  curl -X POST \
  --url "http://127.0.0.1:8001/consumers/" \
  --data "username=thefosk"
  
 
  # 创建一个 OAuth2 的应用
  curl -X POST \
  --url "http://127.0.0.1:8001/consumers/thefosk/oauth2/" \
  --data "name=Hello World App" \
  --data "redirect_uris[]=http://konghq.com/"
  
  




```





如果一切顺利， 则在浏览器里访问，http://192.168.33.10:3000/authorize?response_type=code&scope=email&client_id=iFbUz8vX49sRK4Rv0F5X1GXZZJSWNEnJ

得到：



![web 认证页面](https://github.com/googya/gatsby-blog/blob/master/static/img/kong/oauth2%20web%20page.png)


```html
Authorize Hello World App
Note: At this point the user has already been logged-in.

This application would like to have authorization to access your data.

    email - Grant permissions to read your email address


```





获取 token：



```shell
curl -X POST \
  --url "https://127.0.0.1:8443/mock/oauth2/token" \
  --header "Host: mockbin.org" \
  --data "grant_type=authorization_code" \
  --data "client_secret=AfyvI0UU0ky9m1zknjN7KskhiuJMc2vw" \
  --data "client_id=iFbUz8vX49sRK4Rv0F5X1GXZZJSWNEnJ" \
  --data "redirect_uri=http://konghq.com/" \
  --data "code=23XH4AhgSpiQJtX54g1aRYRW2aXIo0fZ" \
  --insecure
```



得到结果如下：



```json
{"refresh_token":"NYGlYYtG4JcmlP22YIwEVDO9Skeq1gFs","token_type":"bearer","access_token":"2UFifHZimyIY7OvA8ybn6L1fIZfoI4tr","expires_in":7200}
```





然后，通过拿到的 token， 访问：



```shell
curl -X GET \
  --url "http://127.0.0.1:8000/mock" \
  --header "Host: mockbin.org" \
  --header "Authorization: bearer 2UFifHZimyIY7OvA8ybn6L1fIZfoI4tr"
```



![获取 Token](https://github.com/googya/gatsby-blog/blob/master/static/img/kong/get%20token.png)







provision_key: bi00j80QjYh8P1tyodTuwW9yoliXLNh6

client_secret":"AfyvI0UU0ky9m1zknjN7KskhiuJMc2vw",

"client_id":"iFbUz8vX49sRK4Rv0F5X1GXZZJSWNEnJ"





[Getting error: Peer authentication failed for user “postgres”, when trying to get pgsql working with rails](https://stackoverflow.com/questions/18664074/getting-error-peer-authentication-failed-for-user-postgres-when-trying-to-ge)


[Kong install for Ubuntu ](https://docs.konghq.com/install/ubuntu/)