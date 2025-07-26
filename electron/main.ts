import { app, BrowserWindow, desktopCapturer, ipcMain, screen, NativeImage, globalShortcut } from 'electron'
import { fileURLToPath } from 'node:url'
import { Jimp } from 'jimp';
import path from 'node:path'
import fs from 'node:fs';
import os from 'node:os';

const isTestMode = import.meta.env.VITE_TEST_MODE === '1';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RENDERER_DIST = path.join(__dirname, '..', 'dist');

let mainWin: BrowserWindow | null;
let translateWin: BrowserWindow | null;
let captureShortcut: string | undefined = undefined;

const createWindow = () => {
  mainWin = new BrowserWindow({
    alwaysOnTop: true,
    hasShadow: false,
    width: 450,
    height: 550,
    minWidth: 450,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
  })

  if (isTestMode) {
    mainWin.webContents.openDevTools({mode: 'undocked'});
  }
  // win.loadFile(path.join(RENDERER_DIST, 'index.html')) // вернуть вместо loadURL когда придумаю решение лучше
  mainWin.loadURL(path.join(RENDERER_DIST, 'index.html#main'))
};

const createTranslateWindow = () => {
  translateWin = new BrowserWindow({
    alwaysOnTop: true,
    hasShadow: false,
    opacity: 1,
    minHeight: 100,
    minWidth: 300,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    transparent: true,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
  });

  // translateWin.loadFile(path.join(RENDERER_DIST, 'index.html')) // вернуть вместо loadURL когда придумаю решение лучше
  translateWin.loadURL(path.join(RENDERER_DIST, 'index.html#translator'));
};

ipcMain.handle('take-screenshot', async () => {
  if (!translateWin) return null;
  try {
    const area = translateWin.getBounds();
    area.y = area.y + 32;
    area.height = area.height - 38;
    area.x = area.x + 4;
    area.width = area.width - 8;
    const display = screen.getDisplayNearestPoint({x: area.x, y: area.y});
    const sources = await desktopCapturer.getSources({
        types: ['screen'],
        thumbnailSize: { width: display.bounds.width, height: display.bounds.height } 
    });
    const source = sources.find(s => s.display_id === String(display.id));

    if (!source) throw new Error("Cant find source");

    const screenshotImage: NativeImage = source.thumbnail;
    const fullScreenshotBuffer = screenshotImage.toPNG();

    const sharpenKernel = [
      [-1, -1, -1],
      [-1,  9, -1],
      [-1, -1, -1]
    ];

    const jimp = await Jimp.read(fullScreenshotBuffer);
    const croppedImage = jimp
      .crop({ x: area.x, y: area.y, w: area.width, h: area.height } )
      .scale(2)
      .greyscale()
      .brightness(0.8)
      .blur(1)
      .convolution(sharpenKernel)
      .threshold({ max: 200, autoGreyscale: false });

    let needInvert = false;
    let blackPixels = 0;
    let whitePixels = 0;
    croppedImage.scan(0, 0, croppedImage.bitmap.width, croppedImage.bitmap.height, (_x, _y, idx) => {
      if (croppedImage.bitmap.data[idx + 0] < 128) {
        blackPixels++;
      } else {
        whitePixels++;
      }

      if (blackPixels > whitePixels) needInvert = true;
    });

    if (needInvert) croppedImage.invert();
  
    const croppedImageBuffer = await croppedImage.getBuffer('image/png');

    if (isTestMode) {
      const dir = path.join(os.homedir(), 'Documents', 'tempScreen');
      const screenshotPath = path.join(dir, `screenshot-${Date.now()}.png`);
      fs.writeFileSync(screenshotPath, croppedImageBuffer);
      console.log('Save path:', screenshotPath);
    }

    return croppedImageBuffer;

  } catch (e) {
    console.error('Screen capture failed:', e);
    return null;
  }
});

ipcMain.handle('globalShortcut-unregister', () => {
  if (captureShortcut) {
    globalShortcut.unregister(captureShortcut);
    captureShortcut = undefined;
  }
});

ipcMain.handle('globalShortcut-register', (_, shortcut: string) => {
  if (captureShortcut) {
    globalShortcut.unregister(captureShortcut);
  }

  const ret = globalShortcut.register(shortcut, () => {
    if (mainWin) {
      mainWin.webContents.send('global-shortcut-pressed', shortcut);
    }
  });

  if (!ret) {
    console.error('Registration failed');
  } else {
    captureShortcut = shortcut;
  }
});

ipcMain.on('window-close', () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) win.close();
});

ipcMain.on('window-minimize', () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) win.minimize();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    mainWin = null;
    translateWin = null;
    if (captureShortcut) {
      globalShortcut.unregister(captureShortcut);
      captureShortcut = undefined;
    }
  }
});

app.whenReady().then(createWindow).then(createTranslateWindow);
