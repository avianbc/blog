---
id: 357
title: 'NGif C# Library with assorted bugfixes'
date: 2012-07-23T23:05:24-04:00
author: brad
layout: post
guid: http://br4d.net/?p=357
permalink: /ngif-c-library-with-assorted-bugfixes/
categories:
  - CSharp
  - Programming
  - Sprite Editor
---
NGif is a C# .NET library to handle encoding and decoding of animated GIFs. I found a use for it, but it had a few bugs. The very last two pixels were being rendered incorrectly as red and the transparency was not functioning properly. I have fixed these bugs, made a few minor improvements, and included writing to a Stream instead of to a File.

Links:

  * [Download bugfixed NGif_Bugfixes.rar](/images/2015/01/NGif_Bugfixes.rar)
  * [Official NGif Website](http://www.codeproject.com/Articles/11505/NGif-Animated-GIF-Encoder-for-NET)
