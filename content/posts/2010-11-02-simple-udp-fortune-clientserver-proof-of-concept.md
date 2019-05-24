---
id: 362
title: Simple UDP Fortune Client/Server (Proof of Concept)
date: 2010-11-02T23:09:37-04:00
author: brad
layout: post
guid: http://br4d.net/?p=362
permalink: /simple-udp-fortune-clientserver-proof-of-concept/
categories:
  - Java
  - Programming
---
This program is a simple client/server UDP/Datagram network program. The client sends a random number which is then used to display a random fortune on the client’s screen.

#Client

{{< highlight java >}}
/**
 * Fortune Cookie Client. Sends random number to specified host via UDP and prints reply.
 * @author Bradley Carey
 * @version November 2, 2010
 */

import java.io.*;
import java.net.*;
import java.util.*;

public class FortuneClient
{
    public static void main(String[] args) throws Exception
    {
        if (args.length<= 1)
        {
            System.out.println("You must specify a valid hostname and port number.");
            System.exit(0);
        }
        String hostname = args[0];
        String port = args[1];

        InetAddress destination = InetAddress.getByName(hostname);

        Random myRandom = new Random();
        int requestNo = myRandom.nextInt(10);
        String toSend = "" + requestNo;

        DatagramSocket mySocket = new DatagramSocket();
        mySocket.setSoTimeout(2000);
        byte[] os = toSend.getBytes();
        DatagramPacket sendThis = new DatagramPacket(os, os.length, destination, Integer.parseInt(port));
        mySocket.send(sendThis);

        try
        {
            DatagramPacket replyPacket = new DatagramPacket(new byte[1024], 1024);
            mySocket.receive(replyPacket);
            String recvMsg = new String(replyPacket.getData());
            recvMsg = recvMsg.replaceAll("\n","");
            System.out.println("Fortune: " + recvMsg);
        }
        catch (SocketTimeoutException e)
        {
            System.out.println("Error: Timeout!");
        }

        System.out.println(toSend);
        mySocket.close();
    }
}
{{< /highlight >}}

#Server

{{< highlight java >}}
/**
 * Fortune Cookie server program.
 * @author Bradley Carey
 * @version November 2, 2010
 */

import java.io.*;
import java.util.*;
import java.net.*;

public class FortuneServer
{
    public static void main(String[] args) throws Exception
    {
        Scanner myScanner = new Scanner(System.in);
        System.out.print("Enter port number: ");
        int port = Integer.parseInt(myScanner.nextLine());
        DatagramSocket socket = new DatagramSocket(port);
        Random random = new Random();
        while(true)
        {
            DatagramPacket request = new DatagramPacket(new byte[1024], 1024);
            socket.receive(request);

            InetAddress clientHost = request.getAddress();
            int clientPort = request.getPort();
            int fortuneNo = random.nextInt(10);

            String fortune = "";
            if(fortuneNo == 0)
                fortune += "A feather in the hand is better than a bird in the air.";
            else if(fortuneNo == 1)
                fortune += "Better ask twice than lose yourself once.";
            else if(fortuneNo == 2)
                fortune += "Disbelief destroys the magic.";
            else if(fortuneNo == 3)
                fortune += "Fortune Not Found: Abort, Retry, Ignore?";
            else if(fortuneNo == 4)
                fortune += "Help! I'm being held prisoner in a chinese bakery!";
            else if(fortuneNo == 5)
                fortune += "Please visit us at www.wontonfood.com";
            else if(fortuneNo == 6)
                fortune += "Confucius says: Man who run behind car get exhausted!";
            else if(fortuneNo == 7)
                fortune += "Unexpected statement.";
            else if(fortuneNo == 8)
                fortune += "The cake IS a lie.";
            else if(fortuneNo == 9)
                fortune += "Cannot find host. Your fortune is void.";
            else
                fortune += "Error: Your fortune does not exist.";

            byte[] fortunereply = fortune.getBytes();
            DatagramPacket reply = new DatagramPacket(fortunereply, fortunereply.length, clientHost, clientPort);
            socket.send(reply);
        }
    }
}
{{< /highlight >}}
