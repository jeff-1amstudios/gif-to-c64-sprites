var Promise = require('bluebird');
var getPixels = Promise.promisify(require("get-pixels"));
var Buffer = require('buffer').Buffer;
var fs = Promise.promisifyAll(require('fs'));
const child_process = require('child_process');
const gifsicle = require('gifsicle');

const SPRITE_HEIGHT = 21;
const SPRITE_WIDTH_BYTES = 3;

const SPRITES_PER_FRAME = 2;

var xOffset = 0;
var yOffset = 0;
/*
upper-left for all frames
upper-right for all frames
lower-left for all frames
lower-right for all frames
[0][1]
[2][3]

*/

var outputFile = fs.createWriteStream("output.spr");

var filename = process.argv[2];
console.log('Processing', filename);
child_process.execSync(gifsicle + ' --colors=255 --output /tmp/a.gif ' + filename);
var resizedGifOutput = child_process.execSync(gifsicle + ' --colors=255 --unoptimize --resize 48x42 --output - /tmp/a.gif');
var a = fs.createWriteStream("output.gif");
a.writeAsync(resizedGifOutput);
var frameCount = 0;
getPixels(resizedGifOutput, 'image/gif')
  .then((pixels) => {
    frameCount = pixels.shape[0];
    if (frameCount > 60) frameCount = 60;
    var startFrame = 0;
    var fileWrites = [];
    for (var frame = 0; frame < frameCount; frame++) {
      var pxBuffer = convertFrameToC64Sprite(pixels, startFrame + frame, 0, 0);
      fileWrites.push(outputFile.writeAsync(pxBuffer));
    }
    for (var frame = 0; frame < frameCount; frame++) {
      var pxBuffer = convertFrameToC64Sprite(pixels, startFrame + frame, 0, 21);
      fileWrites.push(outputFile.writeAsync(pxBuffer));
    }
    for (var frame = 0; frame < frameCount; frame++) {
      var pxBuffer = convertFrameToC64Sprite(pixels, startFrame + frame, 3, 0);
      fileWrites.push(outputFile.writeAsync(pxBuffer));
    }
    for (var frame = 0; frame < frameCount; frame++) {
      var pxBuffer = convertFrameToC64Sprite(pixels, startFrame + frame, 3, 21);
      fileWrites.push(outputFile.writeAsync(pxBuffer));
    }
    return Promise.all(fileWrites);
  })
  .then(() => {
    outputFile.close();
    console.log('Finished.', frameCount, 'frames written to output.spr');
  });


// converts a portion of an image into a hardware sprite data (3 bytes per row, 21 rows)
function convertFrameToC64Sprite(pixels, frame, xOffset, yOffset) {
  var pxBuffer = new Buffer(64);
  pxBuffer[63] = 0;  //trailing padding byte

  var pxBufferIndex = 0;
  for (var y = yOffset; y < yOffset + SPRITE_HEIGHT; y++) {
    for (var x = xOffset; x < xOffset + SPRITE_WIDTH_BYTES; x++) {
      var output = 0;
      var shift = 7;
      for (var px = 0; px < 8; px++) {
        var r = pixels.get(frame, x * 8 + px, y, 0);
        var g = pixels.get(frame, x * 8 + px, y, 1);
        var b = pixels.get(frame, x * 8 + px, y, 2);
        var a = pixels.get(frame, x * 8 + px, y, 3);
        if (r != 255 || g != 255 || b != 255) {
          output |= (1 << shift);
        }
        shift--;
      }
      pxBuffer[pxBufferIndex++] = output;
    }
  }
  return pxBuffer;
}
