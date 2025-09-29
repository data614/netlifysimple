import { cpSync, mkdirSync, readdirSync, rmSync, statSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const buildDir = join(__dirname, 'build');

rmSync(buildDir, { recursive: true, force: true });
mkdirSync(buildDir, { recursive: true });

const entriesToCopy = ['index.html', 'app.css', 'app.js', 'data', '_redirects'];

for (const entry of entriesToCopy) {
  const sourcePath = join(__dirname, entry);
  try {
    const stats = statSync(sourcePath);
    const destinationPath = join(buildDir, entry);
    if (stats.isDirectory()) {
      cpSync(sourcePath, destinationPath, { recursive: true });
    } else {
      cpSync(sourcePath, destinationPath);
    }
    console.log(`Copied ${entry}`);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.warn(`Warning: ${entry} was not found and was skipped.`);
    } else {
      throw error;
    }
  }
}

const remainingEntries = readdirSync(__dirname, { withFileTypes: true })
  .filter((entry) => !entry.name.startsWith('.') &&
    !entriesToCopy.includes(entry.name) &&
    entry.name !== 'build' &&
    entry.name !== 'node_modules' &&
    entry.isFile())
  .map((entry) => entry.name);

for (const file of remainingEntries) {
  const sourcePath = join(__dirname, file);
  const destinationPath = join(buildDir, file);
  cpSync(sourcePath, destinationPath);
  console.log(`Copied ${file}`);
}

console.log('Build directory prepared at', buildDir);
