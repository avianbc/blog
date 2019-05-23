---
id: 64
title: Sprite Editor FAQ / User Guide
date: 2012-08-09T14:55:50-04:00
author: brad
layout: post
guid: http://avian.netne.net/blog/?p=64
permalink: /sprite-editor-faq-user-guide/
categories:
  - Sprite Editor
tags:
  - Sprites
---
Sprite Editor Frequently Asked Questions and User Guide Â» Here you will find a list of common questions and concerns regarding [sprite editor](http://avian.netne.net/index.php?p=programming&pid=7 "Sprite Editor").

<!--more-->

  * <div>
      <div>
        What are the requirements to run Sprite Editor?
      </div>
    </div>
    
      * <div>
          <div>
            .NET 4 Client Profile (<a href="http://www.microsoft.com/en-us/download/details.aspx?id=17113">http://www.microsoft.com/en-us/download/details.aspx?id=17113</a>)
          </div>
        </div>
    
      * <div>
          <div>
            Newtonsoft.Json.dll (Compact version, Included in zip)
          </div>
        </div>
    
      * <div>
          <div>
            Gif.Components.dll (Included in zip)
          </div>
        </div>

  * <div>
      Where are all the options?
    </div>
    
      * <div>
          Try right clicking the sprite tree to find all the goodies.
        </div>
    
      * <div>
          The context menus are different depending upon what is selected.
        </div>

  * <div>
      Where can I find detailed documentation on the *.sprÂ file format?
    </div>
    
      * <div>
          <a href="http://sprites.caustik.com/topic/356-how-to-create-your-own-spr-files/">http://sprites.caustik.com/topic/356-how-to-create-your-own-spr-files/</a>
        </div>

  * <div>
      How do I perform a Quick Crop?
    </div>
    
      1. <div>
          Select a Valid State.
        </div>
    
      2. <div>
          Click and drag on the displayedÂ image / sprite sheetÂ to select a rectangular area.
        </div>
    
      3. <div>
          cropX, cropY, cropW, and cropH values are automatically set from your selection.
        </div>

  * <div>
      Where are the application settings stored on my PC?
    </div>
    
      * <div>
          They are stored in %AppData%LocalSpriteEditor
        </div>
    
      * <div>
          This folder is normally located in C:UsersYourUserNameAppDataLocalSpriteEditor
        </div>

  * <div>
      Is there any other shortcuts for setting parameter values?
    </div>
    
      * Right click a Parameter andÂ go to “Set Current Value To”. Here you are given a few options: 
          1. X or Y value. Useful for cropX,Y.
          2. Image color code. Useful for capturing the background color of a sprite sheet for transparency.
          3. Use Current Image Filename. Useful for easily setting URI parameter to currently displayed image’s filename.
  * <div>
      What does “Add Next Chain” do?
    </div>
    
      * <div>
          Check outÂ the *.spr file format documentation for more details on how chains work.
        </div>
    
      * For example, if you select SPRITE\_STATE\_WALK\_LEFT\_0 and click Add next Chain, it will add SPRITE\_STATE\_WALK\_LEFT\_1 for you.
      * If isChain: 1 is not set in the root parameter, it will automagically be set for you.
  * <div>
      Why can’t MegaMan.spr shoot Chicken.spr?
    </div>
    
      * <div>
          Because caustik sucks.
        </div>

  * <div>
      What are “Dependencies”?
    </div>
    
      * <div>
          Any references to external files from inside of a *.spr are listed under Dependencies. These usually include images and *.spi spawn/death animations.
        </div>

  * <div>
      Why is there a Green Checkmark / Red X on the bottom right corner?
    </div>
    
      * <div>
          Any time a change is made, the Validator automatically runs. If you get a Checkmark, all is fine. A red X means there is an error.
        </div>

  * <div>
      How do I submit my character for usage on the sprite network?
    </div>
    
      * <div>
          <a href="http://sprites.caustik.com/topic/226-how-to-submit-your-own-characters/">http://sprites.caustik.com/topic/226-how-to-submit-your-own-characters/</a>
        </div>
    
      * <div>
          Make sure your sprite validates before submitting or else it will not be accepted!
        </div>

  * <div>
      I crashed the program or got some unexpected behavior!
    </div>
    
      * <div>
          Please e-mail me, report the problem on the google code issue tracker, or post a forum thread on the sprites.caustik.com website and I will fix it for you!
        </div>

  * What all does the error checking look for? 
      1. States 
          * Must be in all caps
          * SPRITE\_META\_DATA and SPRITE\_STATE\_DEFAULT are required.
          * Must be a known state name, matched from a list of possible states.
      2. Parameters 
          * Must be a known parameter, action, or flag name.
      3. Values 
          * Flags must be 0 or 1.
          * URIs must contain a valid filename.
          * HTML Hex color codes must be six digits.
          * Integers must be a parseable number.
          * Doubles must also parse.
          * URLs must be valid links.
          * Checks ifÂ param is listed without a corresponding value.
          * Checks if param isÂ blank or whitepsace.
      4. Other 
          * Array indices must be in the form [n] and have appropriate subnodes.
          * Chains must have isChain:1 set.
          * Checks if isChain:1 is set and there is no subsequent incremented state.
          * Chain numbers must be sequential.