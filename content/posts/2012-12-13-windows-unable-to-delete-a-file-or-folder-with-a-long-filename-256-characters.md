---
id: 288
title: 'Windows &#8211; Unable to delete a file or folder with a long filename (256+ characters)'
date: 2012-12-13T01:50:40-04:00
author: brad
layout: post
guid: http://avian.netne.net/blog/?p=288
permalink: /windows-unable-to-delete-a-file-or-folder-with-a-long-filename-256-characters/
categories:
  - Random
---
So I was using a 3rd party iPod management program to copy songs from my iPod back to my hard drive and the program somehow made a folder with a name that was absurdly long. So long that even windows refused to delete it no matter what. The exact error says: &#8220;The filename or extension is too long&#8221;. The [official MS documentation](http://support.microsoft.com/kb/320081) gives 5 suggestions and none of them seemed to work for me. Here is what I did to fix the problem.

<!--more-->

I did end up using the 8.3 filename to delete it as in the first suggestion. The problem though? Windows still wouldn&#8217;t delete even using the small 8.3 filename. What you need to do is first rename the folder using the 8.3 filename to something shorter. Then the delete command will work. Something like this:

1) Open a command prompt (start -> run -> type in &#8220;cmd&#8221; and hit enter).  
2) Use the cd command to change to the folder that contains the long filename.  
3) Use the dir command with the /x switch to display the small 8.3 filename (type &#8220;dir /x&#8221;)  
4) It will display the 8.3 filename of the loooooong filename. It will look something like &#8220;LONGFI~1&#8221;.  
5) Use the rename command to change it to something short. (type rename LONGFI~1 shortname)  
6) Now the file is renamed to &#8220;shortname&#8221;! You can safely delete it through windows explorer or using the DEL command.

Google suggested using the small 8.3 filename but it wont delete it. It still says too long and errors. Make sure you rename it first! Hopefully this will help the google ninjas out there with a similar problem.