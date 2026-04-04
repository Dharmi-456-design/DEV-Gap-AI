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
   // BG
   tmp = tmp.replace(/bg-slate-900\/[0-9]+/g, 'TMP_BG_WHITE');
   tmp = tmp.replace(/bg-slate-800\/[0-9]+/g, 'TMP_BG_50');
   tmp = tmp.replace(/bg-slate-700\/[0-9]+/g, 'TMP_BG_100');

   tmp = tmp.replace(/bg-slate-900/g, 'TMP_BG_50');
   tmp = tmp.replace(/bg-slate-800/g, 'TMP_BG_WHITE');
   tmp = tmp.replace(/bg-slate-700/g, 'TMP_BG_100');
   tmp = tmp.replace(/bg-slate-600/g, 'TMP_BG_200');

   // TEXT
   tmp = tmp.replace(/text-slate-100/g, 'TMP_TXT_900');
   tmp = tmp.replace(/text-slate-200/g, 'TMP_TXT_800');
   tmp = tmp.replace(/text-slate-300/g, 'TMP_TXT_700');
   tmp = tmp.replace(/text-slate-400/g, 'TMP_TXT_500');
   tmp = tmp.replace(/text-slate-500/g, 'TMP_TXT_400');
   tmp = tmp.replace(/text-white/g, 'TMP_TXT_900');

   // BORDERS
   tmp = tmp.replace(/border-white\/10/g, 'border-slate-200');
   tmp = tmp.replace(/border-white\/5/g, 'border-slate-100');

   // COMPONENTS
   tmp = tmp.replace(/glass-card-hover/g, 'corporate-card-hover');
   tmp = tmp.replace(/glass-card/g, 'corporate-card');
   tmp = tmp.replace(/input-dark/g, 'input-corp');

   // RE-MAP
   tmp = tmp.replace(/TMP_BG_50/g, 'bg-slate-50');
   tmp = tmp.replace(/TMP_BG_WHITE/g, 'bg-white');
   tmp = tmp.replace(/TMP_BG_100/g, 'bg-slate-100');
   tmp = tmp.replace(/TMP_BG_200/g, 'bg-slate-200');

   tmp = tmp.replace(/TMP_TXT_900/g, 'text-slate-900');
   tmp = tmp.replace(/TMP_TXT_800/g, 'text-slate-800');
   tmp = tmp.replace(/TMP_TXT_700/g, 'text-slate-700');
   tmp = tmp.replace(/TMP_TXT_500/g, 'text-slate-500');
   tmp = tmp.replace(/TMP_TXT_400/g, 'text-slate-400');

   if(tmp !== original) {
       fs.writeFileSync(file, tmp, 'utf8');
       console.log('Updated:', file);
   }
});
