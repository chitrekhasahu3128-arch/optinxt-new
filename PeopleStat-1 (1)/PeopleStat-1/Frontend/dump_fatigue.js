const fs = require('fs');
const lines = fs.readFileSync('src/pages/Fatigue.jsx', 'utf8').split('\n');
for(let i=0; i<lines.length; i++) {
    console.log((i+1) + ': ' + lines[i]);
}
