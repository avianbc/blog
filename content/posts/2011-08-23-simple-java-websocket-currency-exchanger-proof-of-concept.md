---
id: 360
title: Simple Java websocket currency exchanger (Proof of Concept)
date: 2011-08-23T23:07:45-04:00
author: brad
layout: post
guid: http://br4d.net/?p=360
permalink: /simple-java-websocket-currency-exchanger-proof-of-concept/
categories:
  - Java
  - Programming
---
This program is a simple client/server websocket program. The client sends a currency amount, type, and type to convert it to and the server responds with the correct conversion. Conversion factors are way out of date since this program was written in 2009.

Client source code:

{{< highlight java >}}
/**
 * Client for currency exchange server
 * @author Bradley Carey
 */
import java.io.*;
import java.net.*;

public class ExchangeClient
{
    public static void main(String[] args) throws Exception
    {
        String hostname = args[0];
        String amount = args[1];
        String from = args[2];
        String to = args[3];
        String toSend = amount + "?" + from + "?" + to;
        Socket mySocket = new Socket(hostname, 52719);

        OutputStream myOS = mySocket.getOutputStream();
        DataOutputStream myDOS = new DataOutputStream(myOS);

        InputStream myIS = mySocket.getInputStream();
        InputStreamReader myISR = new InputStreamReader(myIS);
        BufferedReader myBR = new BufferedReader(myISR);
        myDOS.writeBytes(toSend + '\n');
        toSend = myBR.readLine();

        System.out.println(toSend);
        mySocket.close();
    }
}
{{< /highlight >}}

Server source code:

{{< highlight java >}}
/**
 * Converts one currency to another over network using Sockets
 * @author Bradley Carey
 */
import java.io.*;
import java.net.*;
import java.text.DecimalFormat;

public class ExchangeServer
{
    public static void main(String[] args) throws Exception
    {
        ServerSocket mySocket = new ServerSocket(52719);
        while(true)
        {
            Socket clientSocket = mySocket.accept();
            InputStream myIS = clientSocket.getInputStream();
            InputStreamReader myISR = new InputStreamReader(myIS);
            BufferedReader myBR = new BufferedReader(myISR);
            OutputStream myOS = clientSocket.getOutputStream();
            DataOutputStream myDOS = new DataOutputStream(myOS);
            String toParse = myBR.readLine();
            String[] tokens = toParse.split("?");

            System.out.println("Amount to convert: " + tokens[0]);
            System.out.println("Currency type:" + tokens[1]);
            System.out.println("Convert to: " + tokens[2]);

            if(tokens[1].length() != 3 || tokens[2].length() != 3)
            {
                myDOS.writeBytes("Error: invalid currency type" + '\n');
            }

            double conversionFactor = 0.0;

            if(tokens[1].equals("USD"))
            {
                if(tokens[2].equals("GBP"))
                    conversionFactor = 0.504872;
                if(tokens[2].equals("EUR"))
                    conversionFactor = 0.640179;
                if(tokens[2].equals("INR"))
                    conversionFactor = 42.5713;
            }

            if(tokens[1].equals("INR"))
            {
                if(tokens[2].equals("GBP"))
                    conversionFactor = 0.0118594;
                if(tokens[2].equals("EUR"))
                    conversionFactor = 0.0150514;
                if(tokens[2].equals("USD"))
                    conversionFactor = 0.02349;
            }

            if(tokens[1].equals("GBP"))
            {
                if(tokens[2].equals("USD"))
                    conversionFactor = 1.9807;
                if(tokens[2].equals("EUR"))
                    conversionFactor = 1.26947;
                if(tokens[2].equals("INR"))
                    conversionFactor = 84.3213;
            }

            if(tokens[1].equals("EUR"))
            {
                if(tokens[2].equals("GBP"))
                    conversionFactor = 0.787729;
                if(tokens[2].equals("USD"))
                    conversionFactor = 1.56206;
                if(tokens[2].equals("INR"))
                    conversionFactor = 66.439;
            }

            double output = Double.parseDouble(tokens[0]) * conversionFactor;
            DecimalFormat df = new DecimalFormat( "#########0.00");
            String sendThisBack = tokens[0] + " " + tokens[1] + " = " + df.format(output) + " " + tokens[2] + '\n';

            myDOS.writeBytes(sendThisBack);
            clientSocket.close();
        }
    }
}
{{< /highlight >}}
