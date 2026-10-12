import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Check } from 'lucide-react';

export function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Check if user previously dismissed
      const dismissed = localStorage.getItem('tott_pwa_dismissed');
      if (!dismissed) {
        setShowBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const [manualTip, setManualTip] = useState<string | null>(null);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      setManualTip('To install: on iOS Safari tap Share ➔ "Add to Home Screen". On Chrome/Edge click the Install icon in the address bar.');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('tott_pwa_dismissed', 'true');
  };

  if (!showBanner || isInstalled) return null;

  return (
    <div className="bg-[#800000] text-white px-4 py-2.5 flex items-center justify-between text-xs shadow-md z-40 animate-in slide-in-from-top duration-300">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
          <Smartphone className="w-4 h-4 text-white" />
        </div>
        <div>
          <span className="font-black text-sm block leading-tight">Install Talk of the Town POS</span>
          <span className="text-[11px] text-[#fbe6ea] font-medium">
            {manualTip || 'Install as a native desktop or mobile app with offline support'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleInstallClick}
          className="px-3 py-1.5 rounded-lg bg-white text-[#800000] font-black hover:bg-[#fee8eb] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          Install App
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          className="p-1 rounded hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
