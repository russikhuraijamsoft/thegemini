import React, { useState, useEffect } from 'react';
import { 
  Printer, 
  Banknote, 
  Barcode, 
  Keyboard, 
  Smartphone, 
  Monitor, 
  Check, 
  Volume2, 
  VolumeX, 
  RefreshCw,
  Sparkles,
  Laptop
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/components/ui/Card';
import { hardwareService, HardwareSettings } from '../../../core/hardware/hardwareService';

export function HardwareConfigCard() {
  const [settings, setSettings] = useState<HardwareSettings>(hardwareService.getSettings());
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [isKickingDrawer, setIsKickingDrawer] = useState(false);
  const [isTestPrinting, setIsTestPrinting] = useState(false);
  const [lastScannedBarcode, setLastScannedBarcode] = useState<string | null>(null);

  useEffect(() => {
    const unsub = hardwareService.onBarcodeScanned((code) => {
      setLastScannedBarcode(code);
      setTestStatus(`Barcode scanned: ${code}`);
      setTimeout(() => setTestStatus(null), 3500);
    });
    return () => unsub();
  }, []);

  const handleUpdate = (updated: Partial<HardwareSettings>) => {
    const next = { ...settings, ...updated };
    setSettings(next);
    hardwareService.saveSettings(updated);
  };

  const handleTestCashDrawer = async () => {
    setIsKickingDrawer(true);
    setTestStatus('Sending ESC/POS cash drawer kick pulse (ESC p 0 25 250)...');
    try {
      const res = await hardwareService.kickCashDrawer();
      setTestStatus(res.message);
    } catch (err: any) {
      setTestStatus('Failed to kick cash drawer');
    } finally {
      setIsKickingDrawer(false);
      setTimeout(() => setTestStatus(null), 3000);
    }
  };

  const handleTestPrint = async () => {
    setIsTestPrinting(true);
    setTestStatus('Generating sample ESC/POS test receipt...');
    try {
      const sampleOrder = {
        id: `test_${Date.now()}`,
        orderNumber: 'TEST-001',
        orderType: 'DINE_IN' as const,
        tableNumber: 'Table 1',
        customerName: 'Hardware Test',
        items: [
          {
            id: 'item_1',
            productId: 'prod_chow_veg',
            name: 'Veg Chowmein',
            size: 'Standard' as const,
            price: 120,
            quantity: 1,
            subtotal: 120,
          },
          {
            id: 'item_2',
            productId: 'prod_fr_veg',
            name: 'Veg Fried Rice',
            size: 'Standard' as const,
            price: 130,
            quantity: 1,
            subtotal: 130,
          }
        ],
        subtotal: 250,
        tax: 12.5,
        total: 262.5,
        paymentMethod: 'CASH' as const,
        cashTendered: 300,
        changeDue: 37.5,
        status: 'PAID' as const,
        createdAt: new Date().toISOString()
      };
      const res = await hardwareService.printOrder(sampleOrder, 'receipt');
      setTestStatus(res.message);
    } catch (err: any) {
      setTestStatus('Test print failed');
    } finally {
      setIsTestPrinting(false);
      setTimeout(() => setTestStatus(null), 3000);
    }
  };

  const isElectron = typeof window !== 'undefined' && Boolean(window.electronAPI?.isElectron);

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Status toast if active */}
      {testStatus && (
        <div className="bg-[#800000] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center justify-between animate-in fade-in">
          <span>{testStatus}</span>
          <button 
            type="button" 
            onClick={() => setTestStatus(null)} 
            className="text-white/80 hover:text-white ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Hardware Profile & Platform Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#ebd5da] rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#fdf5f6] border border-[#ebd5da] flex items-center justify-center text-[#800000]">
              {isElectron ? <Laptop className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
            </div>
            <div>
              <div className="text-xs font-bold text-[#800000]/60">Platform Runtime</div>
              <div className="text-sm font-black text-[#800000]">
                {isElectron ? 'Electron Native Desktop' : 'Web / Progressive Web App (PWA)'}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#ebd5da] rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#fdf5f6] border border-[#ebd5da] flex items-center justify-center text-[#800000]">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#800000]/60">Selected Thermal Roll</div>
              <div className="text-sm font-black text-[#800000]">{settings.paperWidth} Roll Width</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#ebd5da] rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#fdf5f6] border border-[#ebd5da] flex items-center justify-center text-[#800000]">
              <Barcode className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#800000]/60">Barcode Hardware Wedge</div>
              <div className="text-sm font-black text-[#800000]">
                {lastScannedBarcode ? `Last: ${lastScannedBarcode}` : 'Ready for Scans'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Thermal Printer Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-black text-[#800000] flex items-center gap-2">
            <Printer className="w-5 h-5 text-[#800000]" /> Thermal Receipt & KOT Printer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-[#800000]">Printer Interface</label>
              <select
                value={settings.printerInterface}
                onChange={(e) => handleUpdate({ printerInterface: e.target.value as any })}
                className="w-full px-3 py-2 bg-white border border-[#ebd5da] rounded-lg text-sm text-[#800000] font-bold focus:outline-none focus:ring-2 focus:ring-[#800000]"
              >
                <option value="SYSTEM_PRINT">Standard Thermal Print (System Dialog / 80mm Roll)</option>
                <option value="WEB_SERIAL">Web Serial Port (Direct ESC/POS)</option>
                <option value="WEB_USB">WebUSB (Direct Raw ESC/POS)</option>
                <option value="NETWORK">Network / Ethernet ESC/POS Printer</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-[#800000]">Receipt Roll Width</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdate({ paperWidth: '80mm' })}
                  className={`py-2 px-3 rounded-lg border text-xs font-black transition-all cursor-pointer ${
                    settings.paperWidth === '80mm'
                      ? 'bg-[#800000] text-white border-[#800000]'
                      : 'bg-white text-[#800000] border-[#ebd5da] hover:bg-[#fdf5f6]'
                  }`}
                >
                  80mm Standard (Desktop)
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdate({ paperWidth: '58mm' })}
                  className={`py-2 px-3 rounded-lg border text-xs font-black transition-all cursor-pointer ${
                    settings.paperWidth === '58mm'
                      ? 'bg-[#800000] text-white border-[#800000]'
                      : 'bg-white text-[#800000] border-[#ebd5da] hover:bg-[#fdf5f6]'
                  }`}
                >
                  58mm Compact (Mobile Handheld)
                </button>
              </div>
            </div>
          </div>

          {settings.printerInterface === 'NETWORK' && (
            <div className="space-y-1.5">
              <label className="text-xs font-black text-[#800000]">Network Printer IP Address</label>
              <input
                type="text"
                value={settings.networkPrinterIp || ''}
                onChange={(e) => handleUpdate({ networkPrinterIp: e.target.value })}
                placeholder="192.168.1.100"
                className="w-full max-w-sm px-3 py-2 bg-white border border-[#ebd5da] rounded-lg text-sm text-[#800000] font-mono focus:outline-none focus:ring-2 focus:ring-[#800000]"
              />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <label className="flex items-center gap-2 text-xs font-bold text-[#800000] cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoPrintReceipt}
                onChange={(e) => handleUpdate({ autoPrintReceipt: e.target.checked })}
                className="rounded border-[#ebd5da] text-[#800000] focus:ring-[#800000]"
              />
              Auto-print customer receipt upon payment settlement
            </label>

            <label className="flex items-center gap-2 text-xs font-bold text-[#800000] cursor-pointer">
              <input
                type="checkbox"
                checked={settings.soundAlerts}
                onChange={(e) => handleUpdate({ soundAlerts: e.target.checked })}
                className="rounded border-[#ebd5da] text-[#800000] focus:ring-[#800000]"
              />
              Play audio alerts on drawer kick & order prints
            </label>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={handleTestPrint}
              disabled={isTestPrinting}
              className="px-4 py-2 bg-[#800000] text-white text-xs font-black rounded-lg hover:bg-[#600000] transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              {isTestPrinting ? 'Printing Test Slip...' : 'Print Test Thermal Receipt'}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Cash Drawer & Kick Pulse Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-black text-[#800000] flex items-center gap-2">
            <Banknote className="w-5 h-5 text-[#800000]" /> Electronic Cash Drawer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-[#800000]/80">
            Cash drawers connect either to the RJ-11/RJ-12 kick port of your thermal receipt printer or via a dedicated USB/serial cash drawer trigger.
          </p>

          <label className="flex items-center gap-2 text-xs font-bold text-[#800000] cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoOpenCashDrawer}
              onChange={(e) => handleUpdate({ autoOpenCashDrawer: e.target.checked })}
              className="rounded border-[#ebd5da] text-[#800000] focus:ring-[#800000]"
            />
            Automatically pulse open cash drawer on Cash payments and Day Register openings
          </label>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={handleTestCashDrawer}
              disabled={isKickingDrawer}
              className="px-4 py-2 bg-white border-2 border-[#800000] text-[#800000] text-xs font-black rounded-lg hover:bg-[#fdf5f6] transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Banknote className="w-4 h-4" />
              {isKickingDrawer ? 'Sending Pulse...' : 'Test Drawer Kick (F10)'}
            </button>
            <span className="text-[11px] font-mono text-[#800000]/60">Pulse code: ESC p 0 25 250</span>
          </div>
        </CardContent>
      </Card>

      {/* Desktop Keyboard Shortcuts Cheat Sheet */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-black text-[#800000] flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-[#800000]" /> Desktop Hotkeys & Barcode Wedge
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            <div className="p-3 bg-[#fdf5f6] border border-[#ebd5da] rounded-xl text-center">
              <kbd className="px-2 py-1 bg-white border border-[#ebd5da] rounded text-xs font-mono font-black text-[#800000] shadow-xs">F2</kbd>
              <div className="text-[11px] font-black text-[#800000] mt-1.5">New Sale</div>
              <div className="text-[10px] text-[#800000]/60">Clear / Search</div>
            </div>

            <div className="p-3 bg-[#fdf5f6] border border-[#ebd5da] rounded-xl text-center">
              <kbd className="px-2 py-1 bg-white border border-[#ebd5da] rounded text-xs font-mono font-black text-[#800000] shadow-xs">F4</kbd>
              <div className="text-[11px] font-black text-[#800000] mt-1.5">Hold Order</div>
              <div className="text-[10px] text-[#800000]/60">Park Cart</div>
            </div>

            <div className="p-3 bg-[#fdf5f6] border border-[#ebd5da] rounded-xl text-center">
              <kbd className="px-2 py-1 bg-white border border-[#ebd5da] rounded text-xs font-mono font-black text-[#800000] shadow-xs">F8</kbd>
              <div className="text-[11px] font-black text-[#800000] mt-1.5">Orders History</div>
              <div className="text-[10px] text-[#800000]/60">Search Bills</div>
            </div>

            <div className="p-3 bg-[#fdf5f6] border border-[#ebd5da] rounded-xl text-center">
              <kbd className="px-2 py-1 bg-white border border-[#ebd5da] rounded text-xs font-mono font-black text-[#800000] shadow-xs">F9</kbd>
              <div className="text-[11px] font-black text-[#800000] mt-1.5">Settle & Pay</div>
              <div className="text-[10px] text-[#800000]/60">Checkout</div>
            </div>

            <div className="p-3 bg-[#fdf5f6] border border-[#ebd5da] rounded-xl text-center">
              <kbd className="px-2 py-1 bg-white border border-[#ebd5da] rounded text-xs font-mono font-black text-[#800000] shadow-xs">F10</kbd>
              <div className="text-[11px] font-black text-[#800000] mt-1.5">Kick Drawer</div>
              <div className="text-[10px] text-[#800000]/60">Pulse Open</div>
            </div>

            <div className="p-3 bg-[#fdf5f6] border border-[#ebd5da] rounded-xl text-center">
              <kbd className="px-2 py-1 bg-white border border-[#ebd5da] rounded text-xs font-mono font-black text-[#800000] shadow-xs">Esc</kbd>
              <div className="text-[11px] font-black text-[#800000] mt-1.5">Close Modal</div>
              <div className="text-[10px] text-[#800000]/60">Dismiss</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cross-Platform Packaging Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-black text-[#800000] flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-[#800000]" /> Multi-Platform Packaging Architecture
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-[#800000]/80">
            Talk of the Town POS shares 100% of business logic, state stores, and Firebase ERP data across all platforms:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 bg-[#fdf5f6] border border-[#ebd5da] rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <Laptop className="w-4 h-4 text-[#800000]" />
                <span className="text-xs font-black text-[#800000]">Desktop Builds (Windows / Linux / macOS)</span>
              </div>
              <p className="text-[11px] text-[#800000]/70">
                Packaged using Electron via <code className="bg-white px-1.5 py-0.5 rounded text-[#800000] font-mono border border-[#ebd5da]">npm run build:electron</code>. Includes native hardware silent printing and cash drawer pulse IPC.
              </p>
              <div className="text-[10px] font-mono bg-white p-2 rounded border border-[#ebd5da] text-[#800000]">
                Windows: npm run build:win<br />
                Linux: npm run build:linux<br />
                macOS: npm run build:mac
              </div>
            </div>

            <div className="p-3.5 bg-[#fdf5f6] border border-[#ebd5da] rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#800000]" />
                <span className="text-xs font-black text-[#800000]">Mobile Builds (Android / iOS) & PWA</span>
              </div>
              <p className="text-[11px] text-[#800000]/70">
                Packaged using Capacitor via <code className="bg-white px-1.5 py-0.5 rounded text-[#800000] font-mono border border-[#ebd5da]">capacitor.config.ts</code> with app ID <code className="font-mono text-[#800000]">com.talkofthetown.pos</code> and camera barcode scanner.
              </p>
              <div className="text-[10px] font-mono bg-white p-2 rounded border border-[#ebd5da] text-[#800000]">
                Android: npm run cap:android<br />
                iOS: npm run cap:ios<br />
                PWA: npm run build:pwa
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
