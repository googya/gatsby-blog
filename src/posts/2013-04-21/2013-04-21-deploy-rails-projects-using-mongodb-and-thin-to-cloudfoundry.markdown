---
title: "deploy rails projects using MongoDB and Thin to CloudFoundry"
date: "2013-04-21"
comments: true
categories: 
---

我部署一个Rails项目到CloudFoundry， 过程颇为不顺，遇到很多问题，不过问题主要是自找的，没有仔细的看官方文档，想当然的觉得是那样，结果走了弯路。以下说说主要的问题。

该项目数据库使用的是MongoDB， 部署到CloudFoundry上， app server是默认的，即 WEBrick。

数据库问题：



* 听说CloudFoundry支持MongoDB， 所以使用了它。以为cf会支持它所有的版本的，当时没注意，用了最新的版本的mongoid。
结果上去，死活不成功。
	

		解决办法： 降 mongoid 到 2.6或者以下的版本。并且改写 对应的 mongoid.yml 配置。

* 生产环境下数据库配置：


	
		production:
		 host: <%= JSON.parse( ENV['VCAP_SERVICES'] )['mongodb-2.0'].first['credentials']['hostname'] rescue 'localhost'%>
		 port: <%= JSON.parse( ENV['VCAP_SERVICES'] )['mongodb-2.0'].first['credentials']['port'] rescue '27017'%>
		 database: <%= JSON.parse( ENV['VCAP_SERVICES'] )['mongodb-2.0'].first['credentials']['db'] rescue 'buyintime_prod' %>
		 username: <%= JSON.parse( ENV['VCAP_SERVICES'] )['mongodb-2.0'].first['credentials']['username'] rescue ''%>
		 password: <%= JSON.parse( ENV['VCAP_SERVICES'] )['mongodb-2.0'].first['credentials']['password'] rescue ''%>
		 
 	开始的时候数据库的配置没按照了官方给的demo做，试了一些野路子，结果在这里困了很久。
	
	
			


App Server问题：
	
默认的WEBrick在表单提交的内容超出一定长度之后会抛出异常。



		415     def read_request_line(socket)
		416       @request_line = read_line(socket, MAX_URI_LENGTH) if socket
		417       if @request_line.bytesize >= MAX_URI_LENGTH and @request_line[-1, 1] != LF
		418         raise HTTPStatus::RequestURITooLarge
		419       end
		420       @request_time = Time.now
		421       raise HTTPStatus::EOFError unless @request_line
		422       if /^(\S+)\s+(\S++)(?:\s+HTTP\/(\d+\.\d+))?\r?\n/mo =~ @request_line
		423         @request_method = $1
		424         @unparsed_uri   = $2
		425         @http_version   = HTTPVersion.new($3 ? $3 : "0.9")
		426       else
		427         rl = @request_line.sub(/\x0d?\x0a\z/o, '')
		428         raise HTTPStatus::BadRequest, "bad Request-Line `#{rl}'."
		429       end
		430     end
	
该项目的提交的表单内容略长，不过也是在很多server可以接受的范围，但WEBrick不行。于是把它给换成了Thin，做的方法也很简单，在Gemfile中增加：
		
		gem 'thin'
		

查看数据库存储的内容：

cf提供了数据库访问的客户端，需要这样使用：

	vmc tunnel
	
	1: time
	2: dos
	
	Which service instance?> 1
	
	
	1: none
	2: mongo
	3: mongodump
	4: mongorestore
	Which client would you like to start?> 1
	
	
	Opening tunnel on port 10000... OK

	Service connection info:
	  username : ooooooo
	  password : xxxxxxx
	  name     : db
	  url      : mongodb://gggyyyyyy@167.30.48.71:25238/db

把要访问的数据库的信息显示出来了。

然后另开一个console，在提示选择客户端的时候，选择 2： mongo即可，输入相应的认证信息，用户名、密码：

	
	use db
	db.auth(username, password)
	
如果了解了的话，其实没什么，主要是不熟悉"规则"。云平台看似用起来很方便，其实还是有很多需要[注意的细节。](http://)


	
