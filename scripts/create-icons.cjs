const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Create public folder
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate valid uncompressed PNG buffer using standard PNG chunk structure
function createSolidPng(width, height, r, g, b) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8-bit depth
  ihdrData[9] = 2; // Truecolor (RGB)
  ihdrData[10] = 0; // Deflate
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // Interlace
  const ihdr = makeChunk('IHDR', ihdrData);

  // Raw image data: filter byte (0) + width * 3 bytes per scanline
  const scanlineLength = 1 + width * 3;
  const rawData = Buffer.alloc(scanlineLength * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineLength;
    rawData[rowOffset] = 0; // No filter

    // Draw solid color with a lighter inner emblem area
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 3;
      
      // Decorative border or center emblem
      const isBorder = x < 8 || x >= width - 8 || y < 8 || y >= height - 8;
      const isCenter = Math.abs(x - width / 2) < width / 5 && Math.abs(y - height / 2) < height / 5;

      if (isCenter) {
        rawData[pixelOffset] = 255; // White letter/emblem
        rawData[pixelOffset + 1] = 255;
        rawData[pixelOffset + 2] = 255;
      } else if (isBorder) {
        rawData[pixelOffset] = 180; // Gold/light border
        rawData[pixelOffset + 1] = 140;
        rawData[pixelOffset + 2] = 50;
      } else {
        rawData[pixelOffset] = r; // Maroon #800000
        rawData[pixelOffset + 1] = g;
        rawData[pixelOffset + 2] = b;
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idat = makeChunk('IDAT', compressedData);
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

function makeChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);

  const typeBuffer = Buffer.from(type, 'ascii');
  const body = Buffer.concat([typeBuffer, data]);

  const crc = crc32(body);
  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc, 0);

  return Buffer.concat([length, body, crcBuffer]);
}

// Simple CRC32 for PNG chunks
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = c ^ buf[i];
    for (let j = 0; j < 8; j++) {
      c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

// Generate PWA icons (Maroon #800000 = 128, 0, 0)
const icon192 = createSolidPng(192, 192, 128, 0, 0);
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), icon192);

const icon512 = createSolidPng(512, 512, 128, 0, 0);
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), icon512);

const appleIcon = createSolidPng(180, 180, 128, 0, 0);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleIcon);

console.log('Successfully generated PWA and Apple Touch icons in /public');
