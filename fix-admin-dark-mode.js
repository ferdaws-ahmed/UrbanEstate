const fs = require('fs');
const path = require('path');

const directory = path.join(__dirname, 'src', 'components', 'dashboard', 'admin');

function replaceInDirectory(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  files.forEach(file => {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      replaceInDirectory(fullPath);
    } else if (file.name.endsWith('.jsx') || file.name.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Replace all hardcoded dark mode colors
      let newContent = content
        .replace(/#066e5b/g, 'var(--card)')
        .replace(/#1a4a40/g, 'var(--card)')
        .replace(/#133c34/g, 'var(--card)')
        .replace(/#091a16/g, 'var(--background)')
        .replace(/#099880/g, 'var(--primary)');
      
      if (newContent !== content) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log(`Fixed: ${fullPath}`);
      }
    }
  });
}

replaceInDirectory(directory);
console.log('All admin dashboard dark mode issues fixed!');
