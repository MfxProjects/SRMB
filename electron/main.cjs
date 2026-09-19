const { app, BrowserWindow, ipcMain, protocol } = require('electron');
const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');

const appRoot = path.join(__dirname, '..');
const distRoot = path.join(appRoot, 'dist');
const isKiosk = process.env.SRMB_KIOSK === '1';

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'srmb',
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
    },
  },
]);

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.ppt': 'application/vnd.ms-powerpoint',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
};

ipcMain.handle('srmb:exit-app', () => {
  app.quit();
  return true;
});

function resolveAppPath(url) {
  const parsedUrl = new URL(url);
  const decodedPath = decodeURIComponent(parsedUrl.pathname);
  const requestPath = decodedPath === '/' ? '/index.html' : decodedPath;
  const normalizedPath = path.normalize(requestPath).replace(/^([/\\])+/, '');
  const filePath = path.join(distRoot, normalizedPath);

  if (!filePath.startsWith(distRoot)) {
    return path.join(distRoot, 'index.html');
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return filePath;
  }

  return path.join(distRoot, 'index.html');
},,,,,,,,,                                          .

function createWindow() {
  const win = new BrowserWindow({
    width: 1366,
    height: 768,
    minWidth: 1024,
    minHeight: 640,
    title: 'SRMB',
    backgroundColor: '#1d2535',
    autoHideMenuBar: true,
    kiosk: isKiosk,
    fullscreen: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      preload: path.join(__dirname, 'preload.cjs'),
    },
  });

  // Toggle fullscreen with F11 (kiosk-friendly).
  win.webContents.on('before-input-event', (event, input) => {
    if (input.type === 'keyDown' && input.key === 'F11') {
      event.preventDefault();
      win.setFullScreen(!win.isFullScreen());
    }
  });

  win.loadURL('srmb://app/index.html');
}

app.whenReady().then(() => {
  protocol.handle('srmb', async (request) => {
    const filePath = resolveAppPath(request.url);
    const extension = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[extension] || 'application/octet-stream';

    // Video playback requires byte-range support.
    if (extension === '.mp4') {
      const stat = await fs.promises.stat(filePath);
      const size = stat.size;
      const rangeHeader = request.headers.get('range');

      if (!rangeHeader) {
        const stream = fs.createReadStream(filePath);
        return new Response(Readable.toWeb(stream), {
          headers: {
            'content-type': contentType,
            'content-length': String(size),
            'accept-ranges': 'bytes',
          },
        });
      }

      const match = /^bytes=(\d+)-(\d*)$/i.exec(rangeHeader);
      if (!match) {
        return new Response(null, {
          status: 416,
          headers: {
            'content-range': `bytes */${size}`,
          },
        });
      }

      const start = Number(match[1]);
      const end = match[2] ? Math.min(Number(match[2]), size - 1) : size - 1;

      if (Number.isNaN(start) || Number.isNaN(end) || start > end || start >= size) {
        return new Response(null, {
          status: 416,
          headers: {
            'content-range': `bytes */${size}`,
          },
        });
      }

      const chunkSize = end - start + 1;
      const stream = fs.createReadStream(filePath, { start, end });

      return new Response(Readable.toWeb(stream), {
        status: 206,
        headers: {
          'content-type': contentType,
          'content-length': String(chunkSize),
          'content-range': `bytes ${start}-${end}/${size}`,
          'accept-ranges': 'bytes',
        },
      });
    }

    const data = await fs.promises.readFile(filePath);
    return new Response(data, {
      headers: {
        'content-type': contentType,
      },
    });
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
