import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { Table, Floor } from '../models/table';
import { X, Printer, Download, ExternalLink, Wifi, Utensils, Smartphone, Copy, Check } from 'lucide-react';

interface TableQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  table: Table | null;
  floor?: Floor | null;
  allTables?: Table[];
}

export function TableQrModal({ isOpen, onClose, table, floor, allTables = [] }: TableQrModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [wifiSsid, setWifiSsid] = useState<string>('TalkOS_Guest_WiFi');
  const [wifiPassword, setWifiPassword] = useState<string>('bistro2026');
  const [copied, setCopied] = useState<boolean>(false);
  const [batchMode, setBatchMode] = useState<boolean>(false);
  const [allQrs, setAllQrs] = useState<{ table: Table; qr: string }[]>([]);
  const printAreaRef = useRef<HTMLDivElement>(null);

  const getTableOrderUrl = (tblNumber: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://talkos.app';
    return `${origin}/order?table=${encodeURIComponent(tblNumber)}`;
  };

  const currentUrl = table ? getTableOrderUrl(table.tableNumber) : '';

  useEffect(() => {
    if (table) {
      const url = getTableOrderUrl(table.tableNumber);
      QRCode.toDataURL(url, {
        width: 380,
        margin: 2,
        color: {
          dark: '#1e1b4b',
          light: '#ffffff'
        }
      }).then(setQrDataUrl).catch(console.error);
    }
  }, [table]);

  useEffect(() => {
    if (batchMode && allTables.length > 0) {
      Promise.all(
        allTables.map(async (t) => {
          const url = getTableOrderUrl(t.tableNumber);
          const qr = await QRCode.toDataURL(url, {
            width: 320,
            margin: 2,
            color: { dark: '#1e1b4b', light: '#ffffff' }
          });
          return { table: t, qr };
        })
      ).then(setAllQrs);
    }
  }, [batchMode, allTables]);

  if (!isOpen || (!table && !batchMode)) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyUrl = () => {
    if (currentUrl) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl || !table) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `QR_Table_${table.tableNumber}.png`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col my-8">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Utensils className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              {batchMode ? 'Batch Print All Table QR Stands' : `Table QR Code & Stand — ${table?.tableNumber}`}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {batchMode ? `Generating stand cards for ${allTables.length} tables` : `${floor?.name || 'Main Floor'} • Instant Mobile Camera Scan`}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-140px)] space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-indigo-50/70 dark:bg-indigo-950/30 p-3.5 rounded-xl border border-indigo-100 dark:border-indigo-900/50 text-sm">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setBatchMode(!batchMode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  batchMode 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {batchMode ? 'Switch to Single Table' : `Batch Print All Tables (${allTables.length})`}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <Printer className="w-3.5 h-3.5" /> Print Table Stand(s)
              </button>
              {!batchMode && (
                <button
                  type="button"
                  onClick={handleDownloadQr}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> PNG
                </button>
              )}
            </div>
          </div>

          {/* Wi-Fi & Config options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-medium text-slate-600 dark:text-slate-300 mb-1">Wi-Fi Name (SSID) on Stand:</label>
              <input 
                type="text" 
                value={wifiSsid} 
                onChange={(e) => setWifiSsid(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="e.g. Bistro_Guest_WiFi"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-600 dark:text-slate-300 mb-1">Wi-Fi Password on Stand:</label>
              <input 
                type="text" 
                value={wifiPassword} 
                onChange={(e) => setWifiPassword(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="e.g. welcome123"
              />
            </div>
          </div>

          {/* Stand Preview / Printable Card Area */}
          <div ref={printAreaRef} className="printable-tent-cards space-y-8">
            {!batchMode && table && (
              <div className="mx-auto max-w-sm bg-gradient-to-b from-white via-white to-slate-50 dark:from-slate-800 dark:to-slate-800/90 border-2 border-indigo-500/30 rounded-3xl p-6 shadow-xl text-center relative overflow-hidden">
                {/* Decorative header */}
                <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                <div className="mt-2 flex items-center justify-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
                    T
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight">TalkOS Kitchen & Bistro</span>
                </div>

                <div className="my-4 inline-block px-4 py-1.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-extrabold text-sm rounded-full tracking-wide">
                  {table.tableNumber}
                </div>

                <h4 className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  Scan to Order at Table
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                  No app download needed. Open your phone camera to view full live menu, customize, & order directly.
                </p>

                {/* QR Container */}
                <div className="my-5 p-3 bg-white rounded-2xl shadow-md border border-slate-200 inline-block">
                  {qrDataUrl ? (
                    <img src={qrDataUrl} alt={`QR for Table ${table.tableNumber}`} className="w-56 h-56 mx-auto object-contain" />
                  ) : (
                    <div className="w-56 h-56 flex items-center justify-center text-slate-400 text-xs">Generating QR...</div>
                  )}
                </div>

                {/* Instructions Steps */}
                <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-slate-700 pt-3">
                  <div className="flex flex-col items-center">
                    <Smartphone className="w-4 h-4 text-indigo-600 mb-1" />
                    <span className="font-bold">1. Scan QR</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Utensils className="w-4 h-4 text-purple-600 mb-1" />
                    <span className="font-bold">2. Pick Food</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-white font-bold text-[9px] flex items-center justify-center mb-1">✓</span>
                    <span className="font-bold">3. Prepared Fresh</span>
                  </div>
                </div>

                {/* Optional Guest WiFi */}
                {wifiSsid && (
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="inline-flex items-center gap-1 font-medium">
                      <Wifi className="w-3.5 h-3.5 text-indigo-500" /> {wifiSsid}
                    </span>
                    {wifiPassword && (
                      <span className="text-slate-400 dark:text-slate-500">• Pass: <strong className="text-slate-700 dark:text-slate-300">{wifiPassword}</strong></span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Batch Print All Cards */}
            {batchMode && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {allQrs.map(({ table: t, qr }) => (
                  <div key={t.id} className="bg-white border-2 border-slate-300 rounded-2xl p-4 text-center shadow-sm break-inside-avoid">
                    <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">TalkOS Bistro</div>
                    <div className="text-lg font-black text-indigo-600 my-1">{t.tableNumber}</div>
                    <p className="text-[10px] text-slate-500">Scan camera to order</p>
                    <img src={qr} alt={`QR ${t.tableNumber}`} className="w-36 h-36 mx-auto my-2 border border-slate-200 rounded-lg p-1 bg-white" />
                    <div className="text-[9px] text-slate-500">WiFi: {wifiSsid} • Pass: {wifiPassword}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Link Bar */}
          {!batchMode && table && (
            <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs">
              <span className="font-mono text-slate-600 dark:text-slate-300 truncate max-w-xs">{currentUrl}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-200 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy URL'}
                </button>
                <a
                  href={currentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Test In Tab
                </a>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
