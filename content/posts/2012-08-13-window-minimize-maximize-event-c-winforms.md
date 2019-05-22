---
id: 69
title: 'Window Minimize / Maximize Event (C# winforms)'
date: 2012-08-13T09:58:34-04:00
author: brad
layout: post
guid: http://avian.netne.net/blog/?p=69
permalink: /window-minimize-maximize-event-c-winforms/
categories:
  - Programming
tags:
  - .NET
  - 'C#'
  - winforms
---
If you are working in C# winforms and need to respond to window minimize and maximize events, it seems that winforms does not provide native event handlers. Sucha feat is still very much possible through hooking into the Windows API.

<!--more-->

The exact message you need to catch is [WM_SYSCOMMAND](http://msdn.microsoft.com/en-us/library/windows/desktop/ms646360(v=vs.85).aspx) and look for the SC_* messages:

  * SC_CLOSE 0xF060
  * SC_MAXIMIZE 0xF030
  * SC_MINIMIZE 0xF020
  * SC_RESTORE 0xF120

There are indeed more messages. Check the above link for a full list. Now for some sample code:

<div class="codecolorer-container csharp default" style="overflow:auto;white-space:nowrap;">
  <div class="csharp codecolorer">
    <span class="kw1">protected</span> <span class="kw1">override</span> <span class="kw4">void</span> WndProc<span class="br0">&#40;</span><span class="kw1">ref</span> Message m<span class="br0">&#41;</span><br /> <span class="br0">&#123;</span><br /> &nbsp; &nbsp; <span class="kw1">base</span><span class="sy0">.</span><span class="me1">WndProc</span><span class="br0">&#40;</span><span class="kw1">ref</span> m<span class="br0">&#41;</span><span class="sy0">;</span><br /> &nbsp; &nbsp; <span class="kw1">if</span> <span class="br0">&#40;</span>m<span class="sy0">.</span><span class="me1">Msg</span> <span class="sy0">==</span> 0x0112<span class="br0">&#41;</span> <span class="co1">// WM_SYSCOMMAND</span><br /> &nbsp; &nbsp; <span class="br0">&#123;</span><br /> &nbsp; &nbsp; &nbsp; &nbsp; <span class="co1">// SC_MAXIMIZE and SC_MINIMIZE</span><br /> &nbsp; &nbsp; &nbsp; &nbsp; <span class="kw1">if</span> <span class="br0">&#40;</span>m<span class="sy0">.</span><span class="me1">WParam</span> <span class="sy0">==</span> <a href="http://www.google.com/search?q=new+msdn.microsoft.com"><span class="kw3">new</span></a> IntPtr<span class="br0">&#40;</span>0xF030<span class="br0">&#41;</span> <span class="sy0">||</span> m<span class="sy0">.</span><span class="me1">WParam</span> <span class="sy0">==</span> <a href="http://www.google.com/search?q=new+msdn.microsoft.com"><span class="kw3">new</span></a> IntPtr<span class="br0">&#40;</span>0xF020<span class="br0">&#41;</span><span class="br0">&#41;</span><br /> &nbsp; &nbsp; &nbsp; &nbsp; <span class="br0">&#123;</span><br /> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <span class="co1">// Event fired! Handle it here</span><br /> &nbsp; &nbsp; &nbsp; &nbsp; <span class="br0">&#125;</span><br /> &nbsp; &nbsp; <span class="br0">&#125;</span><br /> <span class="br0">&#125;</span>
  </div>
</div>