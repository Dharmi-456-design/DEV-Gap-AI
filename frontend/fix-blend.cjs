const fs = require('fs');
const path = require('path');

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        let fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walkDir(fullPath));
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            results.push(fullPath);
        }
    });
    return results;
}

const files = walkDir('./src');
files.forEach(file => {
   let content = fs.readFileSync(file, 'utf8');
   let original = content;

   let tmp = content;
   tmp = tmp.replace(/mix-blend-screen/g, 'mix-blend-multiply');

   if(tmp !== original) {
       fs.writeFileSync(file, tmp, 'utf8');
       console.log('Fixed mix-blend:', file);
   }
});
