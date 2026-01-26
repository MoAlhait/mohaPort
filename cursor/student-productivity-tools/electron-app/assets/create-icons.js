const fs = require('fs');
const path = require('path');

// Simple script to create placeholder icons
// In a real project, you'd use proper icon creation tools

const createPlaceholderIcon = (size, filename) => {
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" rx="${size/4}" fill="url(#grad)"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-family="Arial, sans-serif" font-size="${size/3}" font-weight="bold">FL</text>
    </svg>
  `;
  
  const png = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" rx="${size/4}" fill="url(#grad)"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-family="Arial, sans-serif" font-size="${size/3}" font-weight="bold">FL</text>
    </svg>
  `;
  
  fs.writeFileSync(path.join(__dirname, filename), svg);
  console.log(`Created ${filename}`);
};

// Create placeholder icons
createPlaceholderIcon(16, 'tray-icon.png');
createPlaceholderIcon(32, 'icon-32x32.png');
createPlaceholderIcon(64, 'icon-64x64.png');
createPlaceholderIcon(128, 'icon-128x128.png');
createPlaceholderIcon(256, 'icon-256x256.png');
createPlaceholderIcon(512, 'icon-512x512.png');

// Create icon.ico (Windows) - simplified
const icoContent = `
# This is a placeholder for icon.ico
# In a real project, use a proper icon creation tool
# like ImageMagick or online icon converters
`;
fs.writeFileSync(path.join(__dirname, 'icon.ico'), icoContent);

// Create icon.icns (macOS) - simplified
const icnsContent = `
# This is a placeholder for icon.icns
# In a real project, use iconutil or proper icon creation tools
`;
fs.writeFileSync(path.join(__dirname, 'icon.icns'), icnsContent);

console.log('✅ Placeholder icons created');
console.log('📝 Note: Replace these with proper icons for production');
console.log('🔧 Use tools like ImageMagick, iconutil, or online converters');
