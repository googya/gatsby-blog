---
title: "什么是MapReduce"
date: "2013-06-29"
comments: true
categories: MapReduce ML 
---
在MongoDB当中， MapReduce是一个可以并行化到多个服务器的聚合方法。它会拆分问题，再将各个部分发送到不同的机器， 让每台机器都完成一部分。当所有机器都完成的时候， 再把结果汇集起来形成最终完整的结果。

 
MapReduce需要几个步骤。最开始是映射（map）， 将 操作 映射 到集合中的每个文档。这个操作要么 “do nothing”，要么"emit these keys with X values", 然后就是中间环节，称作 洗牌（shuffle）， 按照键分组， 并将产生的键值组成列表放到对应的键中。化简（reduce）则把列表中的值化简成一个单值。这个值被返回，然后接着进行洗牌， 直到每个键的列表只有一个值为止。

map方法()：
		
		map = function(){
			for(var  key in this){
				emit(key, {count : 1});
			}
		};
		
		
		
reduce方法()：


		 reduce = function(key, emits) { 
		 	total = 0;			 for (var i in emits) {				 total += emits[i].count;				 }		 	return {"count" : total}; 		 }

对于reduce可以这样使用
		r1 = reduce("x", [{count : 1, id : 1}, {count : 1, id : 2}])
				r2 = reduce("x", [{count : 1, id : 3}]);				reduce("x", [r1, r2])
		
		
数据库中的记录如下：

				{ "_id" : ObjectId("513c62592a1b9fda7f000045"), "url" : "http://ecx.images-amazon.com/images/I/51sf-lIfZrL.jpg", "height" : 500, "width" : 500, "type" : "large", "updated_at" : ISODate("2013-03-10T10:38:30.386Z"), "created_at" : ISODate("2013-03-10T10:38:30.386Z") }
			{ "_id" : ObjectId("513c6e352a1b9f3ac300024d"), "url" : "http://ecx.images-amazon.com/images/I/51JOaE64EFL._SL30_.jpg", "height" : 30, "width" : 16, "type" : "swatch", "item_id" : ObjectId("513c6e352a1b9f3ac3000253") }
			{ "_id" : ObjectId("513c6e352a1b9f3ac300024e"), "url" : "http://ecx.images-amazon.com/images/I/51JOaE64EFL._SL75_.jpg", "height" : 75, "width" : 40, "type" : "small", "item_id" : ObjectId("513c6e352a1b9f3ac3000253") }
			{ "_id" : ObjectId("513c6e352a1b9f3ac300024f"), "url" : "http://ecx.images-amazon.com/images/I/51JOaE64EFL._SL75_.jpg", "height" : 75, "width" : 40, "type" : "thumbnail", "item_id" : ObjectId("513c6e352a1b9f3ac3000253") }
			{ "_id" : ObjectId("513c6e352a1b9f3ac3000250"), "url" : "http://ecx.images-amazon.com/images/I/51JOaE64EFL._SL110_.jpg", "height" : 110, "width" : 58, "type" : "tiny", "item_id" : ObjectId("513c6e352a1b9f3ac3000253") }
			{ "_id" : ObjectId("513c6e352a1b9f3ac3000251"), "url" : "http://ecx.images-amazon.com/images/I/51JOaE64EFL._SL160_.jpg", "height" : 160, "width" : 85, "type" : "medium", "item_id" : ObjectId("513c6e352a1b9f3ac3000253") }
			{ "_id" : ObjectId("513c6e352a1b9f3ac3000252"), "url" : "http://ecx.images-amazon.com/images/I/51JOaE64EFL.jpg", "height" : 500, "width" : 265, "type" : "large", "item_id" : ObjectId("513c6e352a1b9f3ac3000253") }			
执行MapReduce：
	db.blog.mapReduce(map, reduce, {out : "result_bak" })

注意，out 为新生成的一个collection， 可以使用db.result_bak.find()来查看
 		
结果如下：

	{
	"result" : "result_bak",
	"timeMillis" : 151,
	"counts" : {
		"input" : 7,
		"emit" : 43,
		"reduce" : 6,
		"output" : 8
	},
	"ok" : 1,
	}
	
生成的result_bak的结果如下：

db.result_bak.find()

	{ "_id" : "_id", "value" : { "count" : 7 } }
	{ "_id" : "created_at", "value" : { "count" : 1 } }
	{ "_id" : "height", "value" : { "count" : 7 } }
	{ "_id" : "item_id", "value" : { "count" : 6 } }
	{ "_id" : "type", "value" : { "count" : 7 } }
	{ "_id" : "updated_at", "value" : { "count" : 1 } }
	{ "_id" : "url", "value" : { "count" : 7 } }
	{ "_id" : "width", "value" : { "count" : 7 } }	
	
