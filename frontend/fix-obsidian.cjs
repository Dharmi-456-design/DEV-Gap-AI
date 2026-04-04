const fs = require('fs');

const replaceInFile = (file) => {
    let code = fs.readFileSync(file, 'utf8');
    
    code = code.replace(/bg-obsidian-(\d+)/g, 'bg-slate-$1');
    code = code.replace(/text-obsidian-(\d+)/g, 'text-slate-$1');
    code = code.replace(/text-gold-500/g, 'text-primary-500');
    code = code.replace(/text-gold-400/g, 'text-primary-400');
    code = code.replace(/text-gold-300/g, 'text-primary-300');
    code = code.replace(/border-gold-/g, 'border-primary-');
    code = code.replace(/from-gold-500 to-orange-500/g, 'from-primary-600 to-secondary-500');
    code = code.replace(/bg-gold-/g, 'bg-primary-');
    code = code.replace(/hover:text-gold-/g, 'hover:text-primary-');
    code = code.replace(/shadow-gold-/g, 'shadow-primary-');
    code = code.replace(/glass-card/g, 'neon-glass-card');
    code = code.replace(/label-gold/g, 'label-primary');
    code = code.replace(/glow-gold/g, 'glow-primary');
    code = code.replace(/btn-gold/g, 'btn-primary');
    code = code.replace(/animated-border/g, 'neon-glass-card');
    code = code.replace(/gradient-text/g, 'glow-text text-white/90');

    fs.writeFileSync(file, code);
};

['src/pages/DashboardPage.jsx', 'src/components/Layout.jsx'].forEach(replaceInFile);
console.log('Restored the original UI components into the Cyberpunk/NASA Theme!');
