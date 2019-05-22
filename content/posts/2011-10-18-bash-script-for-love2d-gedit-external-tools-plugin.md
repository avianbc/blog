---
id: 336
title: BASH script for LOVE2D + Gedit External Tools Plugin
date: 2011-10-18T22:19:28-04:00
author: brad
layout: post
guid: http://br4d.net/?p=336
permalink: /bash-script-for-love2d-gedit-external-tools-plugin/
categories:
  - Programming
---
Due to a severe lack of good IDEs for Lua, I have resorted to using [gedit](http://projects.gnome.org/gedit/ "gEdit"). The External Tools plug-in greatly extends the functionality of gedit by giving the user the ability to run scripts from the press a keyboard shortcut. Go to Tools > External Tools and add a new shortcut. Make sure to set the hotkey of your choice and then enter this script into the edit box on the top right:

<div class="codecolorer-container bash default" style="overflow:auto;white-space:nowrap;">
  <div class="bash codecolorer">
    <span class="co0">#!/bin/sh</span><br /> <span class="kw1">if</span> <span class="br0">&#91;</span> <span class="re5">-f</span> <span class="re1">$GEDIT_CURRENT_DOCUMENT_DIR</span><span class="sy0">/</span>main.lua <span class="br0">&#93;</span><br /> <span class="kw1">then</span><br /> love <span class="re1">$GEDIT_CURRENT_DOCUMENT_DIR</span><br /> <span class="kw1">else</span><br /> <span class="kw3">echo</span> <span class="st0">"Error! main.lua not found!"</span><br /> <span class="kw1">fi</span>
  </div>
</div>