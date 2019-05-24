---
id: 343
title: 'Simple Java *nix shell (Proof of Concept)'
date: 2012-08-23T22:26:54-04:00
author: brad
layout: post
guid: http://br4d.net/?p=343
permalink: /simple-java-nix-shell-proof-of-concept/
categories:
  - Java
  - Programming
---
This is a very simple shell interface with a built-in history feature for use in your favorite *nix environment. This small project comes from a project in my Operating Systems class at Marshall University in which we were studying message passing models in modern OSs.

It should work fine with any program that is defined in your system $PATH variable (usually /usr/bin, etc). If you type !!, it will re-run the previous command. Or n!, where n is the number of the previous command. To get a list of these previous commands and their corresponding numbers, use the ‘history’ command which will show you all of your previous entries.

{{< highlight java >}}
/*
 * Simple java shell with history feature
 * @author bradley carey
 * @date September 26, 2011
 */

import java.io.*;
import java.util.*;
import java.lang.ProcessBuilder;

public class SimpleShell {
    public static void main(String[] args) throws java.io.IOException
    {
        String commandLine, delims = "[ ]+", pwd;
        ArrayList<String> history = new ArrayList<String>();

        BufferedReader console = new BufferedReader(new InputStreamReader(System.in));

        pwd = System.getProperty("user.home");

        while (true)
        {
            System.out.print("jsh@" + pwd + ">");
            commandLine = console.readLine();

            if(commandLine.equals(""))
                continue;

            if(commandLine.equals("exit"))
                System.exit(0);

            String[] tokens = commandLine.split(delims);
            for (String s: tokens)
            {
                //currentCommand.add(s);
                System.out.println("tokens:" + s);
            }
            history.add(commandLine);
            if(commandLine.equals("history"))
            {
                for(int i=0; i < history.size()-1; i++)
                    System.out.println("[" + i + "] " + history.get(i));
                continue;
            }

            if(commandLine.charAt(0) == '!')
            {
                char which = commandLine.charAt(1);
                if(which=='!') // !! entered, print previous command
                {
                    if(history.size() > 2)
                    {
                        String toRun = history.get(history.size()-2);
                        tokens = toRun.split(delims);
                        for (String s: tokens)
                            System.out.println(s);

                    } else {
                        System.out.println("Error: unable to run previous command!");
                        continue;
                    }
                } else { // !n, run nth command
                    int whichNum = Integer.parseInt(Character.toString(which));
                    if(history.size() > whichNum)
                    {
                        String toRun = history.get(whichNum);
                        tokens = toRun.split(delims);
                        System.out.println(toRun);
                    } else {
                        System.out.println("Error: unable to run history command. Out of bounds error?");
                        continue;
                    }
                }
            }

            if(commandLine.equals("cd"))
            {
                pwd = System.getProperty("user.home");
                continue;
            }

            if(tokens[0].equals("cd"))
            {
                String changeTo = tokens[1];
                if(changeTo.contains("/")) // absolute path
                {
                    File tempFile = new File(tokens[1]);
                    if(!tempFile.exists()) // file doesnt exist, abort
                    {
                        System.out.println("Error: invalid directory specified");
                        continue;
                    } else { // file exists, change dir
                        pwd = tokens[1];
                    }
                } else { // relative path
                    System.out.println(pwd + "/" + tokens[1]);
                    File tempFile = new File(pwd + "/" + tokens[1]);
                    if(!tempFile.exists())
                    {
                        System.out.println("Error: invalid directory specified");
                        continue;
                    } else {
                        pwd = pwd + "/" + tokens[1];
                    }
                }
                continue;
            }

            try
            {
                ProcessBuilder newProcess = new ProcessBuilder(tokens);
                newProcess.directory(new File(pwd));
                Process current = newProcess.start();
                current.waitFor(); // create new process and wait for execution to finish

                // print output
                BufferedReader is = new BufferedReader(new InputStreamReader(current.getInputStream()));
                String line;
                while ((line = is.readLine()) != null)
                    System.out.println(line);

                // print errors
                is = new BufferedReader(new InputStreamReader(current.getErrorStream()));
                while ((line = is.readLine()) != null)
                    System.out.println(line);
            } catch(IOException e) {
                System.out.println("Error: IOException has occurred. Command invalid?");
            } catch(InterruptedException e2) {
                System.out.println("Error: InterruptedException has occurred");
            }
        } // end while loop
    }
}
{{< /highlight >}}
