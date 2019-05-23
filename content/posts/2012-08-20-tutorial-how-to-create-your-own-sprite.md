---
id: 131
title: 'Tutorial: How To Create Your Own Sprite'
date: 2012-08-20T15:36:12-04:00
author: brad
layout: post
guid: http://avian.netne.net/blog/?p=131
permalink: /tutorial-how-to-create-your-own-sprite/
categories:
  - Sprite Editor
tags:
  - JSON
  - Sprites
---
While there is some documentation for the *.spr file format, it can be underwhelming and full of technical jargon. This post aims to provide an easy to follow tutorial for the creation your own sprites so together we can populate the sprite network with an even larger amount and variety of random sprites.

<!--more-->

  
**Table Of Contents**

  1. [What is a sprite?](#what)
  2. [The anatomy of a sprite](#anatomy)
  3. [States](#states) 
      * [List of possible states](#statetable)
  4. [Parameters](#params) 
      * [List of possible parameters](#paramtable)
  5. [X and Y values](#xyvalues)
  6. [Cropping and Displaying a Frame](#cropping)
  7. [State Chains](#chains)
  8. [Inheritance](#inheritance)
  9. [Sprite MetaData](#metadata) 
      * [actions](#actions)
      * [flags](#flags)
      * [credits](#credits)
      * [version](#version)
      * [spawn](#spawn)
 10. [Death Animations](#death)
 11. [Using flipX](#flipx)
 12. [Transparency](#transparency)
 13. [Offsets](#offsets)
 14. [Fixtures](#fixtures)
 15. [Sprite Validation](#validation)

* * *

<strong id="what">What is a sprite?</strong>

If you right click your favorite sprite and open it with notepad, you’ll notice it is nothing more than plain text. This text tells the sprite engine how and what to display. When a sprite is opened, this text is read by the sprites engine which is then rendered using the sprites engine according to the file’s contents:

<img class="alignnone size-full wp-image-135" title="chickendotspr" src="/images/2012/08/chickendotspr.png" alt="Chicken.spr" width="778" height="475" srcset="/images/2012/08/chickendotspr.png 778w, /images/2012/08/chickendotspr-300x183.png 300w" sizes="(max-width: 778px) 100vw, 778px" /> 

* * *

<strong id="anatomy">The anatomy of a sprite.</strong>

A quick glance over this file shows its parts: SPRITE\_META\_DATA contains miscellaneous info on the sprite, SPRITE\_STATE\_DEFAULT contains common parts, and it has stand and walk states (for both left and right). Each of these items are formatted in a very specific format (known as JSON) so that the sprites engine can read and render them easily. Basically every itemÂ in the text fileÂ falls into one of these categories: state, parameter, or value.

Even though Sprite Editor manages all of this under-the-hood for you and makes sure that the file is correctly formatted, you should be familiar with the underlying anatomy.

Here is the same sprite from above but showing its parts:

<img class="alignnone size-full wp-image-139" title="spriteskeleton" src="/images/2012/08/spriteskeleton.png" alt="Sprite FIle Format" width="778" height="482" srcset="/images/2012/08/spriteskeleton.png 778w, /images/2012/08/spriteskeleton-300x186.png 300w" sizes="(max-width: 778px) 100vw, 778px" /> 

* * *

<strong id="states">States</strong>

This is the fundamental backbone of the sprites engine. Sprites engine is basically a [Finite State Machine](http://en.wikipedia.org/wiki/Finite-state_machine) (FSM). In simpler words, what it does at that moment depends on the input that you give it. If the sprite is standing there doing nothing, it displays SPRITE\_STAND state. If you hit left arrow key to move him to the left, it displays SPRITE\_STATE_WALK. It chooses which one from the LEFT or RIGHT states depending on which direction the sprite is facing at that time.

There are many more states which are all triggered by various actions performed by the user. Here is a table showing all possible states:

<table id="statetable" width="500" border="1">
  <tr>
    <th scope="col" width="61%">
      STATE
    </th>
    
    <th scope="col" width="39%">
      Trigger Input
    </th>
  </tr>
  
  <tr>
    <td>
      SPRITE_META_DATA
    </td>
    
    <td>
      None
    </td>
  </tr>
  
  <tr>
    <td>
      SPRITE_STATE_DEFAULT
    </td>
    
    <td>
      None
    </td>
  </tr>
  
  <tr>
    <td>
      SPRITE_STATE_STAND_LEFT
    </td>
    
    <td>
      Idle (Facing left)
    </td>
  </tr>
  
  <tr>
    <td>
      SPRITE_STATE_STAND_RIGHT
    </td>
    
    <td>
      Idle (facing right)
    </td>
  </tr>
  
  <tr>
    <td>
      SPRITE_STATE_WALK_LEFT
    </td>
    
    <td>
      Left Arrow Key
    </td>
  </tr>
  
  <tr>
    <td>
      SPRITE_STATE_WALK_RIGHT
    </td>
    
    <td>
      Right Arrow Key
    </td>
  </tr>
  
  <tr>
    <td>
      SPRITE_STATE_JUMP_LEFT
    </td>
    
    <td>
      Space Bar
    </td>
  </tr>
  
  <tr>
    <td>
      SPRITE_STATE_JUMP_RIGHT
    </td>
    
    <td>
      Space Bar
    </td>
  </tr>
  
  <tr>
    <td>
      SPRITE_STATE_DESTROY_LEFT
    </td>
    
    <td>
      Double Click
    </td>
  </tr>
  
  <tr>
    <td>
      SPRITE_STATE_DESTROY_RIGHT
    </td>
    
    <td>
      Double Click
    </td>
  </tr>
  
  <tr>
    <td>
      SPRITE_STATE_RUN_LEFT
    </td>
    
    <td>
      Hold Left Arrow Key
    </td>
  </tr>
  
  <tr>
    <td>
      SPRITE_STATE_RUN RIGHT
    </td>
    
    <td>
      Hold Right Arrow Key
    </td>
  </tr>
  
  <tr>
    <td>
      SPRITE_STATE_FLY_LEFT
    </td>
    
    <td>
      Idle (fly param specified)
    </td>
  </tr>
  
  <tr>
    <td>
      SPRITE_STATE_FLY_RIGHT
    </td>
    
    <td>
      Idle (fly param specified)
    </td>
  </tr>
</table>

All of these states are displayed depending on user input, with a few exceptions. SPRITE\_META\_DATA is special because it holds a basic description of the sprite. It tells who authored the sprite, the actions it is capable of, the flags which modify its behavior, version number, and a spawn parameter which means the sprite can actually spawn other sprites (more on this later).<figure>To add a state in Sprite Editor: Make sure you have created a new file from File > New then right click the name of the file in the tree. Select “Add state” from the context menu and it will list the possible states for you.</figure> 

 

You’ll notice in the above table that FLY left and right states have the fly parameter as their trigger. To use these states you must specify that the sprite is a FLYER by using a parameter in SPRITE\_META\_DATA. More on parameters next.

* * *

<strong id="params">Parameters and Values</strong>

A parameter is basically specifies which part of the sprite you are setting and the value is what you are setting it to. Since parameters are nested within and associated with a particular state, it just tells additional detail about how to render that state.

For example, the walkMultiplier parameter specifies the speed of which the sprite walks. If it is not specified, it walks at the default speed. If you set it to 2, the sprite will walk twice as fast when the user presses the arrow key. In this example, walkMultiplier is the **parameter** and 2 is the **value** of that parameter.<figure>To add a parameter using Sprite Editor: Right click any state on the tree and select Add Parameter. It will list all possible parameters for you to select from.</figure> 

 

Within each state, you will find nothing more than a nest of parameters and their associated values. There are two types of parameters: **attributes** and **properties**.

> SPRITE\_META\_DATA is unique since it only contains unique “attribute” parameters that describe the file such as telling who the author is, the actions the sprite performs, the version number of the sprite, etc. All other “property” parameters are universal and can be used in any valid non-metadata state.

Property parameters must have an attached value and must be found within a valid state from the [table above](#statetable). Here is a complete list of possible params:

<table id="paramtable" width="100%" border="1">
  <tr>
    <th scope="col" width="10%">
      Name
    </th>
    
    <th scope="col" width="3%">
      Type
    </th>
    
    <th scope="col" width="6%">
      Value
    </th>
    
    <th scope="col" width="81%">
      Description
    </th>
  </tr>
  
  <tr>
    <td>
      <a href="#actions">actions</a>
    </td>
    
    <td>
      attribute
    </td>
    
    <td>
      Parameters
    </td>
    
    <td>
      Specifies which actions the sprite has. Valid parameters are walk, fly, run, jump, destroy, or death.
    </td>
  </tr>
  
  <tr>
    <td>
      <a href="#flags">flags</a>
    </td>
    
    <td>
      attribute
    </td>
    
    <td>
      Parameters
    </td>
    
    <td>
      Specifies which flags the sprite has. Valid parameters are isCollector, isItem, disablePhysics, disableWindowCollide, disableSpriteCollide. disableJump. or doFadeOut.
    </td>
  </tr>
  
  <tr>
    <td>
      <a href="#version">version</a>
    </td>
    
    <td>
      attribute
    </td>
    
    <td>
      Integer
    </td>
    
    <td>
      Specifies the version number of the sprite. Used by sprite server to determine if the user has the newest version of a sprite.
    </td>
  </tr>
  
  <tr>
    <td>
      <a href="#credits">credits</a>
    </td>
    
    <td>
      attribute
    </td>
    
    <td>
      Parameters
    </td>
    
    <td>
      Specifies the sprite creator’s details. Valid parameters are author, description, and url.
    </td>
  </tr>
  
  <tr>
    <td>
      <a href="#spawn">spawn</a>
    </td>
    
    <td>
      attribute
    </td>
    
    <td>
      String
    </td>
    
    <td>
      Specifies a *.spr or *.spi file to spawn when the sprite is closed.
    </td>
  </tr>
  
  <tr>
    <td>
      <a href="#fixtures">fixtures</a>
    </td>
    
    <td>
      attribute
    </td>
    
    <td>
      Parameters
    </td>
    
    <td>
      Specifies specific clipping areas. See <a href=”#fixtures”>Fixtures</a> at bottom of page.
    </td>
  </tr>
  
  <tr>
    <td>
      uri
    </td>
    
    <td>
      property
    </td>
    
    <td>
      String
    </td>
    
    <td>
      Similar to URLs that you put into web browser. This specifies a file location. Used mostly to specify the name of the image or sprite sheet that the spr uses. You can just use the filename itself without the path as long as your *.spr file is in the same directory or a subdirectory.
    </td>
  </tr>
  
  <tr>
    <td>
      flipX
    </td>
    
    <td>
      property
    </td>
    
    <td>
      Flag
    </td>
    
    <td>
      If set to 1, the sprite is flipped or mirrored vertically. Useful if you have a LEFT state and want the RIGHT state to mirror that while facing the opposite direction.
    </td>
  </tr>
  
  <tr>
    <td>
      sizeMultiplier
    </td>
    
    <td>
      property
    </td>
    
    <td>
      Integer
    </td>
    
    <td>
      This increases the size of the rendered sprite. If the sprite source sheet or image is way too small, use this to increase the size.
    </td>
  </tr>
  
  <tr>
    <td>
      sizeDivider
    </td>
    
    <td>
      property
    </td>
    
    <td>
      Integer
    </td>
    
    <td>
      This decreases the size of the rendered sprite.
    </td>
  </tr>
  
  <tr>
    <td>
      frameDelay
    </td>
    
    <td>
      property
    </td>
    
    <td>
      Integer
    </td>
    
    <td>
      When a state is animating, there is a delay in milliseconds between each frame. This specifies the amount of time for each frame.
    </td>
  </tr>
  
  <tr>
    <td>
      cropX
    </td>
    
    <td>
      property
    </td>
    
    <td>
      Integer
    </td>
    
    <td>
      Sets the X value of the crop area. See: <a href=”#cropping”>Cropping</a>
    </td>
  </tr>
  
  <tr>
    <td>
      cropY
    </td>
    
    <td>
      property
    </td>
    
    <td>
      Integer
    </td>
    
    <td>
      Sets the Y value of the crop area.
    </td>
  </tr>
  
  <tr>
    <td>
      cropW
    </td>
    
    <td>
      property
    </td>
    
    <td>
      Integer
    </td>
    
    <td>
      Sets the width of the crop area.
    </td>
  </tr>
  
  <tr>
    <td>
      cropH
    </td>
    
    <td>
      property
    </td>
    
    <td>
      Integer
    </td>
    
    <td>
      Sets the height of the crop area.
    </td>
  </tr>
  
  <tr>
    <td>
      offsX
    </td>
    
    <td>
      property
    </td>
    
    <td>
      Integer
    </td>
    
    <td>
      After you select an area of the spritesheet to display, it centers automatically. If one STATE has a larger or smaller size than another it may cause the sprite not to line up correctly. This param is used to offset a frame’s X value so that each state lines up better.
    </td>
  </tr>
  
  <tr>
    <td>
      offsY
    </td>
    
    <td>
      property
    </td>
    
    <td>
      Integer
    </td>
    
    <td>
      Offsets the Y value, similar to above.
    </td>
  </tr>
  
  <tr>
    <td>
      isChain
    </td>
    
    <td>
      property
    </td>
    
    <td>
      Flag
    </td>
    
    <td>
      If set, it specifies that there are multiple frames to display in the current state (animation).
    </td>
  </tr>
  
  <tr>
    <td>
      usePrevious
    </td>
    
    <td>
      property
    </td>
    
    <td>
      Flag
    </td>
    
    <td>
      If on, this uses the values from the previous animation state.
    </td>
  </tr>
  
  <tr>
    <td>
      autoClose
    </td>
    
    <td>
      property
    </td>
    
    <td>
      Flag
    </td>
    
    <td>
      When this is on, it causes the sprite to close.
    </td>
  </tr>
  
  <tr>
    <td>
      transparent
    </td>
    
    <td>
      property
    </td>
    
    <td>
      String
    </td>
    
    <td>
      If the sprite sheet does not have a transparent background, you use this parameter to specify the color to make transparent. It is a HTML HEX color code.
    </td>
  </tr>
  
  <tr>
    <td>
      walkMultiplier
    </td>
    
    <td>
      property
    </td>
    
    <td>
      Integer
    </td>
    
    <td>
      Amount to speed up the walking of a sprite.
    </td>
  </tr>
</table>

> Notice each parameter has a specific type of value that it takes. If it takes **parameters**, it is a special case and is only used in Metadata (check the description). If it takes **integers**, it must be a valid numeric input. Others take **strings** such as file names and HTML hex codes. Finally, there is **flags**. Flags take the value either zero or one. 1 means the flag is on, 0 means it is off (which is the default).

* * *

<strong id="xyvalues">X and Y values</strong>

A quick tangent onÂ _co-ordinate systems_:

These should sound familiar from your high school algebra classes since everyone has studied the [Cartesian coordinate system](http://en.wikipedia.org/wiki/Cartesian_coordinate_system)Â that uses the (x,y) ordered pairs format to depict locations on a plane:

<img class="alignnone size-full wp-image-157" title="cartesian" src="/images/2012/08/cartesian.png" alt="" width="289" height="212" /> 

In the above diagram: up is +Y, down is -Y, right is +X, and left and -X. Windows uses a modified version of this. Basically the Y axis is flipped: up is -Y, down is +Y, right is +X, left is -X. Here is a diagram to further illustrate this:

<img title="coordinates" src="/images/2012/08/coordinates.png" alt="" width="208" height="175" /> 

> All sprites and all windows applications use these coordinates so make sure you are using correct Y values! The origin (0,0)Â is always at the top left cornerÂ of a sprite or window.Â Sprite EditorÂ does handle coordinates for you under-the-hoodÂ if you use it to Crop or Grab Y values.<figure>To grab coordinates using Sprite Editor: Right click on the parameter you wish to set and in the context menu select “Set Value To” > Image X/Y Value. Once you do this, click the desired location on the image and Sprite Editor will set the parameter to the correct X/Y value for you.</figure> 

 

* * *

<strong id="cropping">Cropping and Displaying a Frame</strong>

Now to illustrate the concept of how the sprite engineÂ chooses what to display, lets look at a sprite submitted by IceAge: [Bald Bull from Punch Out](http://sprites.caustik.com/topic/405-bald-bull-punchout-arcade-version/)! Here is the source sprite sheet that he used:

<img class="alignnone size-full wp-image-160" title="Bald_Bull_Idle" src="/images/2012/08/Bald_Bull_Idle.png" alt="" width="496" height="127" srcset="/images/2012/08/Bald_Bull_Idle.png 496w, /images/2012/08/Bald_Bull_Idle-300x77.png 300w" sizes="(max-width: 496px) 100vw, 496px" /> 

Now look at this section of Bald Bull.spr:

<div class="codecolorer-container text default" style="overflow:auto;white-space:nowrap;">
  <div class="text codecolorer">
    "SPRITE_STATE_DEFAULT": {<br /> "uri":"Bald_Bull_Idle.png",<br /> "cropX":"0",<br /> "cropY":"0",<br /> "cropW":"62",<br /> "cropH":"140"<br /> }
  </div>
</div>

This tells the sprite engine that the image to crop from (uri)Â is “Bald\_Bull\_idle.png”. To crop the image, it provides X, Y, W, and H values. This is the X, Y, Width, and Height of a rectangular area of the sprite sheet to select, crop, and display. The units are in pixels, which just represents one small colored dot on the monitor. If you open the above sprite sheet in Windows Paint and zoom in as far as possible you will see this:

<img class="alignnone size-full wp-image-166" title="baldbullpixels" src="/images/2012/08/baldbullpixels.png" alt="" width="343" height="282" srcset="/images/2012/08/baldbullpixels.png 343w, /images/2012/08/baldbullpixels-300x247.png 300w" sizes="(max-width: 343px) 100vw, 343px" /> 

Each one of those squares is 1 pixel. Also notice that when you move your cursor over the image it will tell you the coordinates on the bottom left corner in MS Paint.

So the above code is saying to crop at X,Y values of (0,0) with a width of 62 pixelsÂ and a height of 140 pixels. This is the result (in the red rectangle) of what is cropped and displayed:

<img class="alignnone size-full wp-image-167" title="Bald_Bull_Cropped" src="/images/2012/08/Bald_Bull_Cropped.png" alt="" width="496" height="127" srcset="/images/2012/08/Bald_Bull_Cropped.png 496w, /images/2012/08/Bald_Bull_Cropped-300x77.png 300w" sizes="(max-width: 496px) 100vw, 496px" /> 

The top left corner of the rectangleÂ isÂ (0,0), theÂ top right corner is (62,0), the bottom left corner is (0,140) and the bottom right corner is (62,140). So when SPRITE\_STATE\_DEFAULT is the current state, this is what is displayed to the user!<figure>To easily set the cropX/Y/W/H params using Sprite Editor: select any valid non-metadata state in the tree and click and drag on the image. The black rectangle that appears is the crop area and Sprite Editor will automatically set the cropX/Y/W/H values for you in the state you selected. This functionality is called Quick Crop.</figure> 

 

* * *

<strong id="chains">State Chains</strong>

So now you know how to display an image for any given state, from SPRITE\_STATE\_STAND_LEFT to any other one you wish. The problem? You are only specifying one crop area per state so the sprite will not appear to animate and will just stay in this one frame that you have specified using cropX/Y/W/H values. If you need to display more than one frame in a specific state, you will have to use chains.

**Chains** are a simple concept. You just tell the sprite engine that it is a chain, then number each state incrementally. Look at this code from Bald Bull.spr:

<div class="codecolorer-container text default">
  <div class="text codecolorer">
    "SPRITE_STATE_STAND_RIGHT": {<br /> "isChain":"1",<br /> "cropX":"0",<br /> "cropY":"0",<br /> "cropW":"62",<br /> "cropH":"140"<br /> },<br /> "SPRITE_STATE_STAND_RIGHT_0": {<br /> "cropX":"63"<br /> },<br /> "SPRITE_STATE_STAND_RIGHT_1": {<br /> "cropX":"125"<br /> },<br /> "SPRITE_STATE_STAND_RIGHT_2": {<br /> "cropX":"187"<br /> },<br /> "SPRITE_STATE_STAND_RIGHT_3": {<br /> "cropX":"249"<br /> },<br /> "SPRITE_STATE_STAND_RIGHT_4": {<br /> "cropX":"311"<br /> }
  </div>
</div>

As you seen in the previous section, this is telling the sprite engine that when bald bull is in his SPRITE\_STATE\_STAND_RIGHT state to crop the rectangular area x=0, y=0, width=62, and height=142. This is the same area that was highlighted in the picture from the previous section, shown by the red rectangle!

What is new here is the “**isChain”: “1”** and the numbered states. You have to tell the sprites engine that you need to display multiple frames for a state by setting isChain: 1, then you enumerate the states. By enumerating the states, I mean:

The 1st frame that is displayed is specified in SPRITE\_STATE\_STAND\_RIGHT\_0, the 2nd is SPRITE\_STATE\_STAND\_RIGHT\_1, the 3rd is SPRITE\_STATE\_STAND\_RIGHT\_2, and so on. So the above code provides an animation of 5 frames when bald bull is facing his right side, all displaying different rectangular areas of the source sprite sheet.

<img title="baldbullchain" src="/images/2012/08/baldbullchain.png" alt="" width="496" height="127" /> 

> Note that chains start with STATE\_NAME\_0 instead of STATE\_NAME\_1!<figure>Sprite Editor assists in chain creation. If you right click any valid non-metadata state in the tree and select Add State > Increment State Chain, Sprite Editor will automatically set isChain: 1 in the state root as well as provide the next incremented state for you to edit or add parameters to.</figure> 

<strong id="gifs">Animated GIFs</strong>

 

Cropping can be a time consuming process, even if you use the sprite editor’s quick crop or X/Y grabbing capabilities. If you want to save time, just use **animated gifs**! Each frame of an animated gif will automatically be rendered as if it were a chain. All you have to do is provide the URI (filename) of each gif file for each state and there is no need to worry about X and Y values.

* * *

<strong id="inheritance">Inheritance</strong>

Inheritance can be overwhelming at first but at its core it is a very simple concept and allows you to save time when creating sprites. Notice how the STATE\_NAME\_0, 1, 2, 3, and 4 above did not specify cropY,W,H values? They were unnecessary because of inheritance.

If you specify a parameter in any SPRITE\_STATE\_* such as SPRITE\_STATE\_STAND\_RIGHT, then each of the followingÂ chains (SPRITE\_STATE\_STAND\_RIGHT\_0, SPRITE\_STATE\_STAND\_RIGHT\_1, etc.) will also have the same parameter set to the same exact value unless you specify otherwise. In this example, SPRITE\_STATE\_STAND\_RIGHT is the **parent** state and SPRITE\_STATE\_STAND\_RIGHT\_0 is the **child** state.

The only thing that changed was the X value in each frame since the Y was always 0, width was always 62, and the height was always 140. So the sprite engine knew that SPRITE\_STATE\_STAND\_RIGHT\_0 would have the values of “cropY”:”0″, “cropW”:”62″, “cropH”:”140″.

So the example from above that introduced chains effectively functions the exact same as this, thanks to inheritance:

<div class="codecolorer-container text default">
  <div class="text codecolorer">
    "SPRITE_STATE_STAND_RIGHT": {<br /> "isChain":"1",<br /> "cropX":"0",<br /> "cropY":"0",<br /> "cropW":"62",<br /> "cropH":"140"<br /> },<br /> "SPRITE_STATE_STAND_RIGHT_0": {<br /> "cropX":"63",<br /> "cropY":"0",<br /> "cropW":"62",<br /> "cropH":"140"<br /> },<br /> "SPRITE_STATE_STAND_RIGHT_1": {<br /> "cropX":"125",<br /> "cropY":"0",<br /> "cropW":"62",<br /> "cropH":"140"<br /> },<br /> "SPRITE_STATE_STAND_RIGHT_2": {<br /> "cropX":"187",<br /> "cropY":"0",<br /> "cropW":"62",<br /> "cropH":"140"<br /> },<br /> "SPRITE_STATE_STAND_RIGHT_3": {<br /> "cropX":"249",<br /> "cropY":"0",<br /> "cropW":"62",<br /> "cropH":"140"<br /> },<br /> "SPRITE_STATE_STAND_RIGHT_4": {<br /> "cropX":"311",<br /> "cropY":"0",<br /> "cropW":"62",<br /> "cropH":"140"<br /> }
  </div>
</div>

**Important**: SPRITE\_STATE\_DEFAULT is the parent of all other states. Any parameter that you specify in DEFAULT will propogate down to all other STATES through inheritance, unless you specify otherwise. This is why we can specify the uri of the image in DEFAULT and not have to worry about adding it to each other state.

Here is a diagram showing the heirarchy. Note that SPRITE\_STATE\_* means any state:

<img class="alignnone size-full wp-image-220" title="inheritance" src="/images/2012/08/inheritance.png" alt="" width="888" height="96" srcset="/images/2012/08/inheritance.png 888w, /images/2012/08/inheritance-300x32.png 300w" sizes="(max-width: 888px) 100vw, 888px" /> 

* * *

<strong id="metadata">SPRITE_META_DATA</strong>

As mentioned in the states section, metadata is unique in that it describes the file itself. It is the first thing looked at by the sprite engine. As such, it has special “metadata” parameters and values that are attached to it: actions, flags, credits, version, spawn, fixtures.

<strong id="actions">actions</strong> specify to the sprite engine what the sprite is capable of doing. For each item listed in this list of actions, there will be a corresponding state. Here is a table summarizing each action and what STATE the action indicates to the sprite engine:

<table id="actiontable" width="100%" border="1">
  <tr>
    <th>
      Metadata action
    </th>
    
    <th>
      Indicates
    </th>
  </tr>
  
  <tr>
    <td>
      walk
    </td>
    
    <td>
      SPRITE_STATE_WALK_LEFT and SPRITE_STATE_WALK_RIGHT
    </td>
  </tr>
  
  <tr>
    <td>
      run
    </td>
    
    <td>
      SPRITE_STATE_RUN_LEFT and SPRITE_STATE_RUN_RIGHT
    </td>
  </tr>
  
  <tr>
    <td>
      fly
    </td>
    
    <td>
      SPRITE_STATE_FLY_LEFT and SPRITE_STATE_FLY_RIGHT
    </td>
  </tr>
  
  <tr>
    <td>
      jump
    </td>
    
    <td>
      SPRITE_STATE_JUMP_LEFT and SPRITE_STATE_JUMP_RIGHT
    </td>
  </tr>
  
  <tr>
    <td>
      death
    </td>
    
    <td>
      Sprite will have a corresponding Death animation.
    </td>
  </tr>
  
  <tr>
    <td>
      destroy
    </td>
    
    <td>
      SPRITE_STATE_DESTROY and SPRITE_STATE_DESTROY_RIGHT
    </td>
  </tr>
</table><figure>Sprite Editor helps editing Metadata actions. Right click SPRITE\_META\_DATA in the tree and Add Paramater “actions” if it is not already present. When you right click actions, the Add New Action submenu will contain a comprehensive list of all actions for you to add.</figure> 

 

<strong id="flags">flags</strong> turn on special behaviors for the sprite. Here is a list of all supported flags:

<table id="flagtable" width="100%" border="1">
  <tr>
    <th>
      Flag
    </th>
    
    <th>
      Description
    </th>
  </tr>
  
  <tr>
    <td>
      isCollector
    </td>
    
    <td>
      Indicates the sprite can pick up items in the form of other sprites.
    </td>
  </tr>
  
  <tr>
    <td>
      isItem
    </td>
    
    <td>
      Indicates the sprite is collectable by isCollector sprites. Used for sprites such as coins and items.
    </td>
  </tr>
  
  <tr>
    <td>
      disablePhysics
    </td>
    
    <td>
      Disables the sprites physics engine for this sprite.
    </td>
  </tr>
  
  <tr>
    <td>
      disableWindowCollide
    </td>
    
    <td>
      Diables the sprite from colliding with any windows.
    </td>
  </tr>
  
  <tr>
    <td>
      disableSpriteCollide
    </td>
    
    <td>
      Disables the sprite from colliding with other sprites. Useful for props and scenery such as trees.
    </td>
  </tr>
  
  <tr>
    <td>
      disableJump
    </td>
    
    <td>
      Denies the sprite the ability to jump. Added specifically for zombie sprite so he doesnt go crazy when auto-move is turned on.
    </td>
  </tr>
  
  <tr>
    <td>
      doFadeOut
    </td>
    
    <td>
      This enables the default sprite death animation, which is just a slow fade out.
    </td>
  </tr>
</table><figure>Sprite Editor also helps editing and adding flags to Metadata. If the flags parameter is not present in Metadata, right click SPRITE\_META\_DATA and Add Parameter > flags. Once added, you can right click flags in the tree and select Add Flag and it will show a list of all valid flags.</figure> 

<strong id="credits">credits</strong>provides the sprite engine with details fo the personwho created that sprite. If you right click a sprite, you can see these. Note that a sprite can have many sets of credits, each with an author, description, and url. Here is a list of parameters:

 

<table id="creditstable" width="100%" border="1">
  <tr>
    <th>
      Parameter
    </th>
    
    <th>
      Description
    </th>
  </tr>
  
  <tr>
    <td>
      author
    </td>
    
    <td>
      Name of the person who crated the sprite.
    </td>
  </tr>
  
  <tr>
    <td>
      description
    </td>
    
    <td>
      Text to display on right click.
    </td>
  </tr>
  
  <tr>
    <td>
      url
    </td>
    
    <td>
      URL of author’s website which launches when right click menu is selected.
    </td>
  </tr>
</table><figure>SPRITE\_META\_DATA, SPRITE\_STATE\_DEFAULT, credits, and version are automatically added to new files in Sprite Editor. To add more than one set of credits, right click the [1] in the tree under credits and select “Add New Group”.</figure> 

<strong id="version">version</strong>stores an integer value indicating if how new the sprite is. If a submitted sprite has an error, it can be revised with a higher verison number and the sprites engine will make sure everyone’s local copy will get properly updated.

 

<strong id="spawn">spawn</strong> is used to spawn other sprites upon death. This is useful for creation of death animations, which conventially are stored in a seperate file. See [Sprite Death Animations](#death).

**fixtures** help with overly large sprite clipping areas. See [fixtures](#fixtures).

* * *

<strong id="death">Sprite Death Animations</strong>

As of now there are two methods for creating sprite death animations:

  1. You can use SPRITE\_STATE\_DESTROY_\* state and the destroy attribute to create the animation within the existing \*.spr file.
  2. You can use a seperate *.spi file and the spawn attribute to encapsulate the death animation in a seperate file.

For 1, look at Taz.spr by IceAge as an example. He included “death” as an action in metadata and then provided the correspondign DESTROY states and uses an animated gif for them:

<div class="codecolorer-container text default" style="overflow:auto;white-space:nowrap;">
  <div class="text codecolorer">
    "SPRITE_STATE_DESTROY_LEFT" :<br /> {<br />   "uri": "Taz_Death.gif"<br /> },<br /> "SPRITE_STATE_DESTROY_RIGHT" :<br /> {<br />   "uri": "Taz_Death.gif"<br /> }
  </div>
</div>

Here is what it looks like when he dies (without the loop, of course):<img src="/images/2012/08/Taz_Death.gif" alt="" title="Taz_Death" width="63" height="71" class="alignnone size-full wp-image-231" /> 

For 2, look at Jason.spr by caustik as an example. In the metadata, he included a “death” action and a “spawn” attribute:

<div class="codecolorer-container text default" style="overflow:auto;white-space:nowrap;">
  <div class="text codecolorer">
    "spawn" :<br /> [<br /> {<br />   "uri": "Jason (Death).spi",<br />   "spawnX": "0",<br />   "spawnY": "0"<br /> }<br /> ]
  </div>
</div>

When the sprite is destroyed, it spawns an external file “Jason (Death).spi” which then handles the death animation. here is that file:

<div class="codecolorer-container text default">
  <div class="text codecolorer">
    {<br /> "SPRITE_META_DATA" :<br /> {<br />   "credits" :<br /> [<br />   {<br />     "author": "Caustik",<br />     "description": "Scripted by Caustik (caustik.com)",<br />     "url": "http://www.caustik.com/"<br />   }<br /> ]<br /> },<br />   "SPRITE_STATE_DEFAULT" :<br /> {<br />   "uri": "jasonsophia.png",<br />   "sizeMultiplier": "2",<br />   "frameDelay": "200",<br />   "cropX": "325", "cropY" : "129", "cropW" : "16", "cropH" : "16",<br />   "transparent": "0088FF",<br />   "autoClose": "1",<br />   "isChain": "1"<br /> },<br />   "SPRITE_STATE_DEFAULT_0" : { "cropX": "205" },<br />   "SPRITE_STATE_DEFAULT_1" : { "cropX": "285", "cropY": "128" },<br />   "SPRITE_STATE_DEFAULT_2" : { "cropX": "325", "cropY": "124" }<br /> }
  </div>
</div>

> *.spi files are traditioanlly used to encapsulate death animations, but this is not necessary since you can just use DESTROY states instead. Also notice caustik uses “autoClose: 1” to make sure the sprite closes after the death animation is complete instead of looping indefinitely.<figure>External files such as image URIs and *.spi death animations will show up in Sprite Editor after loaded under the Menu item “View” > “Dependencies”. You can click any of them to open them up in the editor.</figure> 

 

* * *

<strong id="flipx">Using flipX for easy Left and Right states</strong>

The flipX parameter can be used to save time when creating sprites. All it does is flip the X coordinates of the image, effectively mirroring or flipping the image vertically.

This is useful if you have a STATE\_*\_RIGHT and need to create an appropriate LEFT state as well. All you have to do is use the same exact parameters from the RIGHT state and include flipX: 1 to create a mirrored version.<figure>In Sprite Editor, adding flipX to a state is as easy as Right Clicking the state in the tree and going to Add Parameter > flipX.</figure> 

* * *

<strong id="transparency">Transparency</strong>

Also, if a sprite sheet does not have a **transparent** or colorless background then it will be shown when you load your sprite up making it look ugly. This is what the “transparent” parameter is for. if you look at Bald Bull’s spr file text contents once again, you’ll notice thatÂ itÂ has “transparent”:”<span style="color: #baefca;">bafeca</span>” in his SPRITE\_STATE\_DEFAULT section. The BAFECA is just a [HTML hex color code](http://www.w3schools.com/html/html_colors.asp).

> The way you count in HEX is 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, A, B, C, D, E, F. Hex is base-16 while our number system is only base-10, so the letters (A to F) indicate the extra digits (10 to 16). The color code’s first two digits are RED, second two are GREEN, last two and BLUE. 0 is darkest and F is the lightest. So FFFFFF would be white. 000000 is black. <span style="color: #ff0000;">FF0000</span> is pure red. <span style="color: #00ff00;">00FF00</span> is pure green. <span style="color: #0000ff;">0000FF</span> is pure blue.

You do not have to fret over learning HTML hex color codes. Sprite Editor makes it easy!<figure>Right Click SPRITE\_STATE\_DEFAULT in the tree and Add Parameter > transparent. After it is added, right click “transparent” and Set Value To > Image Color Code. Click somewhere in the image that has the background color you wish to make transparent and Sprite Editor grabs the HEX value for you and automatically sets it to the newly added transparent param.</figure> 

* * *

<strong id="offsets">Offsets</strong>

If you crop areas of different widths or heights, the sprite engineÂ may not properly align them since it does a best guess and centers the frames. Maybe the third frame is too far to the left and it looks weird, or the last frame is up too high. You can fix this using the offsX and offsY parameters.

The offsX parameterÂ specifies an offset value in the X direction of the current frame. If the misaligned frame is to the left or right, use this to correct it. The units for thisÂ are in pixels. Similarly, offsY is for the Y value and can correct frames that are displayed too high or too low.<figure>In Sprite Editor, go to Tools > Sprite Preview and it will show you a preview of how your states will line up. Use this to help set offsX and offsY values.</figure> 

* * *

<strong id="fixtures">Fixtures</strong>

Fixtures are a hack for sprite clipping areas. Basically, it allows you to combine seperate areas fo a sprite sheet into one frame. The way you do this is by specifying X, Y, W, and H values for each crop area within the fixtures array.

These are useful if your sprite has large empty or transparentÂ area surrounding it but it still collides with other sprites, without appearing to actually touch them.

* * *

<strong id="validation">Sprite Validation</strong>

Sprite Editor has validation built in to help you make sure the structure of your creation is perfect. It will display a red X on the bottom right corner if there is an error, or a green checkmark if all is good. Here is a list of all that is checked for:

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
      * Checks if param is listed without a corresponding value.
      * Checks if param is blank or whitepsace.
  4. Other 
      * Array indices must be in the form [n] and have appropriate subnodes.
      * Chains must have isChain:1 set.
      * Checks if isChain:1 is set and there is no subsequent incremented state.
      * Chain numbers must be sequential.<figure>Sprite Validator can bea useful tool in debugging your sprite. Give it a try before submitting it! Note that all params and states are case sensitive.</figure> 

 