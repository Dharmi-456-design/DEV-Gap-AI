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

   // COMPONENT CLASSES
   tmp = tmp.replace(/corporate-card-hover/g, 'neon-glass-card-hover');
   tmp = tmp.replace(/corporate-card/g, 'neon-glass-card');
   tmp = tmp.replace(/input-corp/g, 'input-dark');
   tmp = tmp.replace(/mix-blend-multiply/g, 'mix-blend-screen');

   // TEXT
   tmp = tmp.replace(/text-slate-900/g, 'TMP_TXT_WHITE');
   tmp = tmp.replace(/text-slate-800/g, 'TMP_TXT_200');
   tmp = tmp.replace(/text-slate-700/g, 'TMP_TXT_300');
   tmp = tmp.replace(/text-slate-500/g, 'TMP_TXT_400');
   tmp = tmp.replace(/text-slate-400/g, 'TMP_TXT_500');

   // BGs
   tmp = tmp.replace(/bg-slate-50/g, 'TMP_BG_900_60');
   tmp = tmp.replace(/bg-white/g, 'TMP_BG_900_40');
   tmp = tmp.replace(/bg-slate-100/g, 'TMP_BG_W5');
   tmp = tmp.replace(/bg-slate-200/g, 'TMP_BG_W10');

   // BORDERS
   tmp = tmp.replace(/border-slate-200/g, 'border-white/10');
   tmp = tmp.replace(/border-slate-100/g, 'border-white/5');

   // RE-MAP
   tmp = tmp.replace(/TMP_TXT_WHITE/g, 'text-white');
   tmp = tmp.replace(/TMP_TXT_200/g, 'text-slate-200');
   tmp = tmp.replace(/TMP_TXT_300/g, 'text-slate-300');
   tmp = tmp.replace(/TMP_TXT_400/g, 'text-slate-400');
   tmp = tmp.replace(/TMP_TXT_500/g, 'text-slate-500');

   tmp = tmp.replace(/TMP_BG_900_60/g, 'bg-slate-900/60');
   tmp = tmp.replace(/TMP_BG_900_40/g, 'bg-slate-900/40');
   tmp = tmp.replace(/TMP_BG_W5/g, 'bg-white/5');
   tmp = tmp.replace(/TMP_BG_W10/g, 'bg-white/10');

   // Edge cases for hover states where bg-white gets tricky
   tmp = tmp.replace(/hover:bg-slate-900\/40/g, 'hover:bg-slate-800');
   
   if(tmp !== original) {
       fs.writeFileSync(file, tmp, 'utf8');
       console.log('Restored to dark:', file);
   }
});
