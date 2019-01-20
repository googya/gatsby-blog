---
title: "cfapps mongoid configuration"
date: "2013-07-04"
comments: true
categories: mongo, rails
---


cloudfoundry的mongo的数据库配置有点变动， 是采用了 mongolab 之后， 就需要使用其他的方式了。不过我一直没有找到合适的方法， 使用的是比较笨配置。



缘起， 部署到cf之后， 提示 instance 没有启动， 查看日志， 说mongo的数据库配置有问题。

	
			  Cleaning up the bundler cache.
	-----> Writing config/database.yml to read from DATABASE_URL
	-----> Preparing app for Rails asset pipeline
	       Running: rake assets:precompile
	       rake aborted!
	       Failed to connect to a master node at localhost:27017
	       /tmp/staged/app/vendor/bundle/ruby/1.9.1/gems/mongo-1.9.0/lib/mongo/mongo_client.rb:492:in `connect'
	       /tmp/staged/app/vendor/bundle/ruby/1.9.1/gems/mongo-1.9.0/lib/mongo/mongo_client.rb:698:in `setup'
	       /tmp/staged/app/vendor/bundle/ruby/1.9.1/gems/mongo-1.9.0/lib/mongo/mongo_client.rb:155:in `initialize'
	       /tmp/staged/app/vendor/bundle/ruby/1.9.1/gems/mongo-1.9.0/lib/mongo/util/uri_parser.rb:171:in `new'
	       /tmp/staged/app/vendor/bundle/ruby/1.9.1/gems/mongo-1.9.0/lib/mongo/util/uri_parser.rb:171:in `connection'
	       /tmp/staged/app/vendor/bundle/ruby/1.9.1/gems/mongo-1.9.0/lib/mongo/mongo_client.rb:203:in `from_uri'
	       /tmp/staged/app/vendor/bundle/ruby/1.9.1/gems/mongoid-2.6.0/lib/mongoid/config/database.rb:86:in `master'
	       /tmp/staged/app/vendor/bundle/ruby/1.9.1/gems/mongoid-2.6.0/lib/mongoid/config/database.rb:19:in `configure'
	       /tmp/staged/app/vendor/bundle/ruby/1.9.1/gems/mongoid-2.6.0/lib/mongoid/config.rb:290:in `configure_databases'
	       /tmp/staged/app/vendor/bundle/ruby/1.9.1/gems/mongoid-2.6.0/lib/mongoid/config.rb:111:in `from_hash'
	       /tmp/staged/app/vendor/bundle/ruby/1.9.1/gems/mongoid-2.6.0/lib/mongoid/config.rb:126:in `block in load!'
	       /tmp/staged/app/vendor/bundle/ruby/1.9.1/gems/mongoid-2.6.0/lib/mongoid/config.rb:125:in `tap'
	       /tmp/staged/app/vendor/bundle/ruby/1.9.1/gems/mongoid-2.6.0/lib/mongoid/config.rb:125:in `load!'
	       /tmp/staged/app/vendor/bundle/ruby/1.9.1/gems/mongoid-2.6.0/lib/mongoid.rb:148:in `load!'
	       /tmp/staged/app/vendor/bundle/ruby/1.9.1/gems/mongoid-2.6.0/lib/mongoid/railtie.rb:84:in `block in <class:Railtie>'
	       /tmp/staged/app/vendor/bundle/ruby/1.9.1/gems/railties-3.2.12/lib/rails/initializable.rb:30:in `instance_exec'
	       /tmp/staged/app/vendor/bundle/ruby/1.9.1/gems/railties-3.2.12/lib/rails/initializable.rb:30:in `run'
	       /tmp/staged/app/vendor/bundle/ruby/1.9.1/gems/railties-3.2.12/lib/rails/initializable.rb:55:in `block in run_initializers'
	       /tmp/staged/app/vendor/bundle/ruby/1.9.1/gems/railties-3.2.12/lib/rails/initializable.rb:54:in `each'
	       /tmp/staged/app/vendor/bundle/ruby/1.9.1/gems/railties-3.2.12/lib/rails/initializable.rb:54:in `run_initializers'
	       /tmp/staged/app/vendor/bundle/ruby/1.9.1/gems/railties-3.2.12/lib/rails/application.rb:136:in `initialize!'
	       /tmp/staged/app/vendor/bundle/ruby/1.9.1/gems/railties-3.2.12/lib/rails/railtie/configurable.rb:30:in `method_missing'
	       /tmp/staged/app/config/environment.rb:5:in `<top (required)>'
	       /tmp/staged/app/vendor/bundle/ruby/1.9.1/gems/railties-3.2.12/lib/rails/application.rb:103:in `require'
	       /tmp/staged/app/vendor/bundle/ruby/1.9.1/gems/railties-3.2.12/lib/rails/application.rb:103:in `require_environment!'
	       /tmp/staged/app/vendor/bundle/ruby/1.9.1/gems/railties-3.2.12/lib/rails/application.rb:297:in `block (2 levels) in initialize_tasks'
	       /tmp/staged/app/vendor/bundle/ruby/1.9.1/gems/actionpack-3.2.12/lib/sprockets/assets.rake:93:in `block (2 levels) in <top (required)>'
	       /tmp/staged/app/vendor/bundle/ruby/1.9.1/gems/actionpack-3.2.12/lib/sprockets/assets.rake:60:in `block (3 levels) in <top (required)>'


幸运的是， 可以看到输出正确的关于mongo配置信息， 

	cf logs
	
	

输出信息：

	VCAP_SERVICES={"mongolab-n/a":[{"name":"mongo","label":"mongolab-n/a","plan":"sandbox","credentials":{"uri":"mongodb://CloudFoundry_7ukkkk_gfdkdaep_vphqtlf5:7RO0rjBSFYMBUM26_mb_LPRJGsGVgYAG@ds033828.mongolab.com:33828/CloudFoundry_7uk5v37r_gfdiiiiep"}}]}	
	
	
使用mongo得到链接：

		require 'mongo'
		mongo_uri = 'mongodb://CloudFoundry_7ukkkk_gfdkdaep_vphqtlf5:7RO0rjBSFYMBUM26_mb_LPRJGsGVgYAG@ds033828.mongolab.com:33828/CloudFoundry_7uk5v37r_gfdiiiiep'
		
		 conn = Mongo::Connection.from_uri(mongo_uri) 
		 
使用pry可以很清楚的查看想要的信息， db_name， username, password, host以及port
然后把这些配置写到mongoid.yml中去， 就ok了， 没有好方法。		 
		




