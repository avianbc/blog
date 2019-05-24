---
id: 340
title: XOR Encryption with Brute Force methods for decryption (proof of concept)
date: 2011-02-23T22:25:43-04:00
author: brad
layout: post
guid: http://br4d.net/?p=340
permalink: /xor-encryption-with-brute-force-methods-for-decryption-proof-of-concept/
categories:
  - Java
  - Programming
---
This project evolved from my time in the Cyber Security class at Marshall University. The goal was to create an implementation of a simple encryption scheme as well as brute force methods for decrypting the ciphertext without the original key. To use it:

  1. Select a text file as the active file for encryption/decryption.
  2. Enter your choice of operation.
  3. If the file has been previously encrypted, you can decrypt it as long as you know the key.
  4. If you don’t know the key to an encrypted file, select the brute force method to have the program try all possible combinations to detemine which key was originally used to decrypt the file.

This program uses a wordlist of more than 58,000 words from the English language when brute forcing, which is parsed into a java TreeSet for maximum speed. As such, a text file containing words to match it to is required. I’ve used the one found at this link: [Corncob Wordlist](http://www.mieliestronk.com/wordlist.html)

{{< highlight java >}}
/**
 * CS340 Cryptography
 * February 23, 2011
 * @author Bradley carey
 */

import java.io.*;
import java.util.*;
import javax.swing.*;

public class Encryption
{
    public static void main(String[] args)
            throws NullPointerException, FileNotFoundException, IOException,
            NumberFormatException, Exception
    {
        Scanner input = new Scanner(System.in);
        File file = null;
        String strLine = "";
        JFileChooser fc = new JFileChooser(".");

        file = openFile(fc);
        strLine = readFile(file);
        System.out.println(strLine);

        int select = -1;
        while(select != 0)
        {
            String fName = file.getName();
            System.out.print(""
                    + "\nCurrently selected file: "" + fName + ""..."
                    + "\n1 - Open a different file."
                    + "\n2 - Encrypt " + fName
                    + "\n3 - Decrypt " + fName
                    + "\n4 - Attempt to brute force the key used to encrypt  " + fName
                    + "\n0 - Quit."
                    + "\nWhat would you like to do? ");
            select = Integer.parseInt(input.nextLine());
            switch(select)
            {
                case 1: //open file
                    file = openFile(fc);
                    strLine = readFile(file);
                    System.out.println(strLine);
                    break;
                case 2: // encrypt
                    encrypt(file, true);
                    break;
                case 3: //decrypt
                    encrypt(file, false);
                    break;
                case 4: // brute force
                    bruteForce(file);
                    break;
                case 0: //exit
                    System.exit(0);
                    break;
                default:
                    System.out.println("User fail detected. Please stop doing it wrong and try again.");
                    break;
            }
        }
    }
{{< /highlight >}}

{{< highlight java >}}
    /**
     *
     * @param fc : .
     * @return   : Returns the file to be opened.
     */
    public static File openFile(JFileChooser fc)
    {
        File file = null;
        System.out.println("Open a file...");
        int returnVal = fc.showOpenDialog(null);
        if(returnVal == JFileChooser.APPROVE_OPTION)
        {
            file = fc.getSelectedFile();
            System.out.println("Opened "" + file.getName() + ""...");
        } else
        {
            System.out.println("User cancelled the process. "
                    + "File selection unchanged.");
        }
        return file;
    }
{{< /highlight >}}

{{< highlight java >}}
    /**
     *
     * @param file : Reads in a file.
     * @return     : Returns the text in the file.
     * @throws FileNotFoundException
     * @throws IOException
     */
    public static String readFile(File file)
            throws FileNotFoundException, IOException
    {
        FileReader fr = new FileReader(file);
        BufferedReader br = new BufferedReader(fr);
        String strLine = "";

        int temp = br.read();
        while(temp != -1)
        {
            strLine += (char)temp;
            temp = br.read();
        }
        br.close();
        fr.close();
        return strLine;
    }
{{< /highlight >}}

{{< highlight java >}}
    /**
     *
     * @param file    : File to be encrypted or decrypted.
     * @param encrypt : Encrypt if TRUE, decrypt if FALSE.
     * @param brute   : Overrides encrypt if TRUE, will brutally force the
     *                  selected file open. Does nothing if FALSE.
     * @throws UnsupportedEncodingException
     * @throws FileNotFoundException
     * @throws IOException
     * @throws StringIndexOutOfBoundsException
     */
    public static void encrypt(File file, boolean encrypt)
            throws UnsupportedEncodingException, FileNotFoundException,
            IOException, StringIndexOutOfBoundsException
    {
        byte[] tempbyte = new byte[2];
        byte[] tempkey = new byte[2];
        String outfile = "";

        Scanner input = new Scanner(System.in);
        FileReader fr = new FileReader(file);
        BufferedReader br = new BufferedReader(fr);

        System.out.print("Enter key: ");
        String key = input.nextLine();
        key = key.substring(0, 2);
        tempkey = key.getBytes("US-ASCII");

        String outstr = "";
        String txt = "";

        int temp0 = br.read();
        while(temp0 != -1)
        {
            txt += (char)temp0;
            temp0 = br.read();
        }

        if(txt.length() % 2 != 0)
            txt += " ";
        for(int i = 0; i < txt.length()/2; i++)
        {
            tempbyte[0] = (byte)txt.charAt(i*2);
            tempbyte[1] = (byte)txt.charAt(i*2+1);
            tempbyte[0] = (byte)(tempbyte[0] ^ tempkey[0]);
            tempbyte[1] = (byte)(tempbyte[1] ^ tempkey[1]);
            outstr += (char)tempbyte[0] + "" + (char)tempbyte[1];
        }

        if(encrypt)
        {
            outfile += "encryptedMessage.txt";
        }
        else if(!encrypt)
        {
            outfile += "decryptedMessage.txt";
        }
        FileWriter fw = new FileWriter(new File(".\" + outfile));
        BufferedWriter bw = new BufferedWriter(fw);
        bw.write(outstr);
        bw.close();
        fw.close();
        System.out.println("\nWritten to file: " + outfile + "..." + "\n" + outstr);
    }
{{< /highlight >}}

{{< highlight java >}}
    /*
     *  Decrypts file and returns the file as a string for use in the
     *  brute force function
     * @param file  : File to decrypt
     * @param key1  : First byte of encryption key
     * @param key2  : Second byte of encryption key
     */
    public static String decrypt(File file, byte key1, byte key2) throws Exception
    {
        String outstr = "";
        String txt = "";
        byte[] tempbyte = new byte[2];

        FileReader fr = new FileReader(file);
        BufferedReader br = new BufferedReader(fr);

        int temp0 = br.read();
        while(temp0 != -1)
        {
            txt += (char)temp0;
            temp0 = br.read();
        }

        if(txt.length() % 2 != 0)
            txt += " ";
        for(int i = 0; i < txt.length()/2; i++)
        {
            tempbyte[0] = (byte)txt.charAt(i*2);
            tempbyte[1] = (byte)txt.charAt(i*2+1);
            tempbyte[0] = (byte)(tempbyte[0] ^ key1);
            tempbyte[1] = (byte)(tempbyte[1] ^ key2);
            outstr += (char)tempbyte[0] + "" + (char)tempbyte[1];
        }

        return outstr;
    }
{{< /highlight >}}

{{< highlight java >}}
    /* Attempts to discover the 16 bit key used to encrypt the given file
     * @param file  : File to brute force
     */
    public static void bruteForce(File file) throws Exception
    {
        ArrayList<String> possibleKeys = new ArrayList<String>(); // holds possible keys

        TreeSet<String> wordList = new TreeSet<String>(); // populate tree with wordlist
        File words = new File(".\\corncob_lowercase.txt");
        Scanner in = new Scanner(words);
        while(in.hasNextLine())
            wordList.add(in.nextLine());
        in.close();

        byte[] tempkey = new byte[2];
        FileReader fr = new FileReader(file);
        BufferedReader br = new BufferedReader(fr);
        for(int i = 32; i <= 126; i++)
        {
            for(int j = 32; j <= 126; j++)
            {
                tempkey[0] = (byte)i;
                tempkey[1] = (byte)j;
                String decryptedStuff = decrypt(file, tempkey[0], tempkey[1]);

                ArrayList<String> tokens = new ArrayList<String>();
                Scanner tokenize = new Scanner(decryptedStuff);
                while (tokenize.hasNext())  //tokenize decrypted ciphertext
                {
                    tokens.add(tokenize.next());
                }
                //System.out.println("Key: [" + (char)tempkey[0] + "" + (char)tempkey[1] + "] Message: " + decryptedStuff);
                //System.out.println("Tokens: [" + tokens + "] and total # of tokens: " + tokens.size());

                int confidence = 0;

                for(int w = 0; w < tokens.size(); w++)
                {
                    String s = tokens.get(w).toLowerCase();
                    //s = s.replaceAll("[^a-zA-Z]", ""); // remove all non-alpha characters from current token?

                    if(s.length() > 3 && wordList.contains(s)) //ignore words less than 3 characters to improve speed
                    {
                        System.out.println("Match found using token [" + s + "] and key " + (char)tempkey[0] + (char)tempkey[1]);
                        confidence++;
                    }
                }
                if(confidence > 1) // add key to list of possible solutions as well as a confidence level
                    possibleKeys.add(confidence + " " + (char)tempkey[0] + "" + (char)tempkey[1]);
            }
        }

        Collections.sort(possibleKeys, Collections.reverseOrder()); // sort possible keys in order from highest confidence to least

        System.out.println("Now printing 5 best matches. The number at the start is the confidence level and it is followed by the two-digit key.");
        for (int r=0; r < possibleKeys.size() && r < 5; r++) // print possible keys that were found
        {
            System.out.println(possibleKeys.get(r));
        }

        String temp = possibleKeys.get(0);
        temp = temp.substring(temp.length()-2);
        System.out.println("The key used to encrypt was probably " + temp
                + "\nIf you feel this is incorrect, please refer to the list above.");
    }
}
{{< /highlight >}}
