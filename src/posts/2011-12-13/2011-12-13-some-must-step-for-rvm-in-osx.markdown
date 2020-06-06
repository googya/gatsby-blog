---
title: "some must step for rvm in osx"
date: "2011-12-13"
comments: true
categories: 
---
Do you have this line in your ~/.zshrc?

1.[[ -s "$HOME/.rvm/scripts/rvm" ]] && . "$HOME/.rvm/scripts/rvm" 

2.One useful thing I did to keep my old settings: "source ~/.profile" and "source ~/.bash_profile" in my ~/.zshrc . It also keep my .zshrc a bit cleaner.

	
