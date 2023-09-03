---
id: 370
title: 'Simple *nix pipes proof of concept'
date: 2012-01-23T23:17:06-04:00
author: brad
layout: post
guid: http://br4d.net/?p=370
permalink: /simple-nix-pipes-proof-of-concept/
categories:
  - Linux
  - Programming
tags:
  - C / C++
  - Minix
---
This program is a simple program that uses pipes to relay information. In this case, the information is a string which the case is inverted and then displayed. This program was written on [Minix](http://www.minix3.org/) using the elvis text editor and compiled in gcc.

{{< highlight cpp >}}
#include <stdio.h>
#include <unistd.h>
#include <sys/types.h>
#include <string.h>
#include <ctype.h>
#define BUFFER_SIZE 25
#define READ_END 0
#define WRITE_END 1

int main(void)
{
    printf("start");
    char write_msg[BUFFER_SIZE] = "Greetings";
    char read_msg[BUFFER_SIZE];
    pid_t pid;
    int first_pipe[2];
    int second_pipe[2];
    int i;

    if(pipe(first_pipe) == -1)
    {
        fprintf(stderr, "First Pipe failed");
        return 1;
    }

    if(pipe(second_pipe) == -1)
    {
        fprintf(stderr, "Second Pipe failed");
        return 1;
    }

    pid = fork();

    if(pid > 0)      // parent process
    {
        close(first_pipe[READ_END]);
        close(first_pipe[WRITE_END]);
        read(second_pipe[READ_END], read_msg, BUFFER_SIZE);
        printf("parent read :%s<\n",read_msg);
    }
    else            // child process
    {
        close(second_pipe[READ_END]);
        close(second_pipe[WRITE_END]);

        read(first_pipe[READ_END], read_msg, BUFFER_SIZE);
        printf("child read >%s<\n", read_msg);

        for (i=0; i < strlen(read_msg); i++)
        {
            if (isupper(read_msg[i]))
                write_msg[i] = tolower(read_msg[i]);
            else if (islower(read_msg[i]))
                write_msg[i] = toupper(read_msg[i]);
            else
                write_msg[i] = read_msg[i];
        }
        write(second_pipe[WRITE_END], write_msg, strlen(write_msg)+1);

        close(second_pipe[WRITE_END]);
        close(second_pipe[READ_END]);
    }
    return 0;
}
{{< /highlight >}}
