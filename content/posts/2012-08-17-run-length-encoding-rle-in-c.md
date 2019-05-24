---
id: 120
title: 'Run-Length Encoding (RLE) in C#'
date: 2012-08-17T14:47:10-04:00
author: brad
layout: post
guid: http://avian.netne.net/blog/?p=120
permalink: /run-length-encoding-rle-in-c/
categories:
  - Programming
tags:
  - algorithms
  - 'CSharp'
  - Programming
---
I recently came across a file format that required usage of [Run Length Encoding](http://en.wikipedia.org/wiki/Run-length_encoding) to handle. This involved writing methods for both decoding and encoding. Here are my results:

To decode, you just use a string and concatenate it with each numeric character that is encountered until you hit a non-numeric character. You use this string to figure out how many times you need to repeat the character:

{{< highlight csharp >}}
public static string Decode(string toDecode)
{
    string coefficient = String.Empty;
    StringBuilder sb = new StringBuilder();

    foreach (char current in toDecode)
    {
        if (char.IsDigit(current))
            coefficient += current;
        else
        {
            if (coefficient == String.Empty)
                sb.Append(current);
            else
            {
                int count = int.Parse(coefficient);
                coefficient = String.Empty;
                for (int j = 0; j < count; j++)
                    sb.Append(current);
            }
        }
    }
    return sb.ToString();
}
{{< /highlight >}}

Similarly, for encoding. I used a stringbuilder and a counter to figure out how many times a character was repeated then appended this to the stringbuilder:

{{< highlight csharp >}}
public static string Encode(string toEncode)
{
    StringBuilder sb = new StringBuilder();
    int count = 1;
    char current = toEncode[0];
    for (int i = 1; i < toEncode.Length; i++)
    {
        if (current == toEncode[i])
        {
            count++;
        } else
        {
            sb.AppendFormat("{0}{1}", count, current);
            count = 1;
            current = toEncode[i];
        }
    }
    sb.AppendFormat("{0}{1}", count, current);
    return sb.ToString();
}
{{< /highlight >}}

Note that RLE is a primitive form of compression and should probably be avoided. If you need to compress something for transmission or storage you might be better off using something like [GZipStream](http://msdn.microsoft.com/en-us/library/system.io.compression.gzipstream.aspx).
