---
title: "coffeescript study 1"
date: "2012-09-15"
comments: true
categories: coffeescript
---

本例中，很多代码都是参看别人的，略有修改，使得示例代码能正常的运行，主要意图在于掌握用coffeescript写代码，编译为JavaScript，然后用Nodejs或者Ringo执行的过程。

首先，编写coffeescript代码，一个TodoList
	
		class TodoList
			constructor: ->
				@items = []
				
			add: (todoItem) ->
				@items.push(todoItem)
			
			remove: (todoItem) ->
				@items = _.reject @items, (existingTodo) ->
					existingTodo == todoItem
			
			count: ->
				@items.length
		
			summary: ->
				this.puts("=====================")
				this.puts("=You have #{this.count()} todo items")
				
				for todo in @items
					this.puts(todo)
				this.puts("--------------------")
		
			puts: (log)->
				console.log(log)
	
	
		module.exports = TodoList
	
此处使用CommonJS modules 导出变量，对于它我知之甚少，我认为主要的意思就是说，JavaScript没有namespace的概念，如果js文件很分散的话，依赖就会成为一个很严重的问题，而 Commonjs 则为此而生，专门解决文件依赖问题。同时发现，可以像写 Ruby 代码一样写 Javascript 了，我认为对我这个不是很了解 js 但是需要 js 的人来说可谓及时雨。

编译的 javascript 代码如下：

	// Generated by CoffeeScript 1.3.3
		(function() {
		  var TodoList;
		
		  TodoList = (function() {
		
		    function TodoList() {
		      this.items = [];
		    }
		
		    TodoList.prototype.add = function(todoItem) {
		      return this.items.push(todoItem);
		    };
		
		    TodoList.prototype.remove = function(todoItem) {
		      return this.items = _.reject(this.items, function(existingTodo) {
		        return existingTodo === todoItem;
		      });
		    };
		
		    TodoList.prototype.count = function() {
		      return this.items.length;
		    };
		
		    TodoList.prototype.summary = function() {
		      var todo, _i, _len, _ref;
		      this.puts("=====================");
		      this.puts("=You have " + (this.count()) + " todo items");
		      _ref = this.items;
		      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
		        todo = _ref[_i];
		        this.puts(todo);
		      }
		      return this.puts("--------------------");
		    };
		
		    TodoList.prototype.puts = function(log) {
		      return console.log(log);
		    };
		
		    return TodoList;
		
		  })();
		
		  module.exports = TodoList;
		
		}).call(this);


接着编写调用此代码的文件，也是用 coffeescript 来实现，代码如下：


		global._ = require("./Underscore.js")
		
		# eval(require("fs").readFileSync("./todo.js", 'utf8'))
		
		TodoList = require './todo'
		
		list = new TodoList()
		
		list.add("install CoffeeScript")
		list.add("install Node")
		list.add("install coffee-mode")
		list.remove("install CoffeeScript")
		
		list.summary()

开始准备使用 nodejs 的文件操作模块读取另一个 js 文件，不过试验了几次，没有成功，等以后了解了 nodejs 试着用一下。


与 TodoList 类似，需要将 app.coffee 编译为 javascript， 编译的结果如下：


		// Generated by CoffeeScript 1.3.3
		(function() {
		  var TodoList, list;
		
		  global._ = require("./Underscore.js");
		
		  TodoList = require('./todo');
		
		  list = new TodoList();
		
		  list.add("install CoffeeScript");
		
		  list.add("install Node");
		
		  list.add("install coffee-mode");
		
		  list.remove("install CoffeeScript");
		
		  list.summary();
		
		}).call(this);

有个地方需要注意，使用 ringo 编译的时候，没有问题，得到的结果是：

		=====================
		=You have 2 todo items
		install Node
		install coffee-mode
		--------------------
		
~~如果是使用 node 编译，就会报错, 后来看起来是正常的
~~

初学 coffeescript 很多东西都不熟悉，慢慢的摸索吧，最吸引我的地方在于它类似 Ruby 的风格和书写的简洁，而且可以对照编译出来的 javascript ，了解一下 javascript 的比较本质的东西。下一步我准备练习一下 coffeescript 和 jQuery 的结合。
		
