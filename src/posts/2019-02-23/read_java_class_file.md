---
title: "How JVM loading class File"
date: "2019-02-23"
comments: true
tags: [JAVA, JVM, Rust]
---

JVM 是如何运行的，我看过很多的资料， 但一直没搞懂， 除天资愚钝之外， 我想更多是懒吧， 懒得思考， 懒得深入。

> 而世之奇伟、瑰怪、非常之观，常在於险远，而人之所罕至焉，故非有志者不能至也

诚哉斯言！

我之前也学习过 JVM， 尤其对其指令， 相当熟悉， 限于当时有限的知识积累， 对 JVM 的了解相当浅， 后来没弄 Java， 遂渐渐淡忘。 近来有机会再次接触 Java， 想把这功课做一做。JVM 相当复杂， 涉及东西多， 希望我能有毅力坚持下去。

首先从 JVM 如何读取 class 文件说起。[class 文件的结构](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-4.html)，文档中有详细的介绍。class 文件经 Java 编译器编译而得来， 比如如下代码：

```java
public class Hello {
  private String msg;
  public Hello(String msg) {
    this.msg = msg;
  }

  public String getMsg() {
    return this.msg;
  }

  public void sayHello() {
    System.out.println(this.getMsg());
  }
}
```

经过编译之后， 

```shell
 javac Hello.java 
```

生成  Hello.class 文件， 即为 Java 字节码文件。JVM 变是要读取此文件， 后执行相关操作。用二进制查看器， 可以看到，



```shell
hexyl Hello.class || cat Hello.class | xxd
# 得到
┌────────┬─────────────────────────┬─────────────────────────┬────────┬────────┐
│00000000│ ca fe ba be 00 00 00 37 ┊ 00 22 0a 00 07 00 14 09 │××××0007┊0"_0•0•_│
│00000010│ 00 06 00 15 09 00 16 00 ┊ 17 0a 00 06 00 18 0a 00 │0•0•_0•0┊•_0•0•_0│
│00000020│ 19 00 1a 07 00 1b 07 00 ┊ 1c 01 00 03 6d 73 67 01 │•0••0••0┊••0•msg•│
│00000030│ 00 12 4c 6a 61 76 61 2f ┊ 6c 61 6e 67 2f 53 74 72 │0•Ljava/┊lang/Str│
│00000040│ 69 6e 67 3b 01 00 06 3c ┊ 69 6e 69 74 3e 01 00 15 │ing;•0•<┊init>•0•│
│00000050│ 28 4c 6a 61 76 61 2f 6c ┊ 61 6e 67 2f 53 74 72 69 │(Ljava/l┊ang/Stri│
│00000060│ 6e 67 3b 29 56 01 00 04 ┊ 43 6f 64 65 01 00 0f 4c │ng;)V•0•┊Code•0•L│
│00000070│ 69 6e 65 4e 75 6d 62 65 ┊ 72 54 61 62 6c 65 01 00 │ineNumbe┊rTable•0│
│00000080│ 06 67 65 74 4d 73 67 01 ┊ 00 14 28 29 4c 6a 61 76 │•getMsg•┊0•()Ljav│
│00000090│ 61 2f 6c 61 6e 67 2f 53 ┊ 74 72 69 6e 67 3b 01 00 │a/lang/S┊tring;•0│
│000000a0│ 08 73 61 79 48 65 6c 6c ┊ 6f 01 00 03 28 29 56 01 │•sayHell┊o•0•()V•│
│000000b0│ 00 0a 53 6f 75 72 63 65 ┊ 46 69 6c 65 01 00 0a 48 │0_Source┊File•0_H│
│000000c0│ 65 6c 6c 6f 2e 6a 61 76 ┊ 61 0c 00 0a 00 11 0c 00 │ello.jav┊a_0_0•_0│
│000000d0│ 08 00 09 07 00 1d 0c 00 ┊ 1e 00 1f 0c 00 0e 00 0f │•0_•0•_0┊•0•_0•0•│
│000000e0│ 07 00 20 0c 00 21 00 0b ┊ 01 00 05 48 65 6c 6c 6f │•0 _0!0•┊•0•Hello│
│000000f0│ 01 00 10 6a 61 76 61 2f ┊ 6c 61 6e 67 2f 4f 62 6a │•0•java/┊lang/Obj│
│00000100│ 65 63 74 01 00 10 6a 61 ┊ 76 61 2f 6c 61 6e 67 2f │ect•0•ja┊va/lang/│
│00000110│ 53 79 73 74 65 6d 01 00 ┊ 03 6f 75 74 01 00 15 4c │System•0┊•out•0•L│
│00000120│ 6a 61 76 61 2f 69 6f 2f ┊ 50 72 69 6e 74 53 74 72 │java/io/┊PrintStr│
│00000130│ 65 61 6d 3b 01 00 13 6a ┊ 61 76 61 2f 69 6f 2f 50 │eam;•0•j┊ava/io/P│
│00000140│ 72 69 6e 74 53 74 72 65 ┊ 61 6d 01 00 07 70 72 69 │rintStre┊am•0•pri│
│00000150│ 6e 74 6c 6e 00 21 00 06 ┊ 00 07 00 00 00 01 00 02 │ntln0!0•┊0•000•0•│
│00000160│ 00 08 00 09 00 00 00 03 ┊ 00 01 00 0a 00 0b 00 01 │0•0_000•┊0•0_0•0•│
│00000170│ 00 0c 00 00 00 2a 00 02 ┊ 00 02 00 00 00 0a 2a b7 │0_000*0•┊0•000_*×│
│00000180│ 00 01 2a 2b b5 00 02 b1 ┊ 00 00 00 01 00 0d 00 00 │0•*+×0•×┊000•0_00│
│00000190│ 00 0e 00 03 00 00 00 03 ┊ 00 04 00 04 00 09 00 05 │0•0•000•┊0•0•0_0•│
│000001a0│ 00 01 00 0e 00 0f 00 01 ┊ 00 0c 00 00 00 1d 00 01 │0•0•0•0•┊0_000•0•│
│000001b0│ 00 01 00 00 00 05 2a b4 ┊ 00 02 b0 00 00 00 01 00 │0•000•*×┊0•×000•0│
│000001c0│ 0d 00 00 00 06 00 01 00 ┊ 00 00 08 00 01 00 10 00 │_000•0•0┊00•0•0•0│
│000001d0│ 11 00 01 00 0c 00 00 00 ┊ 27 00 02 00 01 00 00 00 │•0•0_000┊'0•0•000│
│000001e0│ 0b b2 00 03 2a b6 00 04 ┊ b6 00 05 b1 00 00 00 01 │•×0•*×0•┊×0•×000•│
│000001f0│ 00 0d 00 00 00 0a 00 02 ┊ 00 00 00 0c 00 0a 00 0d │0_000_0•┊000_0_0_│
│00000200│ 00 01 00 12 00 00 00 02 ┊ 00 13                   │0•0•000•┊0•      │
└────────┴─────────────────────────┴─────────────────────────┴────────┴────────┘
```





而后， 可通过 

```shell
javap -v Hello.class 

Classfile /private/tmp/Hello.class
  Last modified 2019年2月23日; size 522 bytes
  MD5 checksum ba743ba6d10b9cbdeb379cb7eb58d56d
  Compiled from "Hello.java"
public class Hello
  minor version: 0
  major version: 55
  flags: (0x0021) ACC_PUBLIC, ACC_SUPER
  this_class: #6                          // Hello
  super_class: #7                         // java/lang/Object
  interfaces: 0, fields: 1, methods: 3, attributes: 1
Constant pool:
   #1 = Methodref          #7.#20         // java/lang/Object."<init>":()V
   #2 = Fieldref           #6.#21         // Hello.msg:Ljava/lang/String;
   #3 = Fieldref           #22.#23        // java/lang/System.out:Ljava/io/PrintStream;
   #4 = Methodref          #6.#24         // Hello.getMsg:()Ljava/lang/String;
   #5 = Methodref          #25.#26        // java/io/PrintStream.println:(Ljava/lang/String;)V
   #6 = Class              #27            // Hello
   #7 = Class              #28            // java/lang/Object
   #8 = Utf8               msg
   #9 = Utf8               Ljava/lang/String;
  #10 = Utf8               <init>
  #11 = Utf8               (Ljava/lang/String;)V
  #12 = Utf8               Code
  #13 = Utf8               LineNumberTable
  #14 = Utf8               getMsg
  #15 = Utf8               ()Ljava/lang/String;
  #16 = Utf8               sayHello
  #17 = Utf8               ()V
  #18 = Utf8               SourceFile
  #19 = Utf8               Hello.java
  #20 = NameAndType        #10:#17        // "<init>":()V
  #21 = NameAndType        #8:#9          // msg:Ljava/lang/String;
  #22 = Class              #29            // java/lang/System
  #23 = NameAndType        #30:#31        // out:Ljava/io/PrintStream;
  #24 = NameAndType        #14:#15        // getMsg:()Ljava/lang/String;
  #25 = Class              #32            // java/io/PrintStream
  #26 = NameAndType        #33:#11        // println:(Ljava/lang/String;)V
  #27 = Utf8               Hello
  #28 = Utf8               java/lang/Object
  #29 = Utf8               java/lang/System
  #30 = Utf8               out
  #31 = Utf8               Ljava/io/PrintStream;
  #32 = Utf8               java/io/PrintStream
  #33 = Utf8               println
{
  public Hello(java.lang.String);
    descriptor: (Ljava/lang/String;)V
    flags: (0x0001) ACC_PUBLIC
    Code:
      stack=2, locals=2, args_size=2
         0: aload_0
         1: invokespecial #1                  // Method java/lang/Object."<init>":()V
         4: aload_0
         5: aload_1
         6: putfield      #2                  // Field msg:Ljava/lang/String;
         9: return
      LineNumberTable:
        line 3: 0
        line 4: 4
        line 5: 9

  public java.lang.String getMsg();
    descriptor: ()Ljava/lang/String;
    flags: (0x0001) ACC_PUBLIC
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0
         1: getfield      #2                  // Field msg:Ljava/lang/String;
         4: areturn
      LineNumberTable:
        line 8: 0

  public void sayHello();
    descriptor: ()V
    flags: (0x0001) ACC_PUBLIC
    Code:
      stack=2, locals=1, args_size=1
         0: getstatic     #3                  // Field java/lang/System.out:Ljava/io/PrintStream;
         3: aload_0
         4: invokevirtual #4                  // Method getMsg:()Ljava/lang/String;
         7: invokevirtual #5                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
        10: return
      LineNumberTable:
        line 12: 0
        line 13: 10
}
SourceFile: "Hello.java"
```

这就是 class 文件的基本内容了。

如果我们根据 class 的规格说明， 用程序能访问到对应信息， 那么也就可以知道 JVM 读取 class 文件的过程了。Rust 有个库， **[classfile-parser](https://github.com/Palmr/classfile-parser)**  能解文件格式（它是基于 [nom](https://github.com/Geal/nom) 专门用于 parser ）， 有了这些帮手之后， 用程序查看 class 的结构就想对容易多。

先生成一个 Rust 项目， 并添加 classfile-parser 依赖。

```shell
cargo init load_class
cargo add classfile-parser
```



主文件如下：

```rust

extern crate classfile_parser;

use classfile_parser::class_parser;
use classfile_parser::constant_info::*;

fn main() {
    let classfile_bytes = include_bytes!("/tmp/Hello.class");

    match class_parser(classfile_bytes) {
        Ok((_, class_file)) => {
            println!(
                "version {},{} \
                 const_pool({}), \
                 this=const[{}], \
                 super=const[{}], \
                 interfaces({}), \
                 fields({}), \
                 methods({}), \
                 attributes({}), \
                 access({:?})",
                class_file.major_version,
                class_file.minor_version,
                class_file.const_pool_size,
                class_file.this_class,
                class_file.super_class,
                class_file.interfaces_count,
                class_file.fields_count,
                class_file.methods_count,
                class_file.attributes_count,
                class_file.access_flags
            );

            let constant_pool = class_file.const_pool;
            let methods = class_file.methods;
            let len = methods.len();
            for i in 0..len {
                let z = &constant_pool[(methods[i].name_index - 1) as usize];
                match &z {
                    ConstantInfo::Utf8(k) => {
                        match k {
                            Utf8Constant { utf8_string, bytes: _ } => {
                                println!(" method name is {}", utf8_string);
                            }
                        }
                    }
                    _ => {
                        println!("not valid")
                    }
                }
            }
        }
        Err(_) => panic!("Failed to parse"),
    };
}
```

可以打印出类的基本结构和方法名称

```shell
➜  rust_jvm git:(master) cargo run
    Finished dev [unoptimized + debuginfo] target(s) in 0.18s
     Running `target/debug/load_demo`
version 55,0 const_pool(34), this=const[6], super=const[7], interfaces(0), fields(1), methods(3), attributes(1), access(PUBLIC | SUPER)
 method name is <init>
 method name is getMsg
 method name is sayHello
```

参照 class 的格式， 其他信息也能找到。

尽管只是初窥了结构， 但给了我很大的信心， 接下来， 就应该让这个结构体在程序中活起来。