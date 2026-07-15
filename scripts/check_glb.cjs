const fs = require('fs');

const file = fs.readFileSync('public/games/ragdoll3d/assets/models/Ragdoll_3D.glb');
// Read chunk 0 length (bytes 12-15)
const chunkLength = file.readUInt32LE(12);
// JSON starts at byte 20
const jsonBuffer = file.slice(20, 20 + chunkLength);
const jsonString = jsonBuffer.toString('utf8');
const data = JSON.parse(jsonString);

if (data.animations) {
    console.log("Found animations:", data.animations.map(a => a.name));
} else {
    console.log("No animations found in JSON chunk.");
}
