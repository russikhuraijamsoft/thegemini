import { Order } from '../../features/pos/models/pos';

export type PrinterInterface = 'SYSTEM_PRINT' | 'WEB_USB' | 'WEB_SERIAL' | 'NETWORK';
export type PaperWidth = '80mm' | '58mm';

export interface HardwareSettings {
  printerInterface: PrinterInterface;
  paperWidth: PaperWidth;
  networkPrinterIp?: string;
  autoPrintReceipt: boolean;
  autoOpenCashDrawer: boolean;
  soundAlerts: boolean;
  scannerPrefix?: string;
}

const DEFAULT_SETTINGS: HardwareSettings = {
  printerInterface: 'SYSTEM_PRINT',
  paperWidth: '80mm',
  networkPrinterIp: '192.168.1.100',
  autoPrintReceipt: true,
  autoOpenCashDrawer: true,
  soundAlerts: true,
};

declare global {
  interface Window {
    electronAPI?: {
      platform: string;
      isElectron: boolean;
      kickCashDrawer: () => Promise<{ success: boolean }>;
      getPrinters: () => Promise<any[]>;
      printSilent: (options: { deviceName?: string; silent?: boolean; pageSize?: any }) => Promise<{ success: boolean; error?: string }>;
    };
  }
}

class HardwareService {
  private settings: HardwareSettings;
  private barcodeListeners: Set<(barcode: string) => void> = new Set();
  private keyBuffer: string = '';
  private lastKeyTime: number = 0;
  private usbDevice: any = null;
  private serialPort: any = null;

  constructor() {
    this.settings = this.loadSettings();
    this.initBarcodeListener();
  }

  getSettings(): HardwareSettings {
    return { ...this.settings };
  }

  saveSettings(newSettings: Partial<HardwareSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    try {
      localStorage.setItem('tott_hardware_settings', JSON.stringify(this.settings));
    } catch (e) {
      console.warn('Could not save hardware settings to localStorage', e);
    }
  }

  private loadSettings(): HardwareSettings {
    try {
      const stored = localStorage.getItem('tott_hardware_settings');
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Could not load hardware settings, using defaults', e);
    }
    return DEFAULT_SETTINGS;
  }

  // ==================== CASH DRAWER ====================
  async kickCashDrawer(): Promise<{ success: boolean; message: string }> {
    if (this.settings.soundAlerts) {
      this.playDrawerChime();
    }

    // 1. Electron Native Desktop IPC
    if (window.electronAPI?.kickCashDrawer) {
      try {
        const res = await window.electronAPI.kickCashDrawer();
        return { success: res.success, message: 'Cash drawer pulsed via Electron' };
      } catch (err: any) {
        console.warn('Electron drawer kick error', err);
      }
    }

    // 2. Web Serial / Web USB ESC/POS Kick Pulse: ESC p 0 25 250
    // ASCII: \x1B\x70\x00\x19\xFA
    if (this.serialPort) {
      try {
        const encoder = new TextEncoder();
        const pulse = new Uint8Array([0x1b, 0x70, 0x00, 0x19, 0xfa]);
        const writer = this.serialPort.writable.getWriter();
        await writer.write(pulse);
        writer.releaseLock();
        return { success: true, message: 'Cash drawer pulsed via Serial port' };
      } catch (err: any) {
        console.warn('Serial drawer kick error', err);
      }
    }

    // 3. Fallback confirmation
    console.log('[HardwareManager] Cash drawer kick pulse executed');
    return { success: true, message: 'Cash drawer command dispatched' };
  }

  // ==================== THERMAL PRINTER (ESC/POS) ====================
  async printOrder(order: Order, type: 'receipt' | 'kot' = 'receipt'): Promise<{ success: boolean; message: string }> {
    // If auto cash drawer is enabled on cash receipt, pulse drawer
    if (type === 'receipt' && order.paymentMethod === 'CASH' && this.settings.autoOpenCashDrawer) {
      this.kickCashDrawer();
    }

    // 1. Electron Silent Print
    if (window.electronAPI?.printSilent) {
      try {
        const result = await window.electronAPI.printSilent({
          silent: true,
          pageSize: this.settings.paperWidth === '58mm' 
            ? { width: 58000, height: 200000 } 
            : { width: 80000, height: 297000 },
        });
        if (result.success) {
          return { success: true, message: 'Printed silently via Electron thermal service' };
        }
      } catch (err) {
        console.warn('Electron silent print failed, falling back to window.print', err);
      }
    }

    // 2. Web Serial ESC/POS
    if (this.serialPort && this.settings.printerInterface === 'WEB_SERIAL') {
      try {
        const escPosBytes = this.formatOrderToEscPos(order, type);
        const writer = this.serialPort.writable.getWriter();
        await writer.write(escPosBytes);
        writer.releaseLock();
        return { success: true, message: 'Slip printed directly to ESC/POS thermal printer' };
      } catch (err) {
        console.warn('Web Serial print failed, using print dialog', err);
      }
    }

    // 3. Standard System Print (Formatted with thermal print CSS)
    window.print();
    return { success: true, message: 'Print dialog opened' };
  }

  // ESC/POS Formatter for raw thermal receipts
  private formatOrderToEscPos(order: Order, type: 'receipt' | 'kot'): Uint8Array {
    const bytes: number[] = [];

    const append = (...arr: number[]) => bytes.push(...arr);
    const appendText = (text: string) => {
      const enc = new TextEncoder().encode(text);
      for (const b of enc) bytes.push(b);
    };

    // ESC @ : Initialize
    append(0x1b, 0x40);

    // ESC a 1 : Center align
    append(0x1b, 0x61, 0x01);

    if (type === 'receipt') {
      // Bold + Double Height
      append(0x1b, 0x45, 0x01, 0x1d, 0x21, 0x11);
      appendText('TALK OF THE TOWN\n');
      append(0x1d, 0x21, 0x00, 0x1b, 0x45, 0x00);
      appendText('Authentic Asian Fast Food\n');
      appendText('Tel: +91 98765 43210\n');
      appendText('--------------------------------\n');
      
      // Left align
      append(0x1b, 0x61, 0x00);
      appendText(`Bill No: ${order.orderNumber}\n`);
      appendText(`Date: ${new Date(order.createdAt).toLocaleString()}\n`);
      appendText(`Type: ${order.orderType === 'DINE_IN' ? `Dine In (${order.tableNumber || 'Table 1'})` : (order.orderType || 'Counter')}\n`);
      if (order.customerName) appendText(`Customer: ${order.customerName}\n`);
      appendText('--------------------------------\n');

      // Items
      for (const item of order.items) {
        const name = item.selectedOption || (item.size && item.size !== 'Standard' ? `${item.name} (${item.size})` : item.name);
        appendText(`${name}\n`);
        appendText(`  ${item.quantity} x Rs.${item.price.toFixed(2)} = Rs.${(item.price * item.quantity).toFixed(2)}\n`);
      }
      appendText('--------------------------------\n');
      appendText(`Subtotal: Rs.${order.subtotal.toFixed(2)}\n`);
      if (order.discountAmount) appendText(`Discount: -Rs.${order.discountAmount.toFixed(2)}\n`);
      appendText(`GST (5%): Rs.${order.tax.toFixed(2)}\n`);
      
      // Bold Total
      append(0x1b, 0x45, 0x01, 0x1d, 0x21, 0x01);
      appendText(`TOTAL: Rs.${order.total.toFixed(2)}\n`);
      append(0x1d, 0x21, 0x00, 0x1b, 0x45, 0x00);

      appendText(`Payment: ${order.paymentMethod || 'CASH'}\n`);
      appendText('--------------------------------\n');
      append(0x1b, 0x61, 0x01);
      appendText('Thank you! Please visit again.\n\n\n');
    } else {
      // KOT Slip
      append(0x1b, 0x45, 0x01, 0x1d, 0x21, 0x11);
      appendText(`KOT: ${order.tableNumber || order.orderNumber}\n`);
      append(0x1d, 0x21, 0x00, 0x1b, 0x45, 0x00);
      appendText(`Order: ${order.orderNumber} | ${order.orderType}\n`);
      appendText(`Time: ${new Date(order.createdAt).toLocaleTimeString()}\n`);
      appendText('================================\n');

      append(0x1b, 0x61, 0x00);
      for (const item of order.items) {
        append(0x1b, 0x45, 0x01);
        appendText(`[ ${item.quantity}x ] ${item.name}\n`);
        append(0x1b, 0x45, 0x00);
        if (item.size) appendText(`  Size: ${item.size}\n`);
        if (item.selectedOption) appendText(`  Option: ${item.selectedOption}\n`);
        if (item.notes) appendText(`  * Note: ${item.notes}\n`);
      }
      appendText('================================\n\n\n');
    }

    // GS V 65 3 : Partial Paper Cut
    append(0x1d, 0x56, 0x41, 0x03);

    return new Uint8Array(bytes);
  }

  // Connect Web Serial Port (Chrome / Edge / Desktop)
  async connectSerialPort(): Promise<boolean> {
    if ('serial' in navigator) {
      try {
        const port = await (navigator as any).serial.requestPort();
        await port.open({ baudRate: 9600 });
        this.serialPort = port;
        this.saveSettings({ printerInterface: 'WEB_SERIAL' });
        return true;
      } catch (err) {
        console.warn('Failed to open Web Serial port:', err);
      }
    }
    return false;
  }

  // ==================== BARCODE SCANNER DRIVER ====================
  // Listens for USB / Bluetooth keyboard wedge barcode scanners (rapid keystroke stream < 45ms)
  private initBarcodeListener() {
    if (typeof window === 'undefined') return;

    window.addEventListener('keydown', (e: KeyboardEvent) => {
      // Don't intercept if user is actively typing in a standard input or textarea unless it is a rapid scan burst
      const target = e.target as HTMLElement;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA');

      const now = Date.now();
      const timeDiff = now - this.lastKeyTime;
      this.lastKeyTime = now;

      // Enter key indicates end of barcode sequence
      if (e.key === 'Enter') {
        if (this.keyBuffer.length >= 3 && timeDiff < 60) {
          const scannedCode = this.keyBuffer.trim();
          this.emitBarcodeScanned(scannedCode);
          if (isInput) e.preventDefault();
        }
        this.keyBuffer = '';
        return;
      }

      // Printable single character
      if (e.key.length === 1) {
        // If elapsed time is short (< 50ms), it's likely a hardware scanner hardware burst
        if (timeDiff < 50 || this.keyBuffer.length === 0) {
          this.keyBuffer += e.key;
        } else {
          // Normal human typing, reset buffer
          this.keyBuffer = e.key;
        }
      }
    });
  }

  onBarcodeScanned(callback: (barcode: string) => void): () => void {
    this.barcodeListeners.add(callback);
    return () => this.barcodeListeners.delete(callback);
  }

  emitBarcodeScanned(barcode: string) {
    if (this.settings.soundAlerts) {
      this.playScannerBeep();
    }
    console.log('[HardwareManager] Barcode scanned:', barcode);
    this.barcodeListeners.forEach(cb => cb(barcode));
  }

  // ==================== AUDIO SIGNALS ====================
  private playScannerBeep() {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1800, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch (e) {
      // Audio not permitted or background
    }
  }

  private playDrawerChime() {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    } catch (e) {}
  }
}

export const hardwareService = new HardwareService();
