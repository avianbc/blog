---
id: 500
title: 'MSI Web Setup Project Error: Unable to build project output group &#8216;Content Files from SOMEWEB (Active)&#8217;'
date: 2015-02-23T20:18:59-04:00
author: brad
layout: post
guid: http://br4d.net/?p=500
permalink: /msi-web-setup-project-unable-to-build-project-output-group-content-files-from-someweb-active/
categories:
  - ASP.NET
  - Programming
---
I stumbled onto this error and thanks to [Scott Hanselman&#8217;s blog](http://www.hanselman.com/blog/VisualStudioMSIProblemsUnableToBuildProjectOutputGroupContentFilesFromSOMEWEBActive.aspx "Scott Hanselman's blog") I was able to find a solution to it. 

The only problem? My project had a TON of files marked as Content (such as multiple versions of angular) and I didn&#8217;t want to spend all morning going through the countless folders to figure out which files were missing in order to resolve the conflict. If only Visual Studio has some way to verify this and let you know which files were missing&#8230;

Oh wait, it does! Its just buried and very difficult to find. 

You can get visual studio to display all these &#8220;yellow icon&#8221; missing files by using the Publish Solution option. For those of you unfamiliar with the publish wizard, here is what I did:

  * Right Click your website project and click publish.
  * On the publish wizard that pops up, select Custom and type in any name for the profile.
  * For publish method, I selected File System and chose a directory to publish to.
  * Click the Publish button and it will error and show you exactly which files were missing. You may have to do this multiple times until you get all the missing files resolved.