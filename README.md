# Animated GIF to C64 sprite converter

An animated gif is converted to c64 hardware sprite format with these steps
 - Each frame is resized to 24x21 (or 48x42 with the `doubleSize` option)
 - If a pixel is fully white, it is assumed to be the background and is skipped. Any other color means the c64 sprite pixel is set.

### Options:
```
--doubleSize
```
If this is set, we output 4 c64 sprites per frame (top-left, bottom-left, top-right, bottom-right).  The advantage is this gives us more pixels to work with both from the source image and also on the c64 screen.  The downside is (obviously) we have space for far fewer frames of animation.

The output is all frames for the top-right, followed by all frames for the bottom-left, then top-right, then bottom-right.  This makes it easy to step forward frame by frame on the c64 without needing to handle interleaving.

```
--maxFrames
```
By default this is 240.  You may have to reduce this number especially with the doubleSize option to make sure the outputted sprites are not too large.

```
--startFrame
```
By default this is 0. Change this number to start converting frames from a specified point. 


### Usage:
```
node gif-to-sprite.js --doubleSize --maxFrames 200 --startFrame 0 output.spr
```

### Commodore64 example application
In the `c64-sample-app` directory is a simple c64 assembly language program which will render a double-sized sprite.

![](/sample-screenshot.jpg)