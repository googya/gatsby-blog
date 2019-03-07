---
title: "初识 BTrace"
date: "2019-03-07"
comments: true
tags: [JAVA, JVM]

---



作为开发， 难免会遇到一些问题， 非线上的问题， 一般都能通过各种方法（断点、log等）找到原因， 修复之。问题一旦出现在线上， 就比较麻烦了，不方便加日志， 也不好设置断点， 甚至都不能重启（需保留现场）。之前有用 DTrace 追踪程序的经验， 我想应该可以迁移过来， 但是发现没有对应的 Java 支持。



```shel

➜  gatsby-blog git:(master) ✗ sudo dtrace -l | rg ruby
dtrace: system integrity protection is on, some features will not be available

44511  ruby52713              ruby                       rb_ary_drop array-create
44512  ruby52713              ruby                    rb_ary_product array-create
44513  ruby52713              ruby       rb_ary_repeated_combination array-create
44514  ruby52713              ruby       rb_ary_repeated_permutation array-create
44515  ruby52713              ruby                rb_ary_combination array-create
44516  ruby52713              ruby                rb_ary_permutation array-create
44517  ruby52713              ruby                     rb_ary_sample array-create
44518  ruby52713              ruby                         rb_ary_or array-create
44519  ruby52713              ruby                        rb_ary_and array-create
44520  ruby52713              ruby                       rb_ary_diff array-create
44521



```

但 Java 的没有：

```shell
➜  gatsby-blog git:(master) ✗ sudo dtrace -l | rg java
dtrace: system integrity protection is on, some features will not be available

```



搜索结果，得知 BTrace 用得相当广泛。原理暂且不深究， 看看怎么用它。

需到 github 上下载 realase 的版本， 本地安装好。

设置 BTRACE_HOME ( btrace 的安装目录）

举个例子：

以下是一段 Java 代码， 希望追踪 add 方法的调用情况， 我们可以这么来做：

```java

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import java.lang.management.ManagementFactory;

public class BTraceTest {
  public int add(int a ,int b){
    return a+b;
  }
  public static void main(String[] args) throws IOException {
    String id = ManagementFactory.getRuntimeMXBean().getName().split("@")[0];
    System.out.println("process id is " + id);

    BTraceTest traceTest= new BTraceTest();
    BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
    for (int i = 0; i < 10; i++) {
      reader.readLine();
      int a  = (int)Math.round(Math.random()*1000);
      int b  = (int)Math.round(Math.random()*1000);
      System.out.println(traceTest.add(a,b));
    }
  }
}
```

编译之， 

```shell
javac BTraceTest.java
```



然后写个 btrace 脚本（也是Java 代码）

```java


import com.sun.btrace.annotations.*;
import static com.sun.btrace.BTraceUtils.*;

@BTrace
public class TracingScript {
  @OnMethod(clazz="BTraceTest",method="add",location=@Location(Kind.RETURN))
  public static void func(@Self BTraceTest instance,int a,int b,@Return int result){
    println("info:");
    jstack();
    println(strcat("方法参数A：",str(a)));
    println(strcat("方法参数B：",str(b)));
    println(strcat("方法返回C：",str(result)));
  }
}
```



然后执行脚本：



```shel

btrace PID TracingScript.java

```



结果：



 ```shell


➜  /tmp
➜  /tmp java BTraceTest
process id is 61313
1
684
2
1068
1
514
2
552
3
1309
2
1529
4
1104
6
1269

➜  tmp btrace 61313 TracingScript.java
打印堆栈:
BTraceTest.add(BTraceTest.java:12)
BTraceTest.main(BTraceTest.java:25)
方法参数A：160
方法参数B：944
方法返回C：1104
打印堆栈:
BTraceTest.add(BTraceTest.java:12)
BTraceTest.main(BTraceTest.java:25)
方法参数A：362
方法参数B：907
 ```



基本的操作便是如此。后续如有需要，深入的学习一下。