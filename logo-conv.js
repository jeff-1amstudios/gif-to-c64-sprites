var Promise = require('bluebird');
var getPixels = Promise.promisify(require("get-pixels"));
var Buffer = require('buffer').Buffer;
var fs = require('fs');

var fs = require('fs');
var outputFile = fs.createWriteStream("../c64-app/resources/logo.bin");

var files = process.argv[2].split(',');

Promise.each(files, (f) => {
  console.log('Processing', f);

  var pxBuffer = new Buffer(40 * 25);
  var pxBufferIndex = 0;

  return getPixels(f)
    .then((pixels) => {
      for (var y = 0; y < 25; y++) {
        for (var x = 0; x < 40; x++) {
          var index = ((y * 40 * 4) + x * 4);
          console.log(pixels.data[index], pixels.data[index+1],
            pixels.data[index+2], pixels.data[index+3]);
          if (pixels.data[index+3] !== 0) {
            pxBuffer[pxBufferIndex++] = 0xDE;
          }
          else {
            pxBuffer[pxBufferIndex++] = 0x20;
          }
        }
        pxBuffer[pxBufferIndex++] = 10;
      }
      outputFile.write(pxBuffer);
    });
})
  .then(() => {
    outputFile.close();
    console.log('Sprites written to output.spr');
  });
 
