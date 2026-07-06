const fs = require('fs');
const path = require('path');

// All directories to process
const directories = [
  path.join(__dirname, 'src/components/home'),
  path.join(__dirname, 'src/components/shared'),
  path.join(__dirname, 'src/app/propertydetails'),
];

// Replacement map
const replacements = [
  { from: /bg-\[#099880\]/g, to: 'bg-[var(--background)]' },
  { from: /bg-\[#066e5b\]/g, to: 'bg-[var(--card)]' },
  { from: /bg-\[#055a4b\]/g, to: 'bg-[var(--secondary)]' },
  { from: /text-\[#cddfa0\]/g, to: 'text-[var(--accent)]' },
  { from: /text-\[#0f172a\]/g, to: 'text-[var(--foreground)]' },
  { from: /text-\[#64748b\]/g, to: 'text-[var(--muted-foreground)]' },
  { from: /bg-\[#cddfa0\]/g, to: 'bg-[var(--primary)]' },
  { from: /bg-\[#081d19\]/g, to: 'bg-[var(--card)]' },
  { from: /bg-\[#061510\]/g, to: 'bg-[var(--background)]' },
  { from: /bg-\[#0b1f1a\]/g, to: 'bg-[var(--card)]' },
  { from: /border-\[#099880\]/g, to: 'border-[var(--primary)]' },
  { from: /border-\[#cddfa0\]/g, to: 'border-[var(--accent)]' },
  { from: /text-\[#066e5b\]/g, to: 'text-[var(--card-foreground)]' },
];

// Process each file
function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      processFile(filePath);
    }
  });
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  replacements.forEach(({ from, to }) => {
    if (from.test(content)) {
      content = content.replace(from, to);
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated: ${filePath}`);
  }
}

// Run
console.log('🔄 Starting to update files with CSS variables...');
directories.forEach(processDirectory);
console.log('✅ Done! All files updated.');
