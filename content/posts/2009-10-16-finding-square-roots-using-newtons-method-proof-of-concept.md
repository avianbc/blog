---
id: 368
title: 'Finding square roots using Newton’s Method (Proof of Concept)'
date: 2009-10-16T23:15:06-04:00
author: brad
layout: post
guid: http://br4d.net/?p=368
permalink: /finding-square-roots-using-newtons-method-proof-of-concept/
categories:
  - Java
  - Programming
---
This program uses the famous method by Isaac Newton to iteratively find the square root of a number. It relies upon an inital guess which is then improved until the answer is accurate within 0.000001.

{{< highlight java >}}
/**
 * Computes square root of a number (Newton's Method)
 * @author Bradley Carey
 * @version 16-Oct-2009
 */
import java.util.Scanner;
public class NewtonsMethod
{
    public static void main(String[] args)
    {
        Scanner myScanner = new Scanner(System.in);
        boolean done = false;
        double guess=0.0;
        while (true)
        {
            done = false;
            System.out.print("\nEnter the number to take the square root of: ");
            String answer = myScanner.nextLine();
            double x = Double.parseDouble(answer);

            if (x<=0)
            {
                System.out.print("Error: only positive inputs are valid.\n");
                return;
            }
            else
            {
                System.out.print("Enter a guess for the square root: ");
                answer = myScanner.nextLine();
                guess = Double.parseDouble(answer);
            }

            while (!done)
            {
                double newGuess = guess-(guess*guess-x)/(2*guess);
                System.out.print("newGuess = " + newGuess + "\n");

                if (Math.abs(guess-newGuess)<0.00001)
                {
                    System.out.print("To within .000001, The square root of " + x + " is " + newGuess);
                    System.out.print("\nDo another? y/n  ");
                    answer = myScanner.nextLine();
                    done=true;

                    if(answer.equals("n"))
                    {
                        System.out.print("Good Bye!!\n");
                        System.exit(0);
                    }
                }
                else
                {
                    guess = newGuess;
                }
            }
        }
    }
}
{{< /highlight >}}
