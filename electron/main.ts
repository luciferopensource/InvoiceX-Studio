import { app, BrowserWindow, ipcMain, dialog, screen } from 'electron';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

function getDbPath(): string {
  const userData = app.getPath('userData');
  return path.join(userData, 'lucifer_invoices.sqlite');
}

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;

  const winWidth = Math.min(1440, Math.floor(screenWidth * 0.95));
  const winHeight = Math.min(960, Math.floor(screenHeight * 0.95));

  mainWindow = new BrowserWindow({
    width: winWidth,
    height: winHeight,
    minWidth: 1024,
    minHeight: 700,
    frame: false, // Frameless for modern custom title bar with native drag & controls
    backgroundColor: '#0a0d14',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
  });

  mainWindow.once('ready-to-show', () => {
    if (mainWindow) {
      mainWindow.show();
    }
  });

  // Track maximize state change
  mainWindow.on('maximize', () => {
    mainWindow?.webContents.send('window:maximized-change', true);
  });

  mainWindow.on('unmaximize', () => {
    mainWindow?.webContents.send('window:maximized-change', false);
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    // Open DevTools in dev mode if needed
    // mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
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

// IPC Window Handlers
ipcMain.on('window:minimize', () => {
  mainWindow?.minimize();
});

ipcMain.on('window:maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.on('window:close', () => {
  mainWindow?.close();
});

ipcMain.handle('window:isMaximized', () => {
  return mainWindow?.isMaximized() ?? false;
});

// Direct Print Handler
ipcMain.handle('print:direct', async () => {
  if (!mainWindow) return { success: false, error: 'Window not available' };
  return new Promise((resolve) => {
    mainWindow?.webContents.print(
      {
        silent: false,
        printBackground: true,
        pageSize: 'A4',
      },
      (success, failureReason) => {
        if (!success) {
          resolve({ success: false, error: failureReason });
        } else {
          resolve({ success: true });
        }
      }
    );
  });
});

// PDF Generation Handler via Chromium
ipcMain.handle('pdf:printToPDF', async (_event, options) => {
  if (!mainWindow) return { success: false, error: 'Window not available' };
  try {
    const data = await mainWindow.webContents.printToPDF({
      printBackground: true,
      landscape: options?.landscape ?? false,
      pageSize: (options?.pageSize as any) ?? 'A4',
      preferCSSPageSize: true,
      margins: {
        marginType: 'none',
      },
    });
    return {
      success: true,
      data: data.toString('base64'),
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Failed to generate PDF',
    };
  }
});

// File Dialogs
ipcMain.handle('dialog:save', async (_event, options) => {
  if (!mainWindow) return null;
  const result = await dialog.showSaveDialog(mainWindow, {
    title: options.title,
    defaultPath: options.defaultPath,
    filters: options.filters,
  });
  if (result.canceled || !result.filePath) return null;
  return result.filePath;
});

ipcMain.handle('dialog:open', async (_event, options) => {
  if (!mainWindow) return null;
  const result = await dialog.showOpenDialog(mainWindow, {
    title: options.title,
    properties: ['openFile'],
    filters: options.filters,
  });
  if (result.canceled || result.filePaths.length === 0) return null;
  return result.filePaths[0];
});

// File System handlers
ipcMain.handle('file:save', async (_event, filePath: string, content: string | Uint8Array) => {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (typeof content === 'string') {
      fs.writeFileSync(filePath, content, 'utf-8');
    } else {
      fs.writeFileSync(filePath, Buffer.from(content));
    }
    return true;
  } catch (err) {
    console.error('Error saving file:', err);
    return false;
  }
});

ipcMain.handle('file:read', async (_event, filePath: string) => {
  try {
    if (!fs.existsSync(filePath)) return null;
    return fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    console.error('Error reading file:', err);
    return null;
  }
});

// SQLite Database Persistence
ipcMain.handle('db:save', async (_event, data: Uint8Array) => {
  try {
    const dbPath = getDbPath();
    fs.writeFileSync(dbPath, Buffer.from(data));
    return true;
  } catch (err) {
    console.error('Failed to persist SQLite database file:', err);
    return false;
  }
});

ipcMain.handle('db:load', async () => {
  try {
    const dbPath = getDbPath();
    if (!fs.existsSync(dbPath)) return null;
    const buffer = fs.readFileSync(dbPath);
    return new Uint8Array(buffer);
  } catch (err) {
    console.error('Failed to read SQLite database file:', err);
    return null;
  }
});
