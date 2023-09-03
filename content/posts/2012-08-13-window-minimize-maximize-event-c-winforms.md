---
id: 69
title: 'Window Minimize / Maximize Event (C# winforms)'
date: 2012-08-13T09:58:34-04:00
author: brad
layout: post
permalink: /window-minimize-maximize-event-c-winforms/
categories:
  - Programming
tags:
  - C#
  - .NET
  - Windows Forms
  - Win32 API
  - P/Invoke
---
If you are working in C# winforms and need to respond to window minimize and maximize events, it seems that winforms does not provide native event handlers. Such a feat is still very much possible through hooking into the Windows API.

The exact message you need to catch is [WM_SYSCOMMAND](http://msdn.microsoft.com/en-us/library/windows/desktop/ms646360(v=vs.85).aspx) and look for the SC_* messages:

  * SC_CLOSE 0xF060
  * SC_MAXIMIZE 0xF030
  * SC_MINIMIZE 0xF020
  * SC_RESTORE 0xF120

There are indeed more messages. Check the above link for a full list. Now for some sample code:

{{< highlight csharp >}}
protected override void WndProc(ref Message m)
{
    base.WndProc(ref m);
    if (m.Msg == 0x0112) // WM_SYSCOMMAND
    {
        // SC_MAXIMIZE and SC_MINIMIZE
        if (m.WParam == new IntPtr(0xF030) || m.WParam == new IntPtr(0xF020))
        {
            // Event fired! Handle it here
        }
    }
}
{{< /highlight >}}
