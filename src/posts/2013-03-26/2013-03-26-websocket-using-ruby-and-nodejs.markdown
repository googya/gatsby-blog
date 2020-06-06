---
title: "websocket using ruby and nodejs"
date: "2013-03-26"
comments: true
categories: 
---
在看HTML5高级程序设计时，简单的了解了一下websocket, 然后做了个简单的demo
服务端用ruby实现，结合em-websocket这个gem，客户端使用的是nodejs的ws这个插件。

	require 'em-websocket'

	EM.run {
	
	EM::WebSocket.run(:host => "0.0.0.0", :port => 8080) do |ws|
	 		ws.onopen { |handshake|
	puts "WebSocket connection open"

      # Access properties on the EM::WebSocket::Handshake object, e.g.
      # path, query_string, origin, headers

      # Publish message to the client
      ws.send "Hello Client, you connected to #{handshake.path}"
    }

    ws.onclose { puts "Connection closed" }

    ws.onmessage { |msg|
      puts "Recieved message: #{msg}"
      ws.send "Pong: #{msg}"
    }
	  end
	}
	
客户端使用的是ws, 安装方法， 

		sudo npm install ws -g

		wscat -c ws://localhost:8080
		

连接之后，就可以相互通信了。

以后在添加网页上互动的例子

### **to be continued….**
		
