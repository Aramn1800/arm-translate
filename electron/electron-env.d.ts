/// <reference types="vite-plugin-electron/electron-env" />

// biome-ignore lint/style/noNamespace: <explanation>
declare namespace NodeJS {
  interface ProcessEnv {
    APP_ROOT: string;
    VITE_PUBLIC: string;
  }
}

interface Window {
  ipcRenderer: import("electron").IpcRenderer;
}
