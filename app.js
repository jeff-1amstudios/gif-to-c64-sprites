var Promise = require('bluebird');
var getPixels = Promise.promisify(require("get-pixels"));
var Buffer = require('buffer').Buffer;
var fs = Promise.promisifyAll(require('fs'));
const child_process = require('child_process');
const gifsicle = require('gifsicle');

const SPRITES_X = 1;
const SPRITES_2 = 1;

var outputFile = fs.createWriteStream("output.spr");

var filename = process.argv[2];
console.log('Processing', filename);
child_process.execSync(gifsicle + ' --colors=255 --output /tmp/a.gif ' + filename);
var resizedGifOutput = child_process.execSync(gifsicle + ' --colors=255 --unoptimize --resize 240x210 --output - /tmp/a.gif');
var a = fs.createWriteStream("output.gif");
a.writeAsync(resizedGifOutput);
var frameCount = 0;
getPixels(resizedGifOutput, 'image/gif')
  .then((pixels) => {
    frameCount = pixels.shape[0];
    var fileWrites = [];
    for (var frame = 0; frame < frameCount; frame++) {
      var pxBuffer = new Buffer(64);
      pxBuffer[63] = 0;  //trailing padding byte
      var pxBufferIndex = 0;
      debugger;
      for (var y = 0; y < 21; y++) {
        for (var x = 0; x < 3; x++) {
          var output = 0;
          var shift = 7;
          for (var px = 0; px < 8; px++) {
            var r = pixels.get(frame, x * 8 + px, y, 0);
            var g = pixels.get(frame, x * 8 + px, y, 1);
            var b = pixels.get(frame, x * 8 + px, y, 2);
            var a = pixels.get(frame, x * 8 + px, y, 3);
            if (r != 255 || g != 255 || b != 255) {
              output |= (1 << shift);
              //process.stdout.write('x');
              debugger;
            }
            else {
              //process.stdout.write('.');
            }
            // if (pixels.get(frame, x * 8 + px, y, 3) === 255) {
            //   output |= (1 << shift);
            // }
            shift--;
          }
          pxBuffer[pxBufferIndex++] = output;
        }
      }
      fileWrites.push(outputFile.writeAsync(pxBuffer));
    }
    return Promise.all(fileWrites);
  })
  .then(() => {
    outputFile.close();
    console.log('Finished.', frameCount, 'frames written to output.spr');
  });

