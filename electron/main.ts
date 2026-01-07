import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  app,
  BrowserWindow,
  desktopCapturer,
  globalShortcut,
  ipcMain,
  screen,
} from "electron";
import { Jimp } from "jimp";

interface AppConfig {
  DEEPL_API_KEY: string;
  SOURCE_LANG: string | null;
  TARGET_LANG: string | null;
  HOTKEY: string | null;
  TEXT_SIZE: number | null;
  CAPTURE_AREA: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RENDERER_DIST = path.join(__dirname, "..", "dist");

let mainWin: BrowserWindow | null;
let captureWin: BrowserWindow | null;
let captureHotkey: string | null;
let captureArea: {
  x: number;
  y: number;
  width: number;
  height: number;
} | null = null;

const getConfigPath = () => {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, "config.json");
  }

  return path.join(__dirname, "config.json");
};

const updateConfig = (patch: Partial<AppConfig>) => {
  const configPath = getConfigPath();

  try {
    const raw = fs.readFileSync(configPath, "utf8");
    const config = JSON.parse(raw) as AppConfig;
    const nextConfig = { ...config, ...patch };
    fs.writeFileSync(configPath, JSON.stringify(nextConfig, null, 2), "utf8");
    return nextConfig;
  } catch (e) {
    console.error("Failed to update config:", e);
    return null;
  }
};

const handleRegisterShortcut = (hotkey: string) => {
  globalShortcut.register(hotkey, () => {
    if (mainWin) {
      mainWin.webContents.send("global-shortcut-pressed", hotkey);
    }
  });
};

const onceReady = (window: BrowserWindow) => {
  window.once("ready-to-show", () => {
    window.show();

    window.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    window.setAlwaysOnTop(true, "dock");
    window.setFullScreenable(false);

    window.setSkipTaskbar(false);
    window.moveTop();
  });
};

const createWindow = () => {
  mainWin = new BrowserWindow({
    show: false,
    skipTaskbar: true,
    hasShadow: false,
    width: 550,
    height: 550,
    minWidth: 550,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
    autoHideMenuBar: true,
    titleBarStyle: "hidden",
  });

  if (!app.isPackaged) {
    mainWin.webContents.openDevTools({ mode: "undocked" });
  }

  mainWin.loadURL(path.join(RENDERER_DIST, "index.html#main"));
  onceReady(mainWin);
};

const createCaptureWindow = () => {
  captureWin = new BrowserWindow({
    show: false,
    skipTaskbar: true,
    hasShadow: false,
    minHeight: 100,
    minWidth: 300,
    x: captureArea?.x,
    y: captureArea?.y,
    width: captureArea?.width,
    height: captureArea?.height,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
    transparent: true,
    autoHideMenuBar: true,
    titleBarStyle: "hidden",
  });

  captureWin.loadURL(path.join(RENDERER_DIST, "index.html#translator"));
  onceReady(captureWin);

  captureWin.on("close", () => {
    const bounds = captureWin?.getBounds();
    if (!bounds) {
      return;
    }

    captureArea = {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
    };

    updateConfig({ CAPTURE_AREA: captureArea } as Partial<AppConfig>);
  });
};

ipcMain.handle("take-screenshot", async () => {
  if (!captureArea) {
    return null;
  }
  try {
    const display = screen.getDisplayNearestPoint({
      x: captureArea.x,
      y: captureArea.y,
    });

    const sources = await desktopCapturer.getSources({
      types: ["screen"],
      thumbnailSize: {
        width: display.bounds.width,
        height: display.bounds.height,
      },
    });

    const source = sources.find((s) => s.display_id === String(display.id));

    if (!source) {
      throw new Error("Cant find source");
    }

    const screenshotImage = source.thumbnail;
    const fullScreenshotBuffer = screenshotImage.toPNG();

    const sharpenKernel = [
      [-1, -1, -1],
      [-1, 9, -1],
      [-1, -1, -1],
    ];

    const jimp = await Jimp.read(fullScreenshotBuffer);
    const croppedImage = jimp
      .crop({
        x: captureArea.x + 4,
        y: captureArea.y + 32,
        w: captureArea.width - 8,
        h: captureArea.height - 38,
      })
      .scale(2)
      .greyscale()
      .brightness(0.8)
      .blur(1)
      .convolution(sharpenKernel)
      .threshold({ max: 200, autoGreyscale: false });

    let needInvert = false;
    let blackPixels = 0;
    let whitePixels = 0;
    croppedImage.scan(
      0,
      0,
      croppedImage.bitmap.width,
      croppedImage.bitmap.height,
      (_x, _y, idx) => {
        if (croppedImage.bitmap.data[idx + 0] < 128) {
          blackPixels++;
        } else {
          whitePixels++;
        }

        if (blackPixels > whitePixels) {
          needInvert = true;
        }
      }
    );

    if (needInvert) {
      croppedImage.invert();
    }

    const croppedImageBuffer = await croppedImage.getBuffer("image/png");

    if (!app.isPackaged) {
      const dir = path.join(os.homedir(), "Documents", "tempScreen");
      const screenshotPath = path.join(dir, `screenshot-${Date.now()}.png`);
      fs.writeFileSync(screenshotPath, croppedImageBuffer);
      console.log("Save path:", screenshotPath);
    }

    return croppedImageBuffer;
  } catch (e) {
    console.error("Screen capture failed:", e);
    return null;
  }
});

ipcMain.handle("open-capture-window", () => {
  createCaptureWindow();
});

ipcMain.handle("get-config", () => {
  const configPath = getConfigPath();
  const config = JSON.parse(fs.readFileSync(configPath, "utf8")) as AppConfig;

  if (config.HOTKEY) {
    handleRegisterShortcut(config.HOTKEY);
  }

  if (config.CAPTURE_AREA) {
    captureArea = config.CAPTURE_AREA;
  }

  return config;
});

ipcMain.handle("update-config", (_event, patch: Partial<AppConfig>) => {
  const nextConfig = updateConfig(patch);

  if (!nextConfig) {
    return null;
  }

  if ("CAPTURE_AREA" in patch) {
    captureArea = nextConfig.CAPTURE_AREA;
  }

  if ("HOTKEY" in patch) {
    if (captureHotkey) {
      console.log("unregister", captureHotkey);
      globalShortcut.unregister(captureHotkey);
    }

    const shortcut = nextConfig.HOTKEY;
    captureHotkey = shortcut;

    if (shortcut) {
      handleRegisterShortcut(shortcut);
    }
  }

  return nextConfig;
});

ipcMain.on("window-close", () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) {
    win.close();
  }
});

ipcMain.on("window-minimize", () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) {
    win.minimize();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    mainWin = null;
    captureWin = null;
    captureArea = null;
    if (captureHotkey) {
      globalShortcut.unregister(captureHotkey);
      captureHotkey = null;
    }
  }
});

app.whenReady().then(createWindow);
