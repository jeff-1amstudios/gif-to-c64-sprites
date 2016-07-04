const Promise = require('bluebird');
const getPixels = Promise.promisify(require("get-pixels"));
const Buffer = require('buffer').Buffer;
const fs = Promise.promisifyAll(require('fs'));
const child_process = require('child_process');
const gifsicle = require('gifsicle');
const util = require('util');
const argv = require('minimist')(process.argv.slice(2), {
  default: {
    doubleSize: false,
    maxFrames: 240,
    startFrame: 0,
    output: 'output.spr'
  },
  boolean: [ 'doubleSize' ] 
});

const SPRITE_HEIGHT = 21;
const SPRITE_WIDTH_BYTES = 3;
const SPRITES_PER_FRAME = 2;

/*
Generates a sprite data stream for each frame of animated gif
*/

var fileName = argv._[0];

var outputFile = fs.createWriteStream(argv.output);

console.log('Processing', fileName);
child_process.execSync(gifsicle + ' --colors=255 --output /tmp/a.gif ' + fileName);
var gifsicleCmd = util.format('%s --unoptimize --resize %s --output - /tmp/a.gif',
    gifsicle,
    argv.doubleSize ? '48x42' : '24x21');
var resizedGifOutput = child_process.execSync(gifsicleCmd);
var fileWrites = [];
getPixels(resizedGifOutput, 'image/gif')
  .then((pixels) => {
    frameCount = pixels.shape[0];
    if (frameCount > argv.maxFrames) frameCount = argv.maxFrames;
    
    for (var frame = 0; frame < frameCount; frame++) {
      var pxBuffer = convertFrameToC64Sprite(pixels, argv.startFrame + frame, 0, 0);
      fileWrites.push(outputFile.writeAsync(pxBuffer));
    }
    if (argv.doubleSize) {
      for (var frame = 0; frame < frameCount; frame++) {
        var pxBuffer = convertFrameToC64Sprite(pixels, argv.startFrame + frame, 0, 21);
        fileWrites.push(outputFile.writeAsync(pxBuffer));
      }
      for (var frame = 0; frame < frameCount; frame++) {
        var pxBuffer = convertFrameToC64Sprite(pixels, argv.startFrame + frame, 3, 0);
        fileWrites.push(outputFile.writeAsync(pxBuffer));
      }
      for (var frame = 0; frame < frameCount; frame++) {
        var pxBuffer = convertFrameToC64Sprite(pixels, argv.startFrame + frame, 3, 21);
        fileWrites.push(outputFile.writeAsync(pxBuffer));
      }
    }
    return Promise.all(fileWrites);
  })
  .then(() => {
    outputFile.close();
    console.log('Finished.', frameCount, 'frames (' + fileWrites.length + ' sprites) written to ', argv.output);
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
