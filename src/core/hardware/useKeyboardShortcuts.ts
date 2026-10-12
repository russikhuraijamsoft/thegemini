import { useEffect } from 'react';

export interface ShortcutHandlers {
  onNewSale?: () => void;
  onHoldOrder?: () => void;
  onHistory?: () => void;
  onSettle?: () => void;
  onKickDrawer?: () => void;
  onEscape?: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if modifier keys like Ctrl/Meta are held (unless intended)
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      switch (e.key) {
        case 'F2':
          e.preventDefault();
          handlers.onNewSale?.();
          break;
        case 'F4':
          e.preventDefault();
          handlers.onHoldOrder?.();
          break;
        case 'F8':
          e.preventDefault();
          handlers.onHistory?.();
          break;
        case 'F9':
          e.preventDefault();
          handlers.onSettle?.();
          break;
        case 'F10':
          e.preventDefault();
          handlers.onKickDrawer?.();
          break;
        case 'Escape':
          handlers.onEscape?.();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}
