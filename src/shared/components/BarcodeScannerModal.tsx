import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, Barcode, Check, AlertCircle } from 'lucide-react';
import { hardwareService } from '../../core/hardware/hardwareService';

interface BarcodeScannerModalProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
}

export function BarcodeScannerModal({ onScan, onClose }: BarcodeScannerModalProps) {
  const [manualCode, setManualCode] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setCameraError(null);
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Camera API is not supported on this browser or platform');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError('Camera access unavailable. You can enter the barcode SKU manually below.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      hardwareService.emitBarcodeScanned(manualCode.trim());
      onScan(manualCode.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white border-2 border-[#ebd5da] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden text-[#800000] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#800000] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Barcode className="w-5 h-5 text-white" />
            <h3 className="text-base font-black tracking-wide">Barcode / QR Scanner</h3>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-1 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Viewfinder Area */}
        <div className="relative bg-black h-64 flex flex-col items-center justify-center overflow-hidden">
          {cameraActive ? (
            <video 
              ref={videoRef} 
              className="w-full h-full object-cover" 
              playsInline 
              muted 
            />
          ) : (
            <div className="p-6 text-center text-white/70 space-y-2">
              <Camera className="w-12 h-12 mx-auto text-white/40 mb-2" />
              <p className="text-xs font-semibold">{cameraError || 'Initializing camera...'}</p>
            </div>
          )}

          {/* Viewfinder Target Overlay */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-56 h-36 border-2 border-dashed border-red-500 rounded-xl relative shadow-2xl animate-pulse">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-red-500/80 -translate-y-1/2"></div>
            </div>
          </div>
        </div>

        {/* Manual Barcode Entry Form */}
        <div className="p-4 bg-[#fdf5f6] space-y-3">
          <p className="text-xs text-[#800000]/80 font-bold text-center">
            Align barcode inside red box or enter SKU below
          </p>

          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <input
              type="text"
              autoFocus
              placeholder="Enter Barcode / Item SKU..."
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              className="flex-1 px-3 py-2 text-xs font-bold bg-white border border-[#ebd5da] rounded-xl text-[#800000] focus:ring-2 focus:ring-[#800000] focus:outline-none"
            />
            <button
              type="submit"
              disabled={!manualCode.trim()}
              className="px-4 py-2 bg-[#800000] text-white text-xs font-black rounded-xl hover:bg-[#680016] disabled:opacity-40 transition-colors cursor-pointer"
            >
              Add Item
            </button>
          </form>

          {/* Quick SKU simulation buttons for testing */}
          <div className="pt-2 border-t border-[#ebd5da]/60">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#800000]/60 block mb-1.5">
              Quick Test Barcodes:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { code: 'prod_chow_chicken', name: 'Chicken Chowmein' },
                { code: 'prod_fr_chicken', name: 'Chicken Fried Rice' },
                { code: 'prod_chilly_dry', name: 'Chicken Chilly' },
              ].map(item => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => {
                    hardwareService.emitBarcodeScanned(item.code);
                    onScan(item.code);
                    onClose();
                  }}
                  className="px-2 py-1 text-[11px] font-bold bg-white border border-[#ebd5da] rounded-lg text-[#800000] hover:bg-[#800000] hover:text-white transition-colors cursor-pointer"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
