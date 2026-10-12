import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Banknote, 
  Barcode, 
  Monitor, 
  Volume2, 
  Check, 
  Smartphone,
  Cpu,
  Globe
} from 'lucide-react';
import { hardwareService, HardwareSettings, PrinterInterface, PaperWidth } from '../../core/hardware/hardwareService';

interface HardwareSettingsModalProps {
  onClose: () => void;
}

export function HardwareSettingsModal({ onClose }: HardwareSettingsModalProps) {
  const [settings, setSettings] = useState<HardwareSettings>(hardwareService.getSettings());
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const isElectron = typeof window !== 'undefined' && Boolean(window.electronAPI?.isElectron);
  const isCapacitor = typeof window !== 'undefined' && Boolean((window as any).Capacitor);

  const handleSave = () => {
    hardwareService.saveSettings(settings);
    setStatusMessage('Hardware settings saved successfully');
    setTimeout(() => setStatusMessage(null), 2500);
  };

  const handleTestCashDrawer = async () => {
    const res = await hardwareService.kickCashDrawer();
    setStatusMessage(res.message);
    setTimeout(() => setStatusMessage(null), 2500);
  };

  const handleTestPrint = async () => {
    // Generate dummy test order
    const testOrder: any = {
      id: 'test_receipt',
      orderNumber: 'TEST-001',
      orderType: 'DINE_IN',
      tableNumber: 'Hardware Test',
      items: [
        { name: 'Hardware Self-Test Slip', quantity: 1, price: 0.00 }
      ],
      subtotal: 0,
      tax: 0,
      total: 0,
      createdAt: new Date().toISOString(),
      paymentMethod: 'CASH'
    };
    const res = await hardwareService.printOrder(testOrder, 'receipt');
    setStatusMessage(res.message);
    setTimeout(() => setStatusMessage(null), 2500);
  };

  const handleConnectSerial = async () => {
    const success = await hardwareService.connectSerialPort();
    if (success) {
      setSettings(hardwareService.getSettings());
      setStatusMessage('Connected to Web Serial ESC/POS Printer!');
    } else {
      setStatusMessage('Web Serial port connection cancelled or unavailable');
    }
    setTimeout(() => setStatusMessage(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white border-2 border-[#ebd5da] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-[#800000] flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#800000] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Cpu className="w-5 h-5 text-white" />
            <div>
              <h2 className="text-lg font-black tracking-wide">Hardware & Peripherals</h2>
              <p className="text-xs text-[#fbe6ea] font-medium">
                Thermal Printers, Cash Drawers & Barcode Scanners
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {statusMessage && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 text-xs font-black text-emerald-800 flex items-center justify-between">
            <span>✓ {statusMessage}</span>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white font-sans text-xs">
          
          {/* Active Platform Banner */}
          <div className="p-3.5 rounded-xl bg-[#fdf5f6] border border-[#ebd5da] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {isElectron ? (
                <Monitor className="w-5 h-5 text-[#800000]" />
              ) : isCapacitor ? (
                <Smartphone className="w-5 h-5 text-[#800000]" />
              ) : (
                <Globe className="w-5 h-5 text-[#800000]" />
              )}
              <div>
                <span className="font-black text-sm text-[#800000] block">
                  {isElectron ? 'Desktop Workstation (Electron)' : isCapacitor ? 'Mobile Handheld (Capacitor)' : 'Web / PWA Standalone'}
                </span>
                <span className="text-[11px] text-[#800000]/70 font-semibold">
                  Operating System: {typeof navigator !== 'undefined' ? navigator.platform : 'Cross-Platform'}
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
              Online
            </span>
          </div>

          {/* 1. Thermal ESC/POS Printer Configuration */}
          <div className="border border-[#ebd5da] rounded-xl p-4 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-black text-sm text-[#800000] flex items-center gap-2">
                <Printer className="w-4 h-4 text-[#800000]" /> Thermal Receipt Printer
              </span>
              <button
                type="button"
                onClick={handleTestPrint}
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#fdf5f6] border border-[#ebd5da] text-[#800000] hover:bg-[#fee8eb] cursor-pointer"
              >
                Test Print Slip
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-[#800000]/80 mb-1">
                  Printer Interface
                </label>
                <select
                  value={settings.printerInterface}
                  onChange={(e) => setSettings({ ...settings, printerInterface: e.target.value as PrinterInterface })}
                  className="w-full px-2.5 py-2 text-xs font-bold bg-[#fdf5f6] border border-[#ebd5da] rounded-xl text-[#800000]"
                >
                  <option value="SYSTEM_PRINT">Standard Thermal Print Dialog</option>
                  <option value="WEB_SERIAL">Web Serial ESC/POS (USB Port)</option>
                  <option value="NETWORK">Network ESC/POS (TCP/IP)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#800000]/80 mb-1">
                  Paper Roll Size
                </label>
                <select
                  value={settings.paperWidth}
                  onChange={(e) => setSettings({ ...settings, paperWidth: e.target.value as PaperWidth })}
                  className="w-full px-2.5 py-2 text-xs font-bold bg-[#fdf5f6] border border-[#ebd5da] rounded-xl text-[#800000]"
                >
                  <option value="80mm">Standard 80mm Roll (3 inch)</option>
                  <option value="58mm">Compact 58mm Roll (2 inch)</option>
                </select>
              </div>
            </div>

            {settings.printerInterface === 'WEB_SERIAL' && (
              <div className="pt-2 flex justify-between items-center bg-[#fdf5f6] p-2.5 rounded-lg">
                <span className="text-[11px] font-semibold text-[#800000]">Pair USB Thermal Printer</span>
                <button
                  type="button"
                  onClick={handleConnectSerial}
                  className="px-3 py-1 bg-[#800000] text-white rounded-lg text-xs font-black cursor-pointer"
                >
                  Select USB Port
                </button>
              </div>
            )}

            <div className="pt-1 flex items-center justify-between">
              <span className="text-xs font-bold text-[#800000]/80">Auto-Print Slip Upon Settle</span>
              <input
                type="checkbox"
                checked={settings.autoPrintReceipt}
                onChange={(e) => setSettings({ ...settings, autoPrintReceipt: e.target.checked })}
                className="w-4 h-4 accent-[#800000] cursor-pointer"
              />
            </div>
          </div>

          {/* 2. Cash Drawer Configuration */}
          <div className="border border-[#ebd5da] rounded-xl p-4 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-black text-sm text-[#800000] flex items-center gap-2">
                <Banknote className="w-4 h-4 text-[#800000]" /> Electronic Cash Drawer
              </span>
              <button
                type="button"
                onClick={handleTestCashDrawer}
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#800000] text-white hover:bg-[#680016] cursor-pointer"
              >
                Pulse / Kick Drawer (F10)
              </button>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-bold text-[#800000]/80">Auto-Kick Drawer on Cash Payments</span>
              <input
                type="checkbox"
                checked={settings.autoOpenCashDrawer}
                onChange={(e) => setSettings({ ...settings, autoOpenCashDrawer: e.target.checked })}
                className="w-4 h-4 accent-[#800000] cursor-pointer"
              />
            </div>
            <p className="text-[10px] text-[#800000]/60 leading-relaxed font-semibold">
              Dispatches standard 24V pulse (ESC p 0 25 250) through RJ11/RJ12 drawer port connected to thermal receipt printer.
            </p>
          </div>

          {/* 3. Barcode Scanner & Sound Alerts */}
          <div className="border border-[#ebd5da] rounded-xl p-4 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-black text-sm text-[#800000] flex items-center gap-2">
                <Barcode className="w-4 h-4 text-[#800000]" /> Barcode Scanner & Audio Alerts
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                HID Wedge Ready
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-bold text-[#800000]/80">Scanner Audio Beep & Chimes</span>
              <input
                type="checkbox"
                checked={settings.soundAlerts}
                onChange={(e) => setSettings({ ...settings, soundAlerts: e.target.checked })}
                className="w-4 h-4 accent-[#800000] cursor-pointer"
              />
            </div>
            <p className="text-[10px] text-[#800000]/60 leading-relaxed font-semibold">
              USB and Bluetooth handheld barcode scanners function automatically without manual drivers by intercepting keyboard bursts.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#fdf5f6] border-t border-[#ebd5da] flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl border border-[#ebd5da] bg-white text-[#800000] font-black text-xs hover:bg-[#fee8eb] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="py-2.5 px-5 rounded-xl bg-[#800000] hover:bg-[#680016] text-white font-black text-xs cursor-pointer shadow-xs"
          >
            Save Hardware Profile
          </button>
        </div>
      </div>
    </div>
  );
}
