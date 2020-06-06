---
title: "ruby中常见全局变量之含义"
date: "2012-09-15"
comments: true
categories: ruby
---
常见的常量如下（摘自[Ruby QuickRef](http://www.zenspider.com/Languages/Ruby/QuickRef.html)）

	$!         The exception information message set by 'raise'.
	$@         Array of backtrace of the last exception thrown.
	$&         The string matched by the last successful match.
	$`         The string to the left  of the last successful match.
	$'         The string to the right of the last successful match.
	$+         The highest group matched by the last successful match.
	$1         The Nth group of the last successful match. May be > 1.
	$~         The information about the last match in the current scope.
	$=         The flag for case insensitive, nil by default.
	$/         The input record separator, newline by default.
	$\         The output record separator for the print and IO#write. Default is nil.
	$,         The output field separator for the print and Array#join.
	$;         The default separator for String#split.
	$.         The current input line number of the last file that was read.
	$<         The virtual concatenation file of the files given on command line (or from $stdin if no files were given).
	$>         The default output for print, printf. $stdout by default.
	$_         The last input line of string by gets or readline.
	$0         Contains the name of the script being executed. May be assignable.
	$*         Command line arguments given for the script sans args.
	$$         The process number of the Ruby running this script.
	$?         The status of the last executed child process.
	$:         Load path for scripts and binary modules by load or require.
	$"         The array contains the module names loaded by require.
	$DEBUG     The status of the -d switch.
	$FILENAME  Current input file from $<. Same as $<.filename.
	$LOAD_PATH The alias to the $:.
	$stderr    The current standard error output.
	$stdin     The current standard input.
	$stdout    The current standard output.
	$VERBOSE   The verbose flag, which is set by the -v switch.
	$-0        The alias to $/.
	$-a        True if option -a is set. Read-only variable.
	$-d        The alias to $DEBUG.
	$-F        The alias to $;.
	$-i        In in-place-edit mode, this variable holds the extension, otherwise nil.
	$-I        The alias to $:.
	$-l        True if option -l is set. Read-only variable.
	$-p        True if option -p is set. Read-only variable.
	$-v        The alias to $VERBOSE
	$-w        True if option -w is set.



以前也注意过这些常量，但把它看做很神奇的东西，不敢去碰它，只是用的时候翻一下资料而已，没有试图真正的去理解。今天突然用到了，于是下决心把它研究一下，也感觉不是那么难以理解。参照了[Cryptic Ruby Global Variables and Their Meanings](http://jimneath.org/2010/01/04/cryptic-ruby-global-variables-and-their-meanings.html)。

**$: (Dollar Colon)**

$: is basically a shorthand version of $LOAD_PATH. $: contains an array of paths that your script will search through when using require.

	>> $: === $LOAD_PATH
	=> true
	>> $:
	=> [".", "/Users/jimneath/.ruby"]
	>> $: << '/test/path' # Add a directory to load path
	=> [".", "/Users/jimneath/.ruby", "/test/path"]


**$0 (Dollar Zero)**

$0 contains the name of the ruby program being run. This is typically the script name.

example.rb
		
	puts $0
	
	
	Jims-MacBook-Pro:~/Desktop ruby example.rb
	example.rb
	Jims-MacBook-Pro:~/Desktop irb
	>> $0
	=> "irb"



**$* (Dollar Splat)**

$* is basically shorthand for ARGV. $* contains the command line arguments that were passed to the script.

example.rb

	puts "$*: " << $*.inspect
	puts "ARGV: " << ARGV.inspect


	Jims-MacBook-Pro:~/Desktop ruby example.rb hello world
	$*: ["hello", "world"]
	ARGV: ["hello", "world"]

**$? (Dollar Question Mark)**

$? returns the exit status of the last child process to finish.

	>> `pwd` # Show current directory
	=> "/Users/jimneath/Desktop\n"
	>> $?
	=> #<Process::Status: pid=17867,exited(0)>
	>> `fake command` # This will fail
	(irb):7: command not found: fake command
	=> ""
	>> $?
	=> #<Process::Status: pid=17871,exited(127)>

**$$ (Dollar Dollar)**

$$ returns the process number of the program currently being ran.

	Jims-MacBook-Pro:~/Desktop irb
	>> $$ # Show process id
	=> 17916
	>> puts `ps aux | grep irb`
	jimneath 17919   0.0  0.0   599780    388 s000  R+    2:51PM   0:00.00 grep irb
	jimneath 17917   0.0  0.0   600252    680 s000  S+    2:51PM   0:00.01 sh -c ps aux | grep irb
	jimneath 17916   0.0  0.6    85336  12568 s000  S+    2:51PM   0:00.75 irb


### Regular Expression Global Variables


**$~ (Dollar Tilde)**

$~ contains the MatchData from the previous successful pattern match.

	>> "hello world".match(/world/) === $~
	=> true
	>> $~
	=> #<MatchData:0x12be0e8>
	>> $~.to_a
	=> ["world"]

##	$1, $2, $3, $4 etc

$1-$9 represent the content of the previous successful pattern match.

	>> "hello world".match(/(hello) (world)/) 
	=> #<MatchData:0x12b06f0>
	>> $1
	=> "hello"
	>> $2
	=> "world"
	>> $3
	=> nil

**$& (Dollar Ampersand)**

$& contains the matched string from the previous successful pattern match.

	>> "the quick brown fox".match(/quick.*fox/)
	=> #<MatchData:0x129cc40>
	>> $&
	=> "quick brown fox"

**$+ (Dollar Plus)**

$+ contains the last match from the previous successful pattern match.

	>> "the quick brown fox".match(/(quick) (brown) (fox)/)
	=> #<MatchData:0x1294a04>
	>> $~.to_a
	=> ["quick brown fox", "quick", "brown", "fox"]
	>> $+
	=> "fox"

**$` (Dollar Backtick)**

$` contains the string before the actual matched string of the previous successful pattern match.

	>> "the quick brown fox".match(/quick.*fox/)
	=> #<MatchData:0x12882cc>
	>> $&
	=> "quick brown fox" # The matched string
	>> $`
	=> "the " # The text preceding the matched string

**$’ (Dollar Apostrophe)**

$' contains the string after the actual matched string of the previous successful pattern match.

	>> "the quick brown fox".match(/quick/)
	=> #<MatchData:0x1280c48>
	>> $&
	=> "quick" # The matched string
	>> $'
	=> " brown fox" # The text following the matched string

###Exceptional Global Variables
**$! (Dollar Bang)**

$! contains the Exception that was passed to raise.

	>> 0 / 0 rescue $!
	=> #<ZeroDivisionError: divided by 0>

**$@ (Dollar At Symbol)**

$@ contains the backtrace for the last Exception raised.

	>> 0 / 0 rescue puts $@
	(irb):16:in `/'
	(irb):16:in `irb_binding'
	/usr/local/lib/ruby/1.8/irb/workspace.rb:52:in `irb_binding'
	/usr/local/lib/ruby/1.8/irb/workspace.rb:52
	=> nil
	


