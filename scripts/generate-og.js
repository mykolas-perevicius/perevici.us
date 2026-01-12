#!/usr/bin/env node

const fs = require('fs');
const zlib = require('zlib');

const width = 1200;
const height = 630;

const background = [11, 18, 17];
const accent = [51, 214, 200];
const primary = [255, 138, 61];

const bytesPerPixel = 4;
const stride = width * bytesPerPixel + 1;
const buffer = Buffer.alloc(stride * height);

function lerp(a, b, t) {
    return Math.round(a + (b - a) * t);
}

function blend(c1, c2, t) {
    return [
        lerp(c1[0], c2[0], t),
        lerp(c1[1], c2[1], t),
        lerp(c1[2], c2[2], t)
    ];
}

for (let y = 0; y < height; y++) {
    const rowStart = y * stride;
    buffer[rowStart] = 0;
    for (let x = 0; x < width; x++) {
        const nx = x / (width - 1);
        const ny = y / (height - 1);
        const baseMix = Math.min(1, nx * 0.65 + ny * 0.35);
        const glowMix = Math.max(0, 1 - Math.hypot(nx - 0.75, ny - 0.25) * 1.2);
        const warmMix = Math.max(0, 1 - Math.hypot(nx - 0.2, ny - 0.8) * 1.35);

        let color = blend(background, accent, baseMix * 0.65);
        const glow = blend(color, accent, glowMix * 0.6);
        const warm = blend(glow, primary, warmMix * 0.55);

        const index = rowStart + 1 + x * bytesPerPixel;
        buffer[index] = warm[0];
        buffer[index + 1] = warm[1];
        buffer[index + 2] = warm[2];
        buffer[index + 3] = 255;
    }
}

function crc32(buf) {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
        crc ^= buf[i];
        for (let j = 0; j < 8; j++) {
            const mask = -(crc & 1);
            crc = (crc >>> 1) ^ (0xedb88320 & mask);
        }
    }
    return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type);
    const crcBuf = Buffer.concat([typeBuf, data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(crcBuf), 0);
    return Buffer.concat([length, typeBuf, data, crc]);
}

const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(width, 0);
ihdr.writeUInt32BE(height, 4);
ihdr[8] = 8;
ihdr[9] = 6;
ihdr[10] = 0;
ihdr[11] = 0;
ihdr[12] = 0;

const compressed = zlib.deflateSync(buffer, { level: 9 });

const png = Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0))
]);

fs.writeFileSync('og-image.png', png);
console.log('Generated og-image.png');
