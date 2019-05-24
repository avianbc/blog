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

{{< highlight bash >}}
#!/bin/sh
if [ -f $GEDIT_CURRENT_DOCUMENT_DIR/main.lua ]
then
love $GEDIT_CURRENT_DOCUMENT_DIR
else
echo "Error! main.lua not found!"
fi
{{< /highlight >}}
