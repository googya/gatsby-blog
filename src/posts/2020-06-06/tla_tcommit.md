---
title: "TLA+ TCommit"
date: "2020-06-07"
comments: true
tags: [TLA+, 并发设计, 形式验证, transaction]

---

```tla
------------------------------ MODULE TCommit ------------------------------

CONSTANT RM \* 初始常量， 由外部输入， 输入后不可变
VARIABLE rmState \* 变量， 由外部输入， 输入后可变
TCTypeOK == rmState \in [RM -> {"working", "prepared", "aborted", "committed"}]

TCConsistent == \A r1, r2 \in RM: ~ /\ rmState[r1] = "aborted"
                                    /\ rmState[r2] = "committed" 

TCInit == rmState = [r \in RM |-> "working"]

Prepare(r) == /\ rmState[r] = "working"
              /\ rmState' = [rmState EXCEPT ![r] = "prepared"]

canCommit == \A r \in RM: rmState[r] \in { "committed", "prepared" }
notCommitted == \A r \in RM: rmState[r] /= "committed"

Decide(r) == \/ /\ rmState[r] = "prepared"
                /\ canCommit
                /\ rmState' = [rmState EXCEPT ![r] = "committed"]
             \/ /\ rmState[r] \in {"working", "prepared"}
                /\ notCommitted
                /\ rmState' = [rmState EXCEPT ![r] = "aborted"]

TCNext == \E r \in RM : Prepare(r) \/ Decide(r)

=============================================================================
\* Modification History
\* Last modified Sun Jun 07 16:57:56 JST 2020 by kv
\* Created Sun Jun 07 08:49:46 JST 2020 by kv
```



TLA+ 中涉及到一些离散数学的知识

```matlab
/\ 代表且
\/ 代表或

\A 代表 all, 集合中每一个（任意一个）, 例如：
notCommitted == \A r \in RM: rmState[r] /= "committed"
对于集合 RM 中的任一元素, 其状态都不是 "committed"

\E 表示存在, 集合中存在某状态的元素
TCNext == \E r \in RM : Prepare(r) \/ Decide(r)
RM 中存在元素， 能进行 Prepare 或者 Decide 状态变更操作

~ 表示非， 
TCConsistent == \A r1, r2 \in RM: ~ /\ rmState[r1] = "aborted"
                                    /\ rmState[r2] = "committed" 
对于 RM 中任意两个元素， 其状态不可能一个是 aborted， 另外一个是 committed

```



还有一些非数学相关的知识

```matlab
Prepare(r) == /\ rmState[r] = "working"
              /\ rmState' = [rmState EXCEPT ![r] = "prepared"]
注意其中的 EXCEPT 和 ！
感叹号本身并无实际意义， 只是一个符号。 Prepare 的目的是确保, 	如果当前状态是 working, 那么其下一个状态就是 prepared. 对于其他情况， 不作变更

TCInit == rmState = [r \in RM |-> "working"]
这个有点类似于 Haskell 中的 comprehensive list, 对于集合 RM 中的元素， 对其映射（函数变换）， 生成新集合。

```

