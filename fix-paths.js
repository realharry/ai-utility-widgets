import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fix paths in HTML files for Chrome extension
const fixPaths = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace ../assets/ with ./assets/
  content = content.replace(/\.\.\/assets\//g, './assets/');
  
  fs.writeFileSync(filePath, content);
  console.log(`Fixed paths in ${filePath}`);
};

// Fix both HTML files
fixPaths(path.join(__dirname, 'dist', 'sidepanel.html'));
fixPaths(path.join(__dirname, 'dist', 'options.html'));

console.log('Path fixing complete!');