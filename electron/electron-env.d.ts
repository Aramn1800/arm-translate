/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    APP_ROOT: string
    VITE_PUBLIC: string
  }
}

// biome-ignore lint/correctness/noUnusedVariables: <explanation>
interface Window {
  ipcRenderer: import('electron').IpcRenderer
}
