import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  isElectron: true,
  kickCashDrawer: () => ipcRenderer.invoke('hardware:kickCashDrawer'),
  getPrinters: () => ipcRenderer.invoke('hardware:getPrinters'),
  printSilent: (options: { deviceName?: string; silent?: boolean; pageSize?: any }) => 
    ipcRenderer.invoke('hardware:printSilent', options),
});
