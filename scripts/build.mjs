import { mkdir, copyFile, writeFile, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
// Vercel can be configured with either the repository root or `app` as Root Directory.
// Always read source files from the repository, while writing output beside the active package.
const output = resolve(process.cwd(), 'dist');
await mkdir(resolve(output, 'fonts'), { recursive: true });
// Only explicitly public browser assets enter the deployment output.
for (const name of ['app.js', 'ui.css', 'sw.js', 'manifest.webmanifest', 'icon.svg', 'icon.ico', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png']) {
  await copyFile(resolve(root, 'app', name), resolve(output, name));
}
for (const name of ['JetBrainsMono-Regular.ttf', 'JetBrainsMono-Bold.ttf', 'OFL.txt']) {
  await copyFile(resolve(root, 'app/fonts', name), resolve(output, 'fonts', name));
}
const html = await readFile(resolve(root, 'app/clipsync.html'), 'utf8');
await writeFile(resolve(output, 'index.html'), html.replace('<script src="/app.js" defer>', '<script src="/hosting.js"></script>\n<script src="/app.js" defer>'));
await writeFile(resolve(output, 'hosting.js'), 'window.LOOP_HOSTED = true;\n');
await copyFile(resolve(root, 'app/icon.ico'), resolve(output, 'favicon.ico'));
const sw = await readFile(resolve(root, 'app/sw.js'), 'utf8');
await writeFile(resolve(output, 'sw.js'), sw.replace('const ASSETS=[', "const ASSETS=['/hosting.js',"));
console.log('Public browser assets ready in dist/. Private data and Windows files are excluded.');
