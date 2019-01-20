---
title: "method_missing 方法的使用"
date: "2012-01-10"
comments: true
categories: 
---

之前了解过一点点的ruby元编程，不过仅仅只是了解一些而已，木有实际使用。现在既然我将称为一名正式的ruby程序员，这点东西还是要熟悉一下的。这不，在开发过程中就使用了一点点的技巧。


	class Course < ActiveRecord::Base
	  belongs_to :orator
	  belongs_to :field
	
	  # def orator_name
	  #     return "" if self.orator.blank?
	  #     return self.orator.name
	  #   end
	  # 
	  #   def orator_intro
	  #     return "" if self.orator.blank?
	  #     return self.orator.intro
	  #   end
	
	  def method_missing(sym, *args, &block)
	    case sym
	    when /^orator_(.*)/
	      eval "self.orator.blank? ? '' : self.orator.#{$1}"
	    end
	  end
	
	end

尽管这个实现不是那么的高效，但是至少能用。经常有人给我说，直接调用方法是高效的，但是重复了太多，这违背了DRY的原则，所以美观还是比性能重要。


后面再了解一下分派的实现，据说这比起method_missing 效率更高一些

更新： 昨天犯了一个很低级的错误，写method_missing的时候，没有完成很重要的一步，super

		def method_missing(sym, *args, &block)
		    case sym
		    when /^orator_(.*)/
		      eval "self.orator.blank? ? '' : self.orator.#{$1}"
			else
				***super***
		    end
	    end
一般的方法中可能不会存在问题，但是在rails中，active record的实现中很多地方用到了method_missing，如果不super的话，就会出现很怪异的错误，如果不是对active_record特别的了解的话，还真不知道如何着手解决呢。。。这点要小心了

