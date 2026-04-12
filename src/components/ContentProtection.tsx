import { useEffect, useRef, useState } from 'react';

export default function ContentProtection() {
  const [showCaptureShield, setShowCaptureShield] = useState(false);
  const hideTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const onContextMenu = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (target?.closest('img, [data-protect-media="true"]')) {
        event.preventDefault();
      }
    };

    const onDragStart = (event: DragEvent) => {
      const target = event.target as Element | null;
      if (target?.closest('img, [data-protect-media="true"]')) {
        event.preventDefault();
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const ctrlOrCmd = event.ctrlKey || event.metaKey;

      // Prevent common save/print shortcuts.
      if (ctrlOrCmd && (key === 's' || key === 'p')) {
        event.preventDefault();
      }

      // Basic devtools shortcut deterrent.
      if (ctrlOrCmd && event.shiftKey && (key === 'i' || key === 'j' || key === 'c')) {
        event.preventDefault();
      }

      if (ctrlOrCmd && key === 'u') {
        event.preventDefault();
      }

      // Screenshot deterrent (cannot fully block OS-level captures).
      if (event.key === 'PrintScreen') {
        setShowCaptureShield(true);

        if (hideTimerRef.current) {
          window.clearTimeout(hideTimerRef.current);
        }

        hideTimerRef.current = window.setTimeout(() => {
          setShowCaptureShield(false);
        }, 1200);
      }
    };

    document.addEventListener('contextmenu', onContextMenu);
    document.addEventListener('dragstart', onDragStart);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('contextmenu', onContextMenu);
      document.removeEventListener('dragstart', onDragStart);
      document.removeEventListener('keydown', onKeyDown);

      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  return showCaptureShield ? (
    <div className="capture-shield" aria-hidden="true">
      LindasGT.com
    </div>
  ) : null;
}
