---
title: "Elixir Snippets"
date: "2019-01-31"
comments: true
tags: [Elixir, Prgramming]
---

怎么知道某变量的类型呢? 在 iex 下有这样的工具可以用 IEx.Info.info 



```elixir
iex(2)> IEx.Info.info({:a, :b, :c})
[{"Data type", "Tuple"}, {"Reference modules", "Tuple"}]
iex(3)> IEx.Info.info([])
[{"Data type", "List"}, {"Reference modules", "List"}]

```

是不是很有用呢？











后续还会增加内容。

写此文档用的是 Typora