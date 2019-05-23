---
id: 372
title: Pseudocode Interpreter
date: 2012-08-23T23:20:58-04:00
author: brad
layout: post
guid: http://br4d.net/?p=372
permalink: /pseudocode-interpreter/
categories:
  - C / C++
  - Programming
---
This program was an assignment for my Programming Languages course. The idea is to implement a simple pseudocode interpreter which has very basic functionality as well as a contiguous memory store. Here is how it works:

  1. You feed the program a CRLF seperated list of valid syntax. In this case, the file “pseudocode.txt” which should be in the same directory as the program (no file picker implemented).
  2. The program reads, parses, and executes the given instructions
  3. Any errors that are found are reported, else the program runs until STOP instruction or EOF.

<!--more-->

The instruction set is very limited. There are a total of about 18 operations which can have 2 operands. If something is contained in [brackets] then that is referring to one of the 1000 availiable memory locations ([0] to [999]). You will find the instruction format in the source code, but here is a better explanation:

Instruction format:

<table border="1">
  <tr>
    <td>
    </td>
    
    <td>
      ###
    </td>
    
    <td>
      s
    </td>
    
    <td>
      f
    </td>
    
    <td>
      xxx
    </td>
    
    <td>
      yyy
    </td>
    
    <td>
      ddd
    </td>
  </tr>
  
  <tr>
    <td>
      Explanation:
    </td>
    
    <td>
      Line Number
    </td>
    
    <td>
      Sign
    </td>
    
    <td>
      Function
    </td>
    
    <td>
      Operand 1
    </td>
    
    <td>
      Operand 2
    </td>
    
    <td>
      Destination
    </td>
  </tr>
  
  <tr>
    <td>
      Valid inputs:
    </td>
    
    <td>
      integer
    </td>
    
    <td>
      + or –
    </td>
    
    <td>
      0 to 9
    </td>
    
    <td>
      integer
    </td>
    
    <td>
      integer
    </td>
    
    <td>
      integer
    </td>
  </tr>
</table>

Instruction Operation List (sf):

<table border="1">
  <tr>
    <td>
      sf value:
    </td>
    
    <td>
      Operation:
    </td>
    
    <td>
      Explanation:
    </td>
  </tr>
  
  <tr>
    <td>
      +0
    </td>
    
    <td>
      Move
    </td>
    
    <td>
      Move xxx to memloc ddd
    </td>
  </tr>
  
  <tr>
    <td>
      +1
    </td>
    
    <td>
      Addition
    </td>
    
    <td>
      [xxx] + yyy result @ [ddd]
    </td>
  </tr>
  
  <tr>
    <td>
      +2
    </td>
    
    <td>
      Multiplication
    </td>
    
    <td>
      xxx * yyy result @ [ddd]
    </td>
  </tr>
  
  <tr>
    <td>
      +3
    </td>
    
    <td>
      Square
    </td>
    
    <td>
      xxx * xxx result @ [ddd]
    </td>
  </tr>
  
  <tr>
    <td>
      +4
    </td>
    
    <td>
      =
    </td>
    
    <td>
      if [xxx]==[yyy] then goto line # ddd
    </td>
  </tr>
  
  <tr>
    <td>
      +5
    </td>
    
    <td>
      >=
    </td>
    
    <td>
      if xxx >= yyy then goto line # ddd
    </td>
  </tr>
  
  <tr>
    <td>
      +6
    </td>
    
    <td>
      x(y)->z
    </td>
    
    <td>
      yyy+xxx stored in [ddd]
    </td>
  </tr>
  
  <tr>
    <td>
      +7
    </td>
    
    <td>
      Increment and test
    </td>
    
    <td>
      [xxx]++; if [xxx] < [yyy] then go to line # ddd;
    </td>
  </tr>
  
  <tr>
    <td>
      +8
    </td>
    
    <td>
      Read
    </td>
    
    <td>
      Read memloc @ ddd
    </td>
  </tr>
  
  <tr>
    <td>
      +9
    </td>
    
    <td>
      Stop
    </td>
    
    <td>
      End program execution
    </td>
  </tr>
  
  <tr>
    <td>
      -0
    </td>
    
    <td>
      Move Literal
    </td>
    
    <td>
      Move xxx to memloc ddd
    </td>
  </tr>
  
  <tr>
    <td>
      -1
    </td>
    
    <td>
      –
    </td>
    
    <td>
      xxx – yyy, result @ [ddd]
    </td>
  </tr>
  
  <tr>
    <td>
      -2
    </td>
    
    <td>
      /
    </td>
    
    <td>
      xxx / yyy, result @ [ddd]
    </td>
  </tr>
  
  <tr>
    <td>
      -3
    </td>
    
    <td>
      Square Root
    </td>
    
    <td>
      sqrt(xxx), result @ ddd
    </td>
  </tr>
  
  <tr>
    <td>
      -4
    </td>
    
    <td>
      Not Equals
    </td>
    
    <td>
      if xxx != yyy goto line# ddd
    </td>
  </tr>
  
  <tr>
    <td>
      -5
    </td>
    
    <td>
      <
    </td>
    
    <td>
      if [xxx] < yyy goto line# ddd
    </td>
  </tr>
  
  <tr>
    <td>
      -6
    </td>
    
    <td>
      Move and add
    </td>
    
    <td>
      move [xxx] to (memLoc[yyy]+contentsOf[ddd])
    </td>
  </tr>
  
  <tr>
    <td>
      -7
    </td>
    
    <td>
      Decrement and test
    </td>
    
    <td>
      [xxx]–; if [xxx] < [yyy] then go to line # ddd;
    </td>
  </tr>
  
  <tr>
    <td>
      -8
    </td>
    
    <td>
      Print
    </td>
    
    <td>
      print xxx literal or [ddd]
    </td>
  </tr>
  
  <tr>
    <td>
      -9
    </td>
    
    <td>
      Comment
    </td>
    
    <td>
      Program comment – not executed.
    </td>
  </tr>
</table>

Here is a sample program with an explanation:

<div class="well">
  10 -0 10 0 7</p> 
  
  <p>
    20 +1 7 25 5
  </p>
  
  <p>
    30 -8 0 0 5
  </p>
  
  <p>
    40 +9 0 0 0
  </p>
</div>

  1. Line #10 stores the value 10 at memloc[7].
  2. Line #20 adds the value at memloc\[7\] (which is 10) to 25 and stores the result at memloc[5]
  3. Line #30 prints the value stored at memloc[5] which is 35.
  4. Line #40 terminates the program

<div class="codecolorer-container c default">
  <div class="c codecolorer">
    <span class="coMULTI">/*<br /> *   Bradley Carey - CS300 - Assignment 1-2 "pseudocode"<br /> *   Simple pseudocode interpreter - default input file is "pseudocode.txt"<br /> *<br /> *   Error codes: -1 syntax error, -2 divide by zero, -3 line number not found, -4 exit immediately, -5 unknown error<br /> */</span><br />  <br /> <span class="co2">#include <iostream></span><br /> <span class="co2">#include <fstream></span><br /> <span class="co2">#include <string></span><br /> <span class="co2">#include <vector></span><br /> <span class="co2">#include <sstream></span><br /> <span class="co2">#include <cmath></span><br />  <br /> using namespace std<span class="sy0">;</span><br />  <br /> <span class="kw4">const</span> <span class="kw4">int</span> debug <span class="sy0">=</span> <span class="nu0"></span><span class="sy0">;</span><br />  <br /> <span class="kw4">struct</span> instruction<br /> <span class="br0">{</span><br />     <span class="coMULTI">/* instruction format:<br />        ## s f xxx yyy ddd<br />        ## = line number, s = sign, f = function, xxx = operand1,<br />        yyy = operand2, ddd = destination */</span><br />     <span class="kw4">int</span> lineNumber<span class="sy0">;</span> <span class="co1">// #</span><br />     <span class="kw4">char</span> s<span class="sy0">;</span> <span class="co1">// s</span><br />     <span class="kw4">int</span> f<span class="sy0">;</span> <span class="co1">// f</span><br />     <span class="kw4">int</span> xxx<span class="sy0">;</span> <span class="co1">// xxx</span><br />     <span class="kw4">int</span> yyy<span class="sy0">;</span> <span class="co1">// yyy</span><br />     <span class="kw4">int</span> ddd<span class="sy0">;</span> <span class="co1">//ddd</span><br /> <span class="br0">}</span><span class="sy0">;</span><br />  <br /> <span class="kw4">struct</span> pseudoarray<br /> <span class="br0">{</span><br />     <span class="kw4">int</span> start<span class="sy0">;</span><br />     <span class="kw4">int</span> end<span class="sy0">;</span><br />     <span class="kw4">int</span> size<span class="sy0">;</span><br /> <span class="br0">}</span><span class="sy0">;</span><br />  <br /> <span class="co1">//finds location in container holding desired linenumber and returns it</span><br /> <span class="kw4">int</span> findLineNumber<span class="br0">(</span>vector<span class="sy0"><</span>instruction<span class="sy0">></span> container<span class="sy0">,</span> <span class="kw4">int</span> numToFind<span class="br0">)</span><br /> <span class="br0">{</span><br />     <span class="kw1">for</span><span class="br0">(</span><span class="kw4">unsigned</span> <span class="kw4">int</span> i<span class="sy0">=</span><span class="nu0"></span><span class="sy0">;</span> i <span class="sy0"><</span> container.<span class="me1">size</span><span class="br0">(</span><span class="br0">)</span><span class="sy0">;</span> i<span class="sy0">++</span><span class="br0">)</span><br />     <span class="br0">{</span><br />         <span class="kw1">if</span><span class="br0">(</span>container<span class="br0">[</span>i<span class="br0">]</span>.<span class="me1">lineNumber</span> <span class="sy0">==</span> numToFind<span class="br0">)</span><br />             <span class="kw1">return</span> i<span class="sy0">;</span><br />     <span class="br0">}</span><br />     <span class="kw1">return</span> <span class="sy0">-</span><span class="nu0">3</span><span class="sy0">;</span><br /> <span class="br0">}</span><br />  <br /> <span class="co1">//simple cin get function</span><br /> <span class="kw4">int</span> getNumber<span class="br0">(</span><span class="br0">)</span><br /> <span class="br0">{</span><br />     cout <span class="sy0"><<</span> <span class="st0">"Please enter a number: "</span><span class="sy0">;</span><br />     <span class="kw4">int</span> read<span class="sy0">;</span><br />     cin <span class="sy0">>></span> read<span class="sy0">;</span><br />     <span class="kw1">return</span> read<span class="sy0">;</span><br /> <span class="br0">}</span><br />  <br /> <span class="co1">//parse instruction</span><br /> instruction parseLine<span class="br0">(</span>string lineToParse<span class="br0">)</span><br /> <span class="br0">{</span><br />     instruction storeThis<span class="sy0">;</span><br />     istringstream buffer<span class="br0">(</span>lineToParse<span class="br0">)</span><span class="sy0">;</span><br />     <span class="kw4">int</span> num<span class="sy0">,</span> f<span class="sy0">,</span> xxx<span class="sy0">,</span> yyy<span class="sy0">,</span> ddd<span class="sy0">;</span><br />     <span class="kw4">char</span> s<span class="sy0">;</span><br />     buffer <span class="sy0">>></span> num <span class="sy0">>></span> s <span class="sy0">>></span> f <span class="sy0">>></span> xxx <span class="sy0">>></span> yyy <span class="sy0">>></span> ddd<span class="sy0">;</span><br />     <span class="kw1">if</span><span class="br0">(</span>debug<span class="br0">)</span><br />         cout <span class="sy0"><<</span> <span class="st0">"Parsed line #"</span> <span class="sy0"><<</span> num <span class="sy0"><<</span> <span class="st0">" s: "</span> <span class="sy0"><<</span> s <span class="sy0"><<</span> <span class="st0">" f: "</span> <span class="sy0"><<</span> f<br />             <span class="sy0"><<</span> <span class="st0">" xxx: "</span> <span class="sy0"><<</span> xxx <span class="sy0"><<</span> <span class="st0">" yyy: "</span> <span class="sy0"><<</span> yyy <span class="sy0"><<</span> <span class="st0">" ddd: "</span> <span class="sy0"><<</span> ddd <span class="sy0"><<</span> endl<span class="sy0">;</span><br />     storeThis.<span class="me1">lineNumber</span> <span class="sy0">=</span> num<span class="sy0">;</span><br />     storeThis.<span class="me1">s</span> <span class="sy0">=</span> s<span class="sy0">;</span><br />     storeThis.<span class="me1">f</span> <span class="sy0">=</span> f<span class="sy0">;</span><br />     storeThis.<span class="me1">xxx</span> <span class="sy0">=</span> xxx<span class="sy0">;</span><br />     storeThis.<span class="me1">yyy</span> <span class="sy0">=</span> yyy<span class="sy0">;</span><br />     storeThis.<span class="me1">ddd</span> <span class="sy0">=</span> ddd<span class="sy0">;</span><br />     <span class="kw1">return</span> storeThis<span class="sy0">;</span><br /> <span class="br0">}</span><br />  <br /> <span class="co1">// print instruction details</span><br /> <span class="kw4">void</span> printInstruction<span class="br0">(</span>instruction toPrint<span class="br0">)</span><br /> <span class="br0">{</span><br />         cout <span class="sy0"><<</span> toPrint.<span class="me1">lineNumber</span> <span class="sy0"><<</span> <span class="st0">" "</span> <span class="sy0"><<</span> toPrint.<span class="me1">s</span><br />             <span class="sy0"><<</span> toPrint.<span class="me1">f</span> <span class="sy0"><<</span> <span class="st0">" "</span> <span class="sy0"><<</span> toPrint.<span class="me1">xxx</span> <span class="sy0"><<</span> <span class="st0">" "</span><br />             <span class="sy0"><<</span> toPrint.<span class="me1">yyy</span> <span class="sy0"><<</span> <span class="st0">" "</span> <span class="sy0"><<</span> toPrint.<span class="me1">ddd</span> <span class="sy0"><<</span> endl<span class="sy0">;</span><br /> <span class="br0">}</span><br />  <br /> <span class="coMULTI">/* parse and execute instruction<br />  * return line number to jump to or a negative error code<br />  */</span><br /> <span class="kw4">int</span> executeInstruction<span class="br0">(</span>instruction toExecute<span class="sy0">,</span> <span class="kw4">int</span> memory<span class="br0">[</span><span class="br0">]</span><span class="br0">)</span><br /> <span class="br0">{</span><br />     <span class="kw1">if</span><span class="br0">(</span>toExecute.<span class="me1">s</span> <span class="sy0">==</span> <span class="st0">'+'</span><span class="br0">)</span><br />     <span class="br0">{</span><br />         <span class="kw1">switch</span> <span class="br0">(</span>toExecute.<span class="me1">f</span><span class="br0">)</span><br />         <span class="br0">{</span><br />             <span class="kw1">case</span> <span class="nu0"></span><span class="sy0">:</span>         <span class="co1">// +0, Move xxx to ddd</span><br />                 <span class="kw1">if</span><span class="br0">(</span>debug<span class="br0">)</span><br />                     cout <span class="sy0"><<</span> <span class="st0">"<span class="es1">\t</span>Execute +0 [Move]"</span> <span class="sy0"><<</span> endl<span class="sy0">;</span><br />                 memory<span class="br0">[</span>toExecute.<span class="me1">ddd</span><span class="br0">]</span> <span class="sy0">=</span> toExecute.<span class="me1">xxx</span><span class="sy0">;</span><br />                 <span class="kw1">return</span> <span class="nu0"></span><span class="sy0">;</span><br />  <br />             <span class="kw1">case</span> <span class="nu0">1</span><span class="sy0">:</span>         <span class="co1">// +1, [xxx] + yyy result @ ddd</span><br />                 <span class="kw1">if</span><span class="br0">(</span>debug<span class="br0">)</span><br />                     cout <span class="sy0"><<</span> <span class="st0">"<span class="es1">\t</span>Execute +1 [+]"</span> <span class="sy0"><<</span> endl<span class="sy0">;</span><br />                 memory<span class="br0">[</span>toExecute.<span class="me1">ddd</span><span class="br0">]</span> <span class="sy0">=</span> <span class="br0">(</span>memory<span class="br0">[</span>toExecute.<span class="me1">xxx</span><span class="br0">]</span> <span class="sy0">+</span> toExecute.<span class="me1">yyy</span><span class="br0">)</span><span class="sy0">;</span><br />                 <span class="kw1">return</span> <span class="nu0"></span><span class="sy0">;</span><br />  <br />             <span class="kw1">case</span> <span class="nu0">2</span><span class="sy0">:</span>         <span class="co1">// +2, xxx * yyy result @ ddd</span><br />                 <span class="kw1">if</span><span class="br0">(</span>debug<span class="br0">)</span><br />                     cout <span class="sy0"><<</span> <span class="st0">"<span class="es1">\t</span>Execute +2 [*]"</span> <span class="sy0"><<</span> endl<span class="sy0">;</span><br />                 memory<span class="br0">[</span>toExecute.<span class="me1">ddd</span><span class="br0">]</span> <span class="sy0">=</span> <span class="br0">(</span>toExecute.<span class="me1">xxx</span> <span class="sy0">*</span> toExecute.<span class="me1">yyy</span><span class="br0">)</span><span class="sy0">;</span><br />                 <span class="kw1">return</span> <span class="nu0"></span><span class="sy0">;</span><br />  <br />             <span class="kw1">case</span> <span class="nu0">3</span><span class="sy0">:</span>         <span class="co1">// +3, xxx * xxx result @ ddd</span><br />                 <span class="kw1">if</span><span class="br0">(</span>debug<span class="br0">)</span><br />                     cout <span class="sy0"><<</span> <span class="st0">"<span class="es1">\t</span>Execute +3 [Square]"</span> <span class="sy0"><<</span> endl<span class="sy0">;</span><br />                 memory<span class="br0">[</span>toExecute.<span class="me1">ddd</span><span class="br0">]</span> <span class="sy0">=</span> <span class="br0">(</span>toExecute.<span class="me1">xxx</span> <span class="sy0">*</span> toExecute.<span class="me1">xxx</span><span class="br0">)</span><span class="sy0">;</span><br />                 <span class="kw1">return</span> <span class="nu0"></span><span class="sy0">;</span><br />  <br />             <span class="kw1">case</span> <span class="nu0">4</span><span class="sy0">:</span>         <span class="co1">// +4, if [xxx]=[yyy] then goto ddd</span><br />                 <span class="kw1">if</span><span class="br0">(</span>debug<span class="br0">)</span><br />                     cout <span class="sy0"><<</span> <span class="st0">"<span class="es1">\t</span>Execute +4 [=]"</span> <span class="sy0"><<</span> endl<span class="sy0">;</span><br />                 <span class="kw1">if</span><span class="br0">(</span>memory<span class="br0">[</span>toExecute.<span class="me1">xxx</span><span class="br0">]</span> <span class="sy0">==</span> memory<span class="br0">[</span>toExecute.<span class="me1">yyy</span><span class="br0">]</span><span class="br0">)</span><br />                     <span class="kw1">return</span> toExecute.<span class="me1">ddd</span><span class="sy0">;</span><br />                 <span class="kw1">else</span><br />                     <span class="kw1">return</span> <span class="nu0"></span><span class="sy0">;</span><br />  <br />             <span class="kw1">case</span> <span class="nu0">5</span><span class="sy0">:</span>         <span class="co1">// +5, if xxx >= yyy then goto ddd</span><br />                 <span class="kw1">if</span><span class="br0">(</span>debug<span class="br0">)</span><br />                     cout <span class="sy0"><<</span> <span class="st0">"<span class="es1">\t</span>Execute +5 [>=] goto "</span> <span class="sy0"><<</span> toExecute.<span class="me1">ddd</span> <span class="sy0"><<</span> <span class="st0">" if "</span> <span class="sy0"><<</span> memory<span class="br0">[</span>toExecute.<span class="me1">xxx</span><span class="br0">]</span> <span class="sy0"><<</span> <span class="st0">" >= "</span> <span class="sy0"><<</span> memory<span class="br0">[</span>toExecute.<span class="me1">yyy</span><span class="br0">]</span> <span class="sy0"><<</span> endl<span class="sy0">;</span><br />                 <span class="kw1">if</span><span class="br0">(</span>memory<span class="br0">[</span>toExecute.<span class="me1">xxx</span><span class="br0">]</span> <span class="sy0">>=</span> memory<span class="br0">[</span>toExecute.<span class="me1">yyy</span><span class="br0">]</span><span class="br0">)</span><br />                     <span class="kw1">return</span> toExecute.<span class="me1">ddd</span><span class="sy0">;</span><br />                 <span class="kw1">else</span><br />                     <span class="kw1">return</span> <span class="nu0"></span><span class="sy0">;</span><br />  <br />             <span class="kw1">case</span> <span class="nu0">6</span><span class="sy0">:</span>         <span class="co1">// +6, </span><br />                 <span class="kw1">if</span><span class="br0">(</span>debug<span class="br0">)</span><br />                     cout <span class="sy0"><<</span> <span class="st0">"<span class="es1">\t</span>Execute +6 [x(y)->z]"</span> <span class="sy0"><<</span> endl<span class="sy0">;</span><br />                 memory<span class="br0">[</span>toExecute.<span class="me1">ddd</span><span class="br0">]</span> <span class="sy0">=</span> memory<span class="br0">[</span>toExecute.<span class="me1">xxx</span> <span class="sy0">+</span> memory<span class="br0">[</span>toExecute.<span class="me1">yyy</span><span class="br0">]</span><span class="br0">]</span><span class="sy0">;</span><br />                 <span class="kw1">return</span> <span class="nu0"></span><span class="sy0">;</span><br />  <br />             <span class="kw1">case</span> <span class="nu0">7</span><span class="sy0">:</span>         <span class="co1">// +7, increment xxx and test</span><br />                 <span class="kw1">if</span><span class="br0">(</span>debug<span class="br0">)</span>   <span class="co1">// [xxx]++; if [xxx] < [yyy] then go to ddd;</span><br />                     cout <span class="sy0"><<</span> <span class="st0">"<span class="es1">\t</span>Execute +7 [Increment and test]"</span> <span class="sy0"><<</span> endl<span class="sy0">;</span><br />                 toExecute.<span class="me1">xxx</span><span class="sy0">++;</span><br />                 <span class="kw1">if</span> <span class="br0">(</span>toExecute.<span class="me1">xxx</span> <span class="sy0"><</span> toExecute.<span class="me1">yyy</span><span class="br0">)</span><br />                     <span class="kw1">return</span> toExecute.<span class="me1">ddd</span><span class="sy0">;</span><br />                 <span class="kw1">else</span><br />                     <span class="kw1">return</span> <span class="nu0"></span><span class="sy0">;</span><br />  <br />             <span class="kw1">case</span> <span class="nu0">8</span><span class="sy0">:</span>         <span class="co1">// +8, store input @ ddd</span><br />                 <span class="kw1">if</span><span class="br0">(</span>debug<span class="br0">)</span><br />                     cout <span class="sy0"><<</span> <span class="st0">"<span class="es1">\t</span>Execute +8 [Read]"</span> <span class="sy0"><<</span> endl<span class="sy0">;</span><br />                 memory<span class="br0">[</span>toExecute.<span class="me1">ddd</span><span class="br0">]</span> <span class="sy0">=</span> getNumber<span class="br0">(</span><span class="br0">)</span><span class="sy0">;</span><br />                 <span class="kw1">return</span> <span class="nu0"></span><span class="sy0">;</span><br />  <br />             <span class="kw1">case</span> <span class="nu0">9</span><span class="sy0">:</span>         <span class="co1">// +9, </span><br />                 <span class="kw1">if</span><span class="br0">(</span>debug<span class="br0">)</span><br />                     cout <span class="sy0"><<</span> <span class="st0">"<span class="es1">\t</span>Execute +9 [Stop]"</span> <span class="sy0"><<</span> endl<span class="sy0">;</span><br />                 <span class="kw1">return</span> <span class="sy0">-</span><span class="nu0">4</span><span class="sy0">;</span><br />  <br />             <span class="kw1">default</span><span class="sy0">:</span>        <span class="co1">// syntax error</span><br />                 <span class="kw1">if</span><span class="br0">(</span>debug<span class="br0">)</span><br />                     cout <span class="sy0"><<</span> <span class="st0">"<span class="es1">\t</span>Execute +? (???)"</span> <span class="sy0"><<</span> endl<span class="sy0">;</span><br />                 <span class="kw1">return</span> <span class="sy0">-</span><span class="nu0">1</span><span class="sy0">;</span><br />         <span class="br0">}</span> <span class="co1">// end + switch</span><br />     <span class="br0">}</span> <span class="kw1">else</span> <span class="br0">{</span><br />         <span class="kw1">switch</span> <span class="br0">(</span>toExecute.<span class="me1">f</span><span class="br0">)</span><br />         <span class="br0">{</span><br />             <span class="kw1">case</span> <span class="nu0"></span><span class="sy0">:</span>         <span class="co1">// -0, </span><br />                 <span class="kw1">if</span><span class="br0">(</span>debug<span class="br0">)</span><br />                     cout <span class="sy0"><<</span> <span class="st0">"<span class="es1">\t</span>Execute -0 (Move literal)"</span> <span class="sy0"><<</span> endl<span class="sy0">;</span><br />                 memory<span class="br0">[</span>toExecute.<span class="me1">ddd</span><span class="br0">]</span> <span class="sy0">=</span> toExecute.<span class="me1">xxx</span><span class="sy0">;</span><br />                 <span class="kw1">return</span> <span class="nu0"></span><span class="sy0">;</span><br />  <br />             <span class="kw1">case</span> <span class="nu0">1</span><span class="sy0">:</span>         <span class="co1">// -1, xxx - yyy, result in ddd;</span><br />                 <span class="kw1">if</span><span class="br0">(</span>debug<span class="br0">)</span><br />                     cout <span class="sy0"><<</span> <span class="st0">"<span class="es1">\t</span>Execute -1 (-)"</span> <span class="sy0"><<</span> endl<span class="sy0">;</span><br />                 memory<span class="br0">[</span>toExecute.<span class="me1">ddd</span><span class="br0">]</span> <span class="sy0">=</span> <span class="br0">(</span>toExecute.<span class="me1">xxx</span> <span class="sy0">-</span> toExecute.<span class="me1">yyy</span><span class="br0">)</span><span class="sy0">;</span><br />                 <span class="kw1">return</span> <span class="nu0"></span><span class="sy0">;</span><br />  <br />             <span class="kw1">case</span> <span class="nu0">2</span><span class="sy0">:</span>         <span class="co1">//-2, xxx / yyy, result in ddd</span><br />                 <span class="kw1">if</span><span class="br0">(</span>debug<span class="br0">)</span><br />                     cout <span class="sy0"><<</span> <span class="st0">"<span class="es1">\t</span>Execute -2 (/)"</span> <span class="sy0"><<</span> endl<span class="sy0">;</span><br />                 <span class="kw1">if</span><span class="br0">(</span>toExecute.<span class="me1">yyy</span> <span class="sy0">==</span> <span class="nu0"></span><span class="br0">)</span><br />                     <span class="kw1">return</span> <span class="sy0">-</span><span class="nu0">2</span><span class="sy0">;</span><br />                 memory<span class="br0">[</span>toExecute.<span class="me1">ddd</span><span class="br0">]</span> <span class="sy0">=</span> <span class="br0">(</span>toExecute.<span class="me1">xxx</span> <span class="sy0">/</span> toExecute.<span class="me1">yyy</span><span class="br0">)</span><span class="sy0">;</span><br />                 <span class="kw1">return</span> <span class="nu0"></span><span class="sy0">;</span><br />  <br />             <span class="kw1">case</span> <span class="nu0">3</span><span class="sy0">:</span>         <span class="co1">//-3, sqrt(xxx), result in ddd</span><br />                 <span class="kw1">if</span><span class="br0">(</span>debug<span class="br0">)</span><br />                     cout <span class="sy0"><<</span> <span class="st0">"<span class="es1">\t</span>Execute -3 (Square Root)"</span> <span class="sy0"><<</span> endl<span class="sy0">;</span><br />                 memory<span class="br0">[</span>toExecute.<span class="me1">ddd</span><span class="br0">]</span> <span class="sy0">=</span> <a href="http://www.opengroup.org/onlinepubs/009695399/functions/sqrt.html"><span class="kw3">sqrt</span></a><span class="br0">(</span><span class="br0">(</span><span class="kw4">double</span><span class="br0">)</span>toExecute.<span class="me1">xxx</span><span class="br0">)</span><span class="sy0">;</span><br />                 <span class="kw1">return</span> <span class="nu0"></span><span class="sy0">;</span><br />  <br />             <span class="kw1">case</span> <span class="nu0">4</span><span class="sy0">:</span>         <span class="co1">// -4, if xxx != yyy goto ddd</span><br />                 <span class="kw1">if</span><span class="br0">(</span>debug<span class="br0">)</span><br />                     cout <span class="sy0"><<</span> <span class="st0">"<span class="es1">\t</span>Execute -4 (!=)"</span> <span class="sy0"><<</span> endl<span class="sy0">;</span><br />                 <span class="kw1">if</span><span class="br0">(</span>memory<span class="br0">[</span>toExecute.<span class="me1">xxx</span><span class="br0">]</span> <span class="sy0">!=</span> memory<span class="br0">[</span>toExecute.<span class="me1">yyy</span><span class="br0">]</span><span class="br0">)</span><br />                     <span class="kw1">return</span> toExecute.<span class="me1">ddd</span><span class="sy0">;</span><br />                 <span class="kw1">else</span><br />                     <span class="kw1">return</span> <span class="nu0"></span><span class="sy0">;</span><br />  <br />             <span class="kw1">case</span> <span class="nu0">5</span><span class="sy0">:</span>         <span class="co1">// -5, if [xxx] < yyy goto ddd</span><br />                 <span class="kw1">if</span><span class="br0">(</span>debug<span class="br0">)</span><br />                     cout <span class="sy0"><<</span> <span class="st0">"<span class="es1">\t</span>Execute -5 (<)"</span> <span class="sy0"><<</span> endl<span class="sy0">;</span><br />                 <span class="kw1">if</span><span class="br0">(</span>memory<span class="br0">[</span>toExecute.<span class="me1">xxx</span><span class="br0">]</span> <span class="sy0"><</span> toExecute.<span class="me1">yyy</span><span class="br0">)</span><br />                     <span class="kw1">return</span> toExecute.<span class="me1">ddd</span><span class="sy0">;</span><br />                 <span class="kw1">else</span><br />                     <span class="kw1">return</span> <span class="nu0"></span><span class="sy0">;</span><br />  <br />             <span class="kw1">case</span> <span class="nu0">6</span><span class="sy0">:</span> <span class="co1">// -6, move contents of [xxx] to (memLoc[yyy]+contentsOf[ddd])</span><br />                 <span class="kw1">if</span><span class="br0">(</span>debug<span class="br0">)</span> <span class="co1">// xxx yyy ddd</span><br />                     cout <span class="sy0"><<</span> <span class="st0">"<span class="es1">\t</span>Execute -6 (x->y(z))"</span> <span class="sy0"><<</span> endl<span class="sy0">;</span><br />                 memory<span class="br0">[</span>toExecute.<span class="me1">xxx</span><span class="br0">]</span> <span class="sy0">=</span> memory<span class="br0">[</span>toExecute.<span class="me1">yyy</span> <span class="sy0">+</span> memory<span class="br0">[</span>toExecute.<span class="me1">ddd</span><span class="br0">]</span><span class="br0">]</span><span class="sy0">;</span><br />                 <span class="kw1">return</span> <span class="nu0"></span><span class="sy0">;</span><br />  <br />             <span class="kw1">case</span> <span class="nu0">7</span><span class="sy0">:</span><br />                 <span class="kw1">if</span><span class="br0">(</span>debug<span class="br0">)</span><br />                     cout <span class="sy0"><<</span> <span class="st0">"<span class="es1">\t</span>Execute -7 (Decrement and test)"</span> <span class="sy0"><<</span> endl<span class="sy0">;</span><br />                 <span class="kw1">return</span> <span class="nu0"></span><span class="sy0">;</span><br />  <br />             <span class="kw1">case</span> <span class="nu0">8</span><span class="sy0">:</span>         <span class="co1">// -8, print xxx literal or what is @ location ddd</span><br />                 <span class="kw1">if</span><span class="br0">(</span>debug<span class="br0">)</span><br />                     cout <span class="sy0"><<</span> <span class="st0">"<span class="es1">\t</span>Execute -8 (Print)"</span> <span class="sy0"><<</span> endl<span class="sy0">;</span><br />                     cout <span class="sy0"><<</span> <span class="st0">"Value at ["</span> <span class="sy0"><<</span> toExecute.<span class="me1">ddd</span> <span class="sy0"><<</span> <span class="st0">"]: "</span> <span class="sy0"><<</span> memory<span class="br0">[</span>toExecute.<span class="me1">ddd</span><span class="br0">]</span> <span class="sy0"><<</span> endl<span class="sy0">;</span><br />                 <span class="kw1">return</span> <span class="nu0"></span><span class="sy0">;</span><br />  <br />             <span class="kw1">case</span> <span class="nu0">9</span><span class="sy0">:</span><br />                 <span class="kw1">if</span><span class="br0">(</span>debug<span class="br0">)</span><br />                     cout <span class="sy0"><<</span> <span class="st0">"Execute -9 (Program Comment)"</span> <span class="sy0"><<</span> endl<span class="sy0">;</span><br />                 <span class="kw1">return</span> <span class="nu0"></span><span class="sy0">;</span><br />  <br />             <span class="kw1">default</span><span class="sy0">:</span>        <span class="co1">// syntax error</span><br />                 <span class="kw1">if</span><span class="br0">(</span>debug<span class="br0">)</span><br />                     cout <span class="sy0"><<</span> <span class="st0">"Execute -? (???)"</span> <span class="sy0"><<</span> endl<span class="sy0">;</span><br />                 <span class="kw1">return</span> <span class="sy0">-</span><span class="nu0">1</span><span class="sy0">;</span><br />         <span class="br0">}</span><br />         <span class="kw1">return</span> <span class="sy0">-</span><span class="nu0">5</span><span class="sy0">;</span>          <span class="co1">// unknown error</span><br />     <span class="br0">}</span><br /> <span class="br0">}</span><br />  <br /> <span class="kw4">int</span> main<span class="br0">(</span><span class="br0">)</span><br /> <span class="br0">{</span><br />     <span class="kw4">int</span> programMemory<span class="br0">[</span><span class="nu0">1000</span><span class="br0">]</span> <span class="sy0">=</span> <span class="br0">{</span><span class="nu0"></span><span class="br0">}</span><span class="sy0">;</span><br />     ifstream openFile<span class="sy0">;</span><br />     vector <span class="sy0"><</span>instruction<span class="sy0">></span> codeContainer<span class="sy0">;</span><br />     string currentLine<span class="sy0">;</span><br />  <br />     <span class="co1">// open, parse, and store source file in vector<instruction> codeContainer</span><br />     openFile.<span class="me1">open</span><span class="br0">(</span><span class="st0">"pseudocode.txt"</span><span class="br0">)</span><span class="sy0">;</span><br />     <span class="kw1">if</span><span class="br0">(</span><span class="sy0">!</span>openFile<span class="br0">)</span><br />         <span class="kw1">return</span> <span class="nu0"></span><span class="sy0">;</span><br />     <span class="kw1">while</span> <span class="br0">(</span>getline<span class="br0">(</span>openFile<span class="sy0">,</span>currentLine<span class="br0">)</span><span class="br0">)</span><br />         codeContainer.<span class="me1">push_back</span><span class="br0">(</span>parseLine<span class="br0">(</span>currentLine<span class="br0">)</span><span class="br0">)</span><span class="sy0">;</span><br />     openFile.<span class="me1">close</span><span class="br0">(</span><span class="br0">)</span><span class="sy0">;</span><br />  <br />     <span class="co1">//print parsed pseudocode.txt</span><br />     <span class="kw1">if</span><span class="br0">(</span>debug<span class="br0">)</span><br />     <span class="br0">{</span><br />         cout <span class="sy0"><<</span> <span class="st0">"Parsed "</span> <span class="sy0"><<</span> codeContainer.<span class="me1">size</span><span class="br0">(</span><span class="br0">)</span> <span class="sy0"><<</span> <span class="st0">" total lines of code successfully."</span> <span class="sy0"><<</span> endl <span class="sy0"><<</span> <span class="st0">"Source code"</span><span class="sy0">;</span><br />         <span class="kw1">for</span><span class="br0">(</span><span class="kw4">unsigned</span> <span class="kw4">int</span> i<span class="sy0">=</span><span class="nu0"></span><span class="sy0">;</span> i <span class="sy0"><</span> codeContainer.<span class="me1">size</span><span class="br0">(</span><span class="br0">)</span><span class="sy0">;</span> i<span class="sy0">++</span><span class="br0">)</span><br />             printInstruction<span class="br0">(</span>codeContainer<span class="br0">[</span>i<span class="br0">]</span><span class="br0">)</span><span class="sy0">;</span><br />     <span class="br0">}</span><br />  <br />     <span class="co1">//execute instructions and handle error codes</span><br />     <span class="kw1">for</span><span class="br0">(</span><span class="kw4">unsigned</span> <span class="kw4">int</span> j<span class="sy0">=</span><span class="nu0"></span><span class="sy0">;</span> j <span class="sy0"><</span> codeContainer.<span class="me1">size</span><span class="br0">(</span><span class="br0">)</span><span class="sy0">;</span> j<span class="sy0">++</span><span class="br0">)</span><br />     <span class="br0">{</span><br />         instruction toExecute <span class="sy0">=</span> codeContainer<span class="br0">[</span>j<span class="br0">]</span><span class="sy0">;</span><br />         <span class="kw1">if</span><span class="br0">(</span>debug<span class="br0">)</span><br />         <span class="br0">{</span><br />             cout <span class="sy0"><<</span> <span class="st0">"<span class="es1">\t</span>Executing line "</span><span class="sy0">;</span><br />             printInstruction<span class="br0">(</span>toExecute<span class="br0">)</span><span class="sy0">;</span><br />         <span class="br0">}</span><br />         <span class="kw4">int</span> result <span class="sy0">=</span> executeInstruction<span class="br0">(</span>toExecute<span class="sy0">,</span> programMemory<span class="br0">)</span><span class="sy0">;</span> <span class="co1">//returns 0 if successful, else returns line # to jump execution to</span><br />         <span class="kw1">if</span><span class="br0">(</span>result<span class="br0">)</span><br />         <span class="br0">{</span><br />             <span class="kw1">if</span><span class="br0">(</span>result <span class="sy0">==</span> <span class="sy0">-</span><span class="nu0">4</span><span class="br0">)</span> <span class="co1">// exit immediately via +9</span><br />                 <span class="kw1">goto</span> <a href="http://www.opengroup.org/onlinepubs/009695399/functions/exit.html"><span class="kw3">exit</span></a><span class="sy0">;</span><br />             <span class="kw1">if</span><span class="br0">(</span>result <span class="sy0">==</span> <span class="sy0">-</span><span class="nu0">1</span><span class="br0">)</span> <span class="co1">// syntax error</span><br />             <span class="br0">{</span><br />                 cout <span class="sy0"><<</span> <span class="st0">"=== Fatal error -> Syntax error"</span> <span class="sy0"><<</span> endl<span class="sy0">;</span><br />                 <span class="kw1">goto</span> <a href="http://www.opengroup.org/onlinepubs/009695399/functions/exit.html"><span class="kw3">exit</span></a><span class="sy0">;</span><br />             <span class="br0">}</span><br />             <span class="kw1">if</span><span class="br0">(</span>result <span class="sy0">==</span> <span class="sy0">-</span><span class="nu0">2</span><span class="br0">)</span> <span class="co1">// divide by zero error</span><br />             <span class="br0">{</span><br />                 cout <span class="sy0"><<</span> <span class="st0">"=== Fatal error on line #"</span> <span class="sy0"><<</span> toExecute.<span class="me1">lineNumber</span> <span class="sy0"><<</span> <span class="st0">" -> divide by zero"</span> <span class="sy0"><<</span> endl<span class="sy0">;</span><br />                 <span class="kw1">goto</span> <a href="http://www.opengroup.org/onlinepubs/009695399/functions/exit.html"><span class="kw3">exit</span></a><span class="sy0">;</span><br />             <span class="br0">}</span><br />             <span class="kw1">if</span><span class="br0">(</span>result <span class="sy0">>=</span> <span class="nu0">1</span><span class="br0">)</span> <span class="co1">// if >=, then jump to program line # result</span><br />             <span class="br0">{</span><br />                 <span class="kw4">int</span> lineNumberReturn <span class="sy0">=</span> findLineNumber<span class="br0">(</span>codeContainer<span class="sy0">,</span> result<span class="br0">)</span><span class="sy0">;</span> <span class="co1">// returns 99999 if invalid line #</span><br />                 <span class="kw1">if</span><span class="br0">(</span>lineNumberReturn <span class="sy0">==</span> <span class="sy0">-</span><span class="nu0">3</span><span class="br0">)</span> <span class="co1">// line # not found</span><br />                 <span class="br0">{</span><br />                     cout <span class="sy0"><<</span> <span class="st0">"=== Fatal error on line #"</span> <span class="sy0"><<</span> toExecute.<span class="me1">lineNumber</span> <span class="sy0"><<</span> <span class="st0">" -> Invalid value for ddd ["</span><br />                     <span class="sy0"><<</span> toExecute.<span class="me1">ddd</span> <span class="sy0"><<</span> <span class="st0">"] ==="</span> <span class="sy0"><<</span> endl<span class="sy0">;</span><br />                     <span class="kw1">goto</span> <a href="http://www.opengroup.org/onlinepubs/009695399/functions/exit.html"><span class="kw3">exit</span></a><span class="sy0">;</span><br />                 <span class="br0">}</span><br />                 <span class="kw1">else</span><br />                     j <span class="sy0">=</span> lineNumberReturn<span class="sy0">-</span><span class="nu0">1</span><span class="sy0">;</span><br />             <span class="br0">}</span><br />         <span class="br0">}</span><br />     <span class="br0">}</span><br />  <br /> <a href="http://www.opengroup.org/onlinepubs/009695399/functions/exit.html"><span class="kw3">exit</span></a><span class="sy0">:</span><br />     cout <span class="sy0"><<</span> <span class="st0">"Press enter to exit..."</span> <span class="sy0"><<</span> endl<span class="sy0">;</span><br />     cin.<span class="me1">ignore</span><span class="br0">(</span><span class="br0">)</span><span class="sy0">;</span><br />     <span class="kw1">if</span><span class="br0">(</span>cin.<span class="me1">get</span><span class="br0">(</span><span class="br0">)</span><span class="sy0">==</span><span class="st0">'<span class="es1">\n</span>'</span><span class="br0">)</span><br />         <span class="kw1">return</span> <span class="nu0"></span><span class="sy0">;</span><br />     <span class="kw1">else</span><br />         <span class="kw1">return</span> <span class="nu0"></span><span class="sy0">;</span><br />     <span class="kw1">return</span> <span class="nu0"></span><span class="sy0">;</span><br /> <span class="br0">}</span>
  </div>
</div>