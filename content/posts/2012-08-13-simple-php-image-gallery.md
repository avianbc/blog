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
  2. The thumbnails should be stored in a separate folder, which you must specify the path to on line #6. In the code, the tumbnails are stored in a subfolder called “thumbs” and the filename of each thumbnail is “thumb_originalFileName.jpg”.
  3. On line #6 you need to specify the path to the full images, which is probably the same path that you used on step #1.
  4. If you notice on line #7, each image is displayed inside of a html DIV container that uses the CSS class titled “gallery”. I included the CSS that I used in my imagery section in the second code box below. Feel free to customize this CSS to go along with your website’s layout.

{{< highlight php >}}
<?php
foreach(new DirectoryIterator('/path/to/images') as $iterator)
{
    if($iterator->isFile())
    {
        $thumbPath = "./path/to/thumbs/thumb_" . $iterator->getFilename();
        echo '<a href="./pathto/fullsize/images/' . $iterator->getFilename() . '\ ><div class="gallery"><img src=';
        echo $thumbPath . "" />\n<p>" . $iterator->getFilename() . "</p></div></a>\n";
    }
}
?>
{{< /highlight >}}

Here is the CSS code for the gallery class that I used:

{{< highlight css >}}
<style type="text/css">
    div.gallery {
      float: left;
      width: 104px;
      padding: 5px;
      margin: 5px;
      padding-top: 5px;
      border: 1px dashed #000000;
      height: 120px;
    }
</style>
{{< /highlight >}}
