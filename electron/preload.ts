import { contextBridge, ipcRenderer } from 'electron';

export interface ElectronAPI {
  minimize: () => void;
  maximize: () => void;
  close: () => void;
  isMaximized: () => Promise<boolean>;
  onMaximizedChange: (callback: (isMax: boolean) => void) => () => void;
  printToPDF: (options?: { landscape?: boolean; pageSize?: string }) => Promise<{ success: boolean; data?: string; error?: string }>;
  printDirect: () => Promise<{ success: boolean; error?: string }>;
  showSaveDialog: (options: { title: string; defaultPath: string; filters: Array<{ name: string; extensions: string[] }> }) => Promise<string | null>;
  showOpenDialog: (options: { title: string; filters: Array<{ name: string; extensions: string[] }> }) => Promise<string | null>;
  saveFile: (filePath: string, content: string | Uint8Array) => Promise<boolean>;
  readFile: (filePath: string) => Promise<string | null>;
  saveDb: (data: Uint8Array) => Promise<boolean>;
  loadDb: () => Promise<Uint8Array | null>;
  platform: string;
}

const electronAPI: ElectronAPI = {
  minimize: () => ipcRenderer.send('window:minimize'),
  maximize: () => ipcRenderer.send('window:maximize'),
  close: () => ipcRenderer.send('window:close'),
  isMaximized: () => ipcRenderer.invoke('window:isMaximized'),
  onMaximizedChange: (callback: (isMax: boolean) => void) => {
    const handler = (_event: any, isMax: boolean) => callback(isMax);
    ipcRenderer.on('window:maximized-change', handler);
    return () => {
      ipcRenderer.removeListener('window:maximized-change', handler);
    };
  },
  printToPDF: (options) => ipcRenderer.invoke('pdf:printToPDF', options),
  printDirect: () => ipcRenderer.invoke('print:direct'),
  showSaveDialog: (options) => ipcRenderer.invoke('dialog:save', options),
  showOpenDialog: (options) => ipcRenderer.invoke('dialog:open', options),
  saveFile: (filePath, content) => ipcRenderer.invoke('file:save', filePath, content),
  readFile: (filePath) => ipcRenderer.invoke('file:read', filePath),
  saveDb: (data) => ipcRenderer.invoke('db:save', data),
  loadDb: () => ipcRenderer.invoke('db:load'),
  platform: process.platform,
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
