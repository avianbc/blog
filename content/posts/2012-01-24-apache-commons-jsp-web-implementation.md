---
id: 402
title: Apache Commons JSP Web Implementation
date: 2012-01-24T00:03:02-04:00
author: brad
layout: post
guid: http://br4d.net/?p=402
permalink: /apache-commons-jsp-web-implementation/
categories:
  - Java
  - Programming
---
[<img class="alignleft size-medium wp-image-403" title="" src="/images/2015/01/acwi-300x163.png" alt="acwi" width="300" height="163" srcset="/images/2015/01/acwi-300x163.png 300w, /images/2015/01/acwi.png 581w" sizes="(max-width: 300px) 100vw, 300px" />](/images/2015/01/acwi.png)

If you are a Java developer then you are very familiar with The Apache Commons. This web app is just basically a web implementation of the commons’ Math library. Here is an excerpt from the Commons’ website about Commons Math:

Commons Math is a library of lightweight, self-contained mathematics and statistics components addressing the most common problems not available in the Java programming language or Commons Lang.

<div class="well">
  Guiding principles:</p> 
  
  <ol>
    <li>
      Real-world application use cases determine development priority.
    </li>
    <li>
      This package emphasizes small, easily integrated components rather than large libraries with complex dependencies and configurations.
    </li>
    <li>
      All algorithms are fully documented and follow generally accepted best practices.
    </li>
    <li>
      In situations where multiple standard algorithms exist, a Strategy pattern is used to support multiple implementations.
    </li>
    <li>
      Limited dependencies. No external dependencies beyond Commons components and the core Java platform (at least Java 1.3 up to version 1.2 of the library, at least Java 5 starting with version 2.0 of the library).
    </li>
  </ol>
</div>

This JSP implements this library using a web interface. It was coded in Java using the Netbeans IDE and ran on Apache Tomcat. It does have Commons Lang and Commons Math as dependencies, which are not included. The *.jar files for these are availiable ont he Apache Commons website. For more details, visit the Google Code website.

Links:

  * [ACWI on Google Code](http://code.google.com/p/acwi/)
  * [ACWI source code](http://code.google.com/p/acwi/source/browse/)
  * [Apache Commons](http://commons.apache.org/)
  * [Commons Lang](http://commons.apache.org/lang/)
  * [Commonms Math](http://commons.apache.org/math/)
  * [Apache Tomcat](http://tomcat.apache.org/)