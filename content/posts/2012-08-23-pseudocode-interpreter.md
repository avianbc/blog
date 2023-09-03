---
id: 372
title: Pseudocode Interpreter
date: 2012-08-23T23:20:58-04:00
author: brad
layout: post
guid: http://br4d.net/?p=372
permalink: /pseudocode-interpreter/
categories:
  - Programming
tags:
  - C
  - C++
  - Pseudocode
---
This program was an assignment for my Programming Languages course. The idea is to implement a simple pseudocode interpreter which has very basic functionality as well as a contiguous memory store. Here is how it works:

  1. You feed the program a CRLF separated list of valid syntax. In this case, the file “pseudocode.txt” which should be in the same directory as the program (no file picker implemented).
  2. The program reads, parses, and executes the given instructions
  3. Any errors that are found are reported, else the program runs until STOP instruction or EOF.

The instruction set is very limited. There are a total of about 18 operations which can have 2 operands. If something is contained in [brackets] then that is referring to one of the 1000 available memory locations ([0] to [999]). You will find the instruction format in the source code, but here is a better explanation:

### Instruction format:

<table>
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

### Instruction Operation List (sf):

<table>
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

``` js
10 -0 10 0 7
20 +1 7 25 5
30 -8 0 0 5
40 +9 0 0 0
```

  1. Line #10 stores the value 10 at memloc[7].
  2. Line #20 adds the value at memloc\[7\] (which is 10) to 25 and stores the result at memloc[5]
  3. Line #30 prints the value stored at memloc[5] which is 35.
  4. Line #40 terminates the program

{{< highlight cpp >}}
/*
*   Bradley Carey - CS300 - Assignment 1-2 "pseudocode"
*   Simple pseudocode interpreter - default input file is "pseudocode.txt"
*
*   Error codes: -1 syntax error, -2 divide by zero, -3 line number not found, -4 exit immediately, -5 unknown error
*/

#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <sstream>
#include <cmath>

using namespace std;

const int debug = 0;

struct instruction
{
    /* instruction format:
       ## s f xxx yyy ddd
       ## = line number, s = sign, f = function, xxx = operand1,
       yyy = operand2, ddd = destination */
    int lineNumber; // #
    char s; // s
    int f; // f
    int xxx; // xxx
    int yyy; // yyy
    int ddd; //ddd
};

struct pseudoarray
{
    int start;
    int end;
    int size;
};

//finds location in container holding desired linenumber and returns it
int findLineNumber(vector<instruction> container, int numToFind)
{
    for(unsigned int i=0; i < container.size(); i++)
    {
        if(container[i].lineNumber == numToFind)
            return i;
    }
    return -3;
}

//simple cin get function
int getNumber()
{
    cout << "Please enter a number: ";
    int read;
    cin >> read;
    return read;
}

//parse instruction
instruction parseLine(string lineToParse)
{
    instruction storeThis;
    istringstream buffer(lineToParse);
    int num, f, xxx, yyy, ddd;
    char s;
    buffer >> num >> s >> f >> xxx >> yyy >> ddd;
    if(debug)
        cout << "Parsed line #" << num << " s: " << s << " f: " << f
            << " xxx: " << xxx << " yyy: " << yyy << " ddd: " << ddd << endl;
    storeThis.lineNumber = num;
    storeThis.s = s;
    storeThis.f = f;
    storeThis.xxx = xxx;
    storeThis.yyy = yyy;
    storeThis.ddd = ddd;
    return storeThis;
}

// print instruction details
void printInstruction(instruction toPrint)
{
        cout << toPrint.lineNumber << " " << toPrint.s
            << toPrint.f << " " << toPrint.xxx << " "
            << toPrint.yyy << " " << toPrint.ddd << endl;
}

/* parse and execute instruction
 * return line number to jump to or a negative error code
 */
int executeInstruction(instruction toExecute, int memory[])
{
    if(toExecute.s == '+')
    {
        switch (toExecute.f)
        {
            case 0:         // +0, Move xxx to ddd
                if(debug)
                    cout << "\tExecute +0 [Move]" << endl;
                memory[toExecute.ddd] = toExecute.xxx;
                return 0;

            case 1:         // +1, [xxx] + yyy result @ ddd
                if(debug)
                    cout << "\tExecute +1 [+]" << endl;
                memory[toExecute.ddd] = (memory[toExecute.xxx] + toExecute.yyy);
                return 0;

            case 2:         // +2, xxx * yyy result @ ddd
                if(debug)
                    cout << "\tExecute +2 [*]" << endl;
                memory[toExecute.ddd] = (toExecute.xxx * toExecute.yyy);
                return 0;

            case 3:         // +3, xxx * xxx result @ ddd
                if(debug)
                    cout << "\tExecute +3 [Square]" << endl;
                memory[toExecute.ddd] = (toExecute.xxx * toExecute.xxx);
                return 0;

            case 4:         // +4, if [xxx]=[yyy] then goto ddd
                if(debug)
                    cout << "\tExecute +4 [=]" << endl;
                if(memory[toExecute.xxx] == memory[toExecute.yyy])
                    return toExecute.ddd;
                else
                    return 0;

            case 5:         // +5, if xxx >= yyy then goto ddd
                if(debug)
                    cout << "\tExecute +5 [>=] goto " << toExecute.ddd << " if " << memory[toExecute.xxx] << " >= " << memory[toExecute.yyy] << endl;
                if(memory[toExecute.xxx] >= memory[toExecute.yyy])
                    return toExecute.ddd;
                else
                    return 0;

            case 6:         // +6,
                if(debug)
                    cout << "\tExecute +6 [x(y)->z]" << endl;
                memory[toExecute.ddd] = memory[toExecute.xxx + memory[toExecute.yyy]];
                return 0;

            case 7:         // +7, increment xxx and test
                if(debug)   // [xxx]++; if [xxx] < [yyy] then go to ddd;
                    cout << "\tExecute +7 [Increment and test]" << endl;
                toExecute.xxx++;
                if (toExecute.xxx < toExecute.yyy)
                    return toExecute.ddd;
                else
                    return 0;

            case 8:         // +8, store input @ ddd
                if(debug)
                    cout << "\tExecute +8 [Read]" << endl;
                memory[toExecute.ddd] = getNumber();
                return 0;

            case 9:         // +9,
                if(debug)
                    cout << "\tExecute +9 [Stop]" << endl;
                return -4;

            default:        // syntax error
                if(debug)
                    cout << "\tExecute +? (???)" << endl;
                return -1;
        } // end + switch
    } else {
        switch (toExecute.f)
        {
            case 0:         // -0,
                if(debug)
                    cout << "\tExecute -0 (Move literal)" << endl;
                memory[toExecute.ddd] = toExecute.xxx;
                return 0;

            case 1:         // -1, xxx - yyy, result in ddd;
                if(debug)
                    cout << "\tExecute -1 (-)" << endl;
                memory[toExecute.ddd] = (toExecute.xxx - toExecute.yyy);
                return 0;

            case 2:         //-2, xxx / yyy, result in ddd
                if(debug)
                    cout << "\tExecute -2 (/)" << endl;
                if(toExecute.yyy == 0)
                    return -2;
                memory[toExecute.ddd] = (toExecute.xxx / toExecute.yyy);
                return 0;

            case 3:         //-3, sqrt(xxx), result in ddd
                if(debug)
                    cout << "\tExecute -3 (Square Root)" << endl;
                memory[toExecute.ddd] = sqrt((double)toExecute.xxx);
                return 0;

            case 4:         // -4, if xxx != yyy goto ddd
                if(debug)
                    cout << "\tExecute -4 (!=)" << endl;
                if(memory[toExecute.xxx] != memory[toExecute.yyy])
                    return toExecute.ddd;
                else
                    return 0;

            case 5:         // -5, if [xxx] < yyy goto ddd
                if(debug)
                    cout << "\tExecute -5 (<)" << endl;
                if(memory[toExecute.xxx] < toExecute.yyy)
                    return toExecute.ddd;
                else
                    return 0;

            case 6: // -6, move contents of [xxx] to (memLoc[yyy]+contentsOf[ddd])
                if(debug) // xxx yyy ddd
                    cout << "\tExecute -6 (x->y(z))" << endl;
                memory[toExecute.xxx] = memory[toExecute.yyy + memory[toExecute.ddd]];
                return 0;

            case 7:
                if(debug)
                    cout << "\tExecute -7 (Decrement and test)" << endl;
                return 0;

            case 8:         // -8, print xxx literal or what is @ location ddd
                if(debug)
                    cout << "\tExecute -8 (Print)" << endl;
                    cout << "Value at [" << toExecute.ddd << "]: " << memory[toExecute.ddd] << endl;
                return 0;

            case 9:
                if(debug)
                    cout << "Execute -9 (Program Comment)" << endl;
                return 0;

            default:        // syntax error
                if(debug)
                    cout << "Execute -? (???)" << endl;
                return -1;
        }
        return -5;          // unknown error
    }
}

int main()
{
    int programMemory[1000] = {0};
    ifstream openFile;
    vector <instruction> codeContainer;
    string currentLine;

    // open, parse, and store source file in vector<instruction> codeContainer
    openFile.open("pseudocode.txt");
    if(!openFile)
        return 0;
    while (getline(openFile,currentLine))
        codeContainer.push_back(parseLine(currentLine));
    openFile.close();

    //print parsed pseudocode.txt
    if(debug)
    {
        cout << "Parsed " << codeContainer.size() << " total lines of code successfully." << endl << "Source code";
        for(unsigned int i=0; i < codeContainer.size(); i++)
            printInstruction(codeContainer[i]);
    }

    //execute instructions and handle error codes
    for(unsigned int j=0; j < codeContainer.size(); j++)
    {
        instruction toExecute = codeContainer[j];
        if(debug)
        {
            cout << "\tExecuting line ";
            printInstruction(toExecute);
        }
        int result = executeInstruction(toExecute, programMemory); //returns 0 if successful, else returns line # to jump execution to
        if(result)
        {
            if(result == -4) // exit immediately via +9
                goto exit;
            if(result == -1) // syntax error
            {
                cout << "=== Fatal error -> Syntax error" << endl;
                goto exit;
            }
            if(result == -2) // divide by zero error
            {
                cout << "=== Fatal error on line #" << toExecute.lineNumber << " -> divide by zero" << endl;
                goto exit;
            }
            if(result >= 1) // if >=, then jump to program line # result
            {
                int lineNumberReturn = findLineNumber(codeContainer, result); // returns 99999 if invalid line #
                if(lineNumberReturn == -3) // line # not found
                {
                    cout << "=== Fatal error on line #" << toExecute.lineNumber << " -> Invalid value for ddd ["
                    << toExecute.ddd << "] ===" << endl;
                    goto exit;
                }
                else
                    j = lineNumberReturn-1;
            }
        }
    }

exit:
    cout << "Press enter to exit..." << endl;
    return 0;
}
{{< /highlight >}}
