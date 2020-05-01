---
title: "basic nix"
date: "2020-04-30"
comments: true
tags: [nix,nixos,nixpkgs]

---



###  basic operations

```shello
sh <(curl https://nixos.org/nix/install) --no-daemon # installatio for single user 
 
nix-env -i <package-name> # reference https://nixos.org/nixpkgs/
nix-env -e package-name # remove package
nix-env -q --installed # query installed  package
nix-env --rollback
nix-env --list-generations # show versions of nix-env
nix-env --switch-generation specific_version # switch to some specific version

# profile
nix-env --switch-profile profile-name

# nix-store
nix-store --gc
nix-collect-garbage -d
```

### run a package without installing it

```shell
nix run nixpkgs.ripgrep -c rg "hello"
```

### garbage

```shell
which rg
readlink $(which rg) # /nix/store/hash-ripgrep-11.0.2/bin/rg
nix-store --query --requisites  /nix/store/hash-ripgrep-11.0.2 # query the dependencies
nix-build '<nixpkgs>' -A tree
nix-store -qR ...

cd /nix/var/nix/gcroots

```



### channel

```shell
nix-channel --add https://nixos.org/channels/nixpkgs-unstable
nix-channel --update
```





## Basic concepts

### Nix

The main command for package management is [**nix-env**](https://nixos.org/nix/manual/#sec-nix-env).  You can use it to install, upgrade, and erase packages, and to query what packages are installed or are available for installation.

#### data structure

```nix
  # The rec keyword denotes a "recursive set",
  
```

### Derivations

A Nix Derivation is a description of how to produce an output directory, usually from some source input files.

>  Building something from    other stuff is called a *derivation* in Nix (as    opposed to sources, which are built by humans instead of    computers).  We perform a derivation by calling    `stdenv.mkDerivation`.    `mkDerivation` is a function provided by    `stdenv` that builds a package from a set of    *attributes*.  A set is just a list of    key/value pairs where each key is a string and each value is an    arbitrary Nix expression.  They take the general form `{    *`name1`* =    *`expr1`*; *`...`*    *`nameN`* =    *`exprN`*; }`.

### Channel

for packages there are many status, for example, stable, nightly, etc. if using a stable channel, all packages you will installed are stable version.

If you want to stay up to date with a set of packages, it’s not very convenient to manually download the latest set of Nix expressions for those packages and upgrade using **nix-env**. Fortunately, there’s a better way: *Nix channels*.

A Nix channel is just a URL that points to a place that contains a set of Nix expressions and a manifest.  Using the command [**nix-channel**](https://nixos.org/nix/manual/#sec-nix-channel) you can automatically stay up to date with whatever is available at that URL.

### Practice

first nix program, default.nix

```nix
{pkgs ? import <nixpkgs> {}
, stdenv ? pkgs.stdenv
, fetchurl ? pkgs.fetchurl
, perl ? pkgs.perl
}:
stdenv.mkDerivation {
	name = "hello-2.1.1";
	builder = ./builder.sh;
	src = fetchurl {
		url = ftp://ftp.nluug.nl/pub/gnu/hello/hello-2.1.1.tar.gz;
		sha256 = "1md7jsfd8pa45z73bz1kszpp01yw6x5ljkjk2hx7wl800any6465";
	};
	inherit perl;
}
```

buidler.sh

```shell
source $stdenv/setup
PATH=$perl/bin:$PATH
tar xvfz $src
cd hello-*
./configure --prefix=$out
make
make install
```

compile:

```shell
nix-env -i -f .
# check result
hello
# hello world!
```

nix functions:

> Nix functions generally have the form `{ x, y, ...,    z }: e` where `x`, `y`,    etc. are the names of the expected arguments, and where    *`e`* is the body of the function.  So here, the entire remainder of the file is the body of the function; when given the required arguments, the body should describe how to build an instance of the Hello package.



```c
#include<stdio.h>
int main() {
  printf("hello");
  return 0;
}
```



```nix
let
  pkgs = import <nixpkgs> {}; # global package
in
stdenv.mkDerivation {
 pname =  "hello-world";
 version = "0.0.1";
 src = ./.;
 buildPhase = ''
  gcc main.c
 '';
 
 installPhase = ''
	 mkdir -p $out/bin
 	 cp a.out $out/bin/hello
 '';
}

nix-build default.nix


```







### references:

[ Learn X in Y minutes ](https://learnxinyminutes.com/docs/nix/)

