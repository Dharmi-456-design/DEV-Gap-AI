const fs = require('fs');
const path = require('path');

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walkDir(file));
        } else if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.css')) {
            results.push(file);
        }
    });
    return results;
}

const files = walkDir('./src');
files.forEach(file => {
   let content = fs.readFileSync(file, 'utf8');
   let original = content;
   content = content.replace(/gold-([0-9]+)/g, 'primary-$1');
   content = content.replace(/orange-([0-9]+)/g, 'secondary-$1');
   content = content.replace(/obsidian-([0-9]+)/g, 'slate-$1');
   content = content.replace(/btn-gold/g, 'btn-primary');
   content = content.replace(/label-gold/g, 'label-primary');
   content = content.replace(/glow-gold/g, 'glow-primary');
   
   if(content !== original) {
       fs.writeFileSync(file, content, 'utf8');
       console.log('Updated:', file);
   }
});
