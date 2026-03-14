const fs = require('fs');
const path = require('path');

function processDir(dir) {
    if (dir.includes('node_modules')) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (file.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('import ') || content.includes('export ')) {
                // replace 'import X from "Y"'
                content = content.replace(/import\s+([a-zA-Z0-9_]+)\s+from\s+['"]([^'"]+)['"];?/g, 'const $1 = require("$2");');
                // replace 'import { X, Y } from "Z"'
                content = content.replace(/import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"];?/g, 'const {$1} = require("$2");');
                // replace 'export const funcName =' -> 'exports.funcName ='
                content = content.replace(/export\s+const\s+([a-zA-Z0-9_]+)\s*=/g, 'exports.$1 =');
                // replace 'export default X;' -> 'module.exports = X;'
                content = content.replace(/export\s+default\s+([a-zA-Z0-9_]+);?/g, 'module.exports = $1;');
                
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Patched ${fullPath}`);
            }
        }
    }
}

processDir(__dirname);
console.log('done');
