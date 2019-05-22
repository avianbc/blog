---
id: 329
title: Simple PHP Image Gallery
date: 2012-08-13T22:14:48-04:00
author: brad
layout: post
guid: http://br4d.net/?p=329
permalink: /simple-php-image-gallery/
categories:
  - PHP
  - Programming
---
This script is a very simplified version of the imagery section of my old website. To use it on your own site, follow these steps:

  1. You need to create a folder containing only the images that you want to display. You need to set the path to the this folder on line #2.
  2. The thumbnails should be stored in a separate folder, which you must specify the path to on line #6. In the code, the tumbnails are stored in a subfolder called &#8220;thumbs&#8221; and the filename of each thumbnail is &#8220;thumb_originalFileName.jpg&#8221;.
  3. On line #6 you need to specify the path to the full images, which is probably the same path that you used on step #1.
  4. If you notice on line #7, each image is displayed inside of a html DIV container that uses the CSS class titled &#8220;gallery&#8221;. I included the CSS that I used in my imagery section in the second code box below. Feel free to customize this CSS to go along with your website&#8217;s layout.

<div class="codecolorer-container php default" style="overflow:auto;white-space:nowrap;">
  <table cellspacing="0" cellpadding="0">
    <tr>
      <td class="line-numbers">
        <div>
          1<br />2<br />3<br />4<br />5<br />6<br />7<br />8<br />9<br />10<br />11<br />
        </div>
      </td>
      
      <td>
        <div class="php codecolorer">
          <span class="kw2"><?php</span><br /> <span class="kw1">foreach</span><span class="br0">&#40;</span><span class="kw2">new</span> DirectoryIterator<span class="br0">&#40;</span><span class="st_h">'/path/to/images'</span><span class="br0">&#41;</span> <span class="kw1">as</span> <span class="re0">$iterator</span><span class="br0">&#41;</span><br /> <span class="br0">&#123;</span><br /> &nbsp; &nbsp; <span class="kw1">if</span><span class="br0">&#40;</span><span class="re0">$iterator</span><span class="sy0">-></span><span class="me1">isFile</span><span class="br0">&#40;</span><span class="br0">&#41;</span><span class="br0">&#41;</span><br /> &nbsp; &nbsp; <span class="br0">&#123;</span><br /> &nbsp; &nbsp; &nbsp; &nbsp; <span class="re0">$thumbPath</span> <span class="sy0">=</span> <span class="st0">"./path/to/thumbs/thumb_"</span> <span class="sy0">.</span> <span class="re0">$iterator</span><span class="sy0">-></span><span class="me1">getFilename</span><span class="br0">&#40;</span><span class="br0">&#41;</span><span class="sy0">;</span><br /> &nbsp; &nbsp; &nbsp; &nbsp; <span class="kw1">echo</span> <span class="st_h">'<a href="./pathto/fullsize/images/'</span> <span class="sy0">.</span> <span class="re0">$iterator</span><span class="sy0">-></span><span class="me1">getFilename</span><span class="br0">&#40;</span><span class="br0">&#41;</span> <span class="sy0">.</span> <span class="st_h">'\ ><div class="gallery"><img src='</span><span class="sy0">;</span><br /> &nbsp; &nbsp; &nbsp; &nbsp; <span class="kw1">echo</span> <span class="re0">$thumbPath</span> <span class="sy0">.</span> <span class="st0">""</span> <span class="sy0">/></span>\n<span class="sy0"><</span>p<span class="sy0">></span><span class="st0">" . <span class="es4">$iterator->getFilename</span>() . "</span><span class="sy0"></</span>p<span class="sy0">></</span>div<span class="sy0">></</span>a<span class="sy0">></span>\n<span class="st0">";<br /> &nbsp; &nbsp; }<br /> }<br /> ?></span>
        </div>
      </td>
    </tr>
  </table>
</div>

Here is the CSS code for the gallery class that I used:

<div class="codecolorer-container css default" style="overflow:auto;white-space:nowrap;">
  <div class="css codecolorer">
    <style type<span class="sy0">=</span><span class="st0">"text/css"</span><span class="sy0">></span><br /> &nbsp; &nbsp; div<span class="re1">.gallery</span> <span class="br0">&#123;</span><br /> &nbsp; &nbsp; &nbsp; <span class="kw1">float</span><span class="sy0">:</span> <span class="kw2">left</span><span class="sy0">;</span><br /> &nbsp; &nbsp; &nbsp; <span class="kw1">width</span><span class="sy0">:</span> <span class="re3">104px</span><span class="sy0">;</span><br /> &nbsp; &nbsp; &nbsp; <span class="kw1">padding</span><span class="sy0">:</span> <span class="re3">5px</span><span class="sy0">;</span><br /> &nbsp; &nbsp; &nbsp; <span class="kw1">margin</span><span class="sy0">:</span> <span class="re3">5px</span><span class="sy0">;</span><br /> &nbsp; &nbsp; &nbsp; <span class="kw1">padding-top</span><span class="sy0">:</span> <span class="re3">5px</span><span class="sy0">;</span><br /> &nbsp; &nbsp; &nbsp; <span class="kw1">border</span><span class="sy0">:</span> <span class="re3">1px</span> <span class="kw2">dashed</span> <span class="re0">#000000</span><span class="sy0">;</span><br /> &nbsp; &nbsp; &nbsp; <span class="kw1">height</span><span class="sy0">:</span> <span class="re3">120px</span><span class="sy0">;</span><br /> &nbsp; &nbsp; <span class="br0">&#125;</span><br /> </style<span class="sy0">></span>
  </div>
</div>