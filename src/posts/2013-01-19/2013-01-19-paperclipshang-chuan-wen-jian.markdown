---
date: "2013-01-19"
title: "paperclip上传文件"
comments: true
categories: 
---

	最头疼文件上传什么的了，不知道怎么处理比较好。。。不知道什么最佳实践
	
不过最近遇到这样的需求，要上传文件，而且是各种类型的，可把我给“吓坏了”，没办法，到网上搜索了一下，很多都是用Paperclip这个gem， 顺便问了在这方面有经验同事，也说可以尝试一下。

看了一下Paperclip的文档，上面说得不是很详细，但也基本够用；需要定制化的，那得自己看代码、扩展改gem了。

以下是我需要的基本操作流程：

* 1、添加一个附件model， 取名 Attachment, 
* 2、需要几个基本的字段， 字段是以has_attached_file 所带的第一个参数开头的，比如，has_attached_file :data，那几个字段名字就是： 
		
		data_content_type, data_file_name, data_file_size, data_updated_at
		
* 3、与某个model建立关联
	* 需要增加该model的id字段，以便外键关联之
	* 如果有许多model也有附件，则可用多态关联

			belongs_to :attachable, :polymorphic => true 
   * 需要在attachment中添加两个字段：
      	
		
			attachable_id, attachable_type
      	
 [ Polymorphic Associations](http://guides.rubyonrails.org/association_basics.html)
      	
>       	If you have an instance of the Picture model, you can get to its parent via @picture.imageable. To make this work, you need to declare both a foreign key column and a type column in the model that declares the polymorphic interface:





      

   * 对应的model中声明：
   
			has_many :attachments, :as => :attachable
      
* 4、指定文件存放的地址（一般是本地文件系统）
    
      
默认存放的路径是：
    
    	"/system/:class/:attachment/:id_partition/:style/:filename"
    
      
可视情况修改：
    
    	Paperclip.interpolates :parent_id do |a, s|
    	
    		a.instance.attachable.id # a.class  ===>>  Paperclip::Attachment
    	
    	end
    	
  	 
  	   
所以可以自定义为：   
  			

		has_attached_file :data, 
		:url => "/system/blogs/:parent_id/:attachment/:id_partition/:style/:filename"
  	 
* 5、在controller中建立关系时，要格外注意对象生成的先后顺序，

		class Blog < ActiveRecord::Base
			attr_accessible :body, :title, :user_id
			has_many :attachments, :as => :attachable
			belongs_to :user
		end




