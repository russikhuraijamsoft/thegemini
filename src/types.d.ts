import { RecaptchaVerifier } from 'firebase/auth';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
  const grecaptcha: any;
}

declare module 'electron' {
  export const app: any;
  export const BrowserWindow: any;
  export const ipcMain: any;
  export const ipcRenderer: any;
  export const contextBridge: any;
}

declare module '@capacitor/cli' {
  export interface CapacitorConfig {
    appId: string;
    appName: string;
    webDir: string;
    server?: Record<string, any>;
    plugins?: Record<string, any>;
    [key: string]: any;
  }
}
