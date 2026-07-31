import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('../dist/', import.meta.url)));
const host = process.env.E2E_HOST ?? '127.0.0.1';
const port = Number(process.env.PORT ?? 3000);
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
};

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0] || '/');
  const candidate = normalize(join(root, decoded));
  return candidate.startsWith(root) ? candidate : join(root, 'index.html');
}

function resolveRequestPath(urlPath) {
  const candidate = safePath(urlPath);
  if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  if (!extname(candidate)) return join(root, 'index.html');
  return null;
}

const server = createServer((request, response) => {
  try {
    const filePath = resolveRequestPath(request.url ?? '/');
    if (!filePath) {
      response.writeHead(404);
      response.end('Not found');
      return;
    }
    response.writeHead(200, {
      'Cache-Control': 'no-store',
      'Content-Type': contentTypes[extname(filePath)] ?? 'application/octet-stream',
    });
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(400);
    response.end('Bad request');
  }
});

server.listen(port, host, () => {
  process.stdout.write(`static preview listening on http://${host}:${port}\n`);
});
