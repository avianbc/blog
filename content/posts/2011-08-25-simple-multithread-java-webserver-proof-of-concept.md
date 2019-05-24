---
id: 338
title: Simple Multithread Java Webserver (proof of concept)
date: 2011-08-25T22:20:38-04:00
author: brad
layout: post
guid: http://br4d.net/?p=338
permalink: /simple-multithread-java-webserver-proof-of-concept/
categories:
  - Java
  - Programming
---
This project was nothing more than a proof-of-concept and should not be put into usage (get apache instead). It is a simple webserver written in Java that can take simultaneous requests via multithreading, parse the request, and properly respond. This program served as my forray into multithreading as well as the gritty details to what happens behind the scenes in a webserver.

{{< highlight java >}}
/**
 * web server and client
 * @author Bradley Carey
 */

import java.io.*;
import java.net.*;
import java.util.*;

public final class WebServer
{
    public static void main(String argv[]) throws Exception
    {
        //set port number
        int port = 8080;
        ServerSocket myServerSocket = null;

        //establish listen socket
        try {
            myServerSocket = new ServerSocket(port);
        } catch (IOException e) {
            System.out.println("Could not listen on port # " + port);
            System.exit(-1);
        }

        //process http service requests in infinite loop
        while(true)
        {
            //listen for tcp connection requests
            Socket clientSocket = null;
            try {
                clientSocket = myServerSocket.accept();
            } catch (IOException e) {
                System.out.println("Accept failed on port # " + port);
                System.exit(-1);
            }

            HttpRequest request = new HttpRequest(clientSocket);
            Thread thread = new Thread(request);
            thread.start();
        }
    }
}

final class HttpRequest implements Runnable
{
    final static String CRLF = "\r\n";
    Socket socket;

    public HttpRequest(Socket socket) throws Exception
    {
        this.socket = socket;
    }

    public void run()
    {
        try
        {
            processRequest();
        } catch (Exception e) {
            System.out.println(e);
        }
        //throw new UnsupportedOperationException("Not supported yet.");
    }

    private void processRequest() throws Exception
    {
        //get reference to socket's input & output streams and setup filters
        InputStream is = socket.getInputStream();
        InputStreamReader isr = new InputStreamReader(is);
        OutputStream os = socket.getOutputStream();
        DataOutputStream dos = new DataOutputStream(os);
        BufferedReader br = new BufferedReader(isr);

        String requestLine = br.readLine();
        System.out.println(requestLine);

        String headerLine = null;
        while ((headerLine = br.readLine()).length() != 0) {
            System.out.println(headerLine);
        }

        StringTokenizer tokens = new StringTokenizer(requestLine);
        tokens.nextToken();
        String fileName = tokens.nextToken();

        if (fileName.equals("/"))
                fileName = "/default.htm";

        fileName = "." + fileName;

        System.out.println("\nfileName:" + fileName);

        FileInputStream fis = null;
        boolean fileExists = true;
        try {
            fis = new FileInputStream(fileName);
        } catch (FileNotFoundException e) {
            fileExists = false;
        }

        String statusLine = null;
        String contentTypeLine = null;
        String entityBody = null;
        if (fileExists) {
            statusLine = "HTTP/1.1 202 Accepted" + CRLF;
            contentTypeLine = "Content-type: " + contentType(fileName) + CRLF;
        } else {
            statusLine = "HTTP/1.1 404 Not Found" + CRLF;
            contentTypeLine = "text/html" + CRLF;
            entityBody = "<HTML>"
              + "<HEAD><TITLE>Not Found</TITLE></HEAD>"
              + "<BODY>404 Not Found</BODY></HTML>";
        }

        //Send the status line
        dos.writeBytes(statusLine);
        System.out.println("statusLine: " + statusLine);

        //Send the content type line
        dos.writeBytes(contentTypeLine);
        System.out.println("contentTypeLine: " + contentTypeLine);
        System.out.println("entityBody: " + entityBody);

        //Send a blank line to indicate the end of the header line
        dos.writeBytes(CRLF);

        //Send the entity body
        if (fileExists) {
          sendBytes(fis, os);
          fis.close();
        } else {
          os.write(entityBody.getBytes());
        }

        dos.close();
        os.close();
        br.close();
        socket.close();
    }

    private static void sendBytes(FileInputStream fis, OutputStream os) throws Exception
    {
        byte[] buffer = new byte[1024];
        int bytes = 0;

        while((bytes = fis.read(buffer)) != -1) {
            os.write(buffer, 0, bytes);
        }
    }

    private static String contentType(String fileName)
    {
        if (fileName.endsWith(".htm") || fileName.endsWith(".html"))
            return "text/html";
        if(fileName.endsWith(".gif"))
            return "image/gif";
        if(fileName.endsWith(".jpg"))
            return "image/jpg";

        return "application/octet-stream";
    }
}
{{< /highlight >}}
