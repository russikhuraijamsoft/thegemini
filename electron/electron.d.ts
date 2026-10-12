declare module 'electron' {
  export const app: {
    requestSingleInstanceLock: () => boolean;
    quit: () => void;
    whenReady: () => Promise<void>;
    on: (event: string, listener: (...args: any[]) => void) => void;
  };

  export class BrowserWindow {
    constructor(options?: any);
    loadURL: (url: string) => Promise<void>;
    loadFile: (filePath: string) => Promise<void>;
    on: (event: string, listener: (...args: any[]) => void) => void;
    isMinimized: () => boolean;
    restore: () => void;
    focus: () => void;
    webContents: {
      openDevTools: (options?: any) => void;
      getPrintersAsync: () => Promise<any[]>;
      print: (options: any, callback: (success: boolean, failureReason?: string) => void) => void;
    };
    static getAllWindows: () => BrowserWindow[];
  }

  export const ipcMain: {
    handle: (channel: string, listener: (event: any, ...args: any[]) => any) => void;
    on: (channel: string, listener: (event: any, ...args: any[]) => void) => void;
  };

  export const ipcRenderer: {
    invoke: (channel: string, ...args: any[]) => Promise<any>;
    on: (channel: string, listener: (event: any, ...args: any[]) => void) => void;
  };

  export const contextBridge: {
    exposeInMainWorld: (apiKey: string, api: any) => void;
  };
}
