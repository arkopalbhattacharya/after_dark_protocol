import { useEffect, useState } from 'react';
import type { ProtocolLogEntry } from '../types';

interface FloppyNotesModalProps {
  isOpen: boolean;
  logs: ProtocolLogEntry[];
  onClose: () => void;
}

export function FloppyNotesModal({ isOpen, logs, onClose }: FloppyNotesModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'e' || e.key === 'E') {
        handleExportJson();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, logs, onClose]);

  if (!isOpen) return null;

  const rawJsonString = JSON.stringify(logs, null, 2);
  const totalBytes = new Blob([rawJsonString]).size;

  const handleExportJson = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(rawJsonString);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `after_dark_protocol_logs_backup_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch {
      // Ignore download errors
    }
  };

  const handleCopyClipboard = async () => {
    try {
      await navigator.clipboard.writeText(rawJsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard error fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in font-mono">
      {/* Background click to dismiss */}
      <div className="fixed inset-0" onClick={onClose}></div>

      {/* Phosphor Green CRT Window */}
      <div 
        className="relative z-10 w-full max-w-3xl bg-[#020d04] border-2 border-[#33ff00] text-[#33ff00] shadow-[0_0_40px_rgba(51,255,0,0.45),inset_0_0_20px_rgba(51,255,0,0.15)] flex flex-col overflow-hidden"
        style={{ textShadow: '0 0 6px rgba(51,255,0,0.85)' }}
      >
        {/* Terminal Scanline Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-25 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(51,255,0,0.15)_2px,rgba(51,255,0,0.15)_4px)] z-20"></div>

        {/* Terminal Header Bar */}
        <div className="bg-[#062409] border-b-2 border-[#33ff00] px-4 py-2 flex justify-between items-center text-xs tracking-widest font-bold select-none z-30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#33ff00]">save</span>
            <span>[DRIVE_A:\ // RAW_SECTOR_READER // MF2HD]</span>
          </div>
          <button
            onClick={onClose}
            className="px-2 py-0.5 border border-[#33ff00] bg-transparent text-[#33ff00] hover:bg-[#33ff00] hover:text-[#020d04] font-bold transition-all text-xs cursor-pointer"
          >
            [X] ESC
          </button>
        </div>

        {/* Terminal Body */}
        <div className="p-4 md:p-6 space-y-4 overflow-hidden flex flex-col max-h-[82vh] z-30">
          {/* ASCII Banner & Metadata */}
          <div className="text-[11px] leading-tight text-[#33ff00] opacity-90 border-b border-[#33ff00]/40 pb-3 shrink-0 select-none">
            <div className="font-bold tracking-wider hidden sm:block">╔═════════════════════════════════════════════════════════════════════════════╗</div>
            <div className="font-bold tracking-wider hidden sm:block">║ &gt;&gt; DISKETTE DRIVE A:\ [ 3.5&quot; 1.44MB ] -- RAW MISSION LOGS DATABASE BUFFER  ║</div>
            <div className="font-bold tracking-wider hidden sm:block">╚═════════════════════════════════════════════════════════════════════════════╝</div>
            <div className="mt-2 text-[10px] text-[#33ff00]/70 flex flex-wrap justify-between gap-2">
              <span>TOTAL_RECORDS: [{logs.length} LOGS]</span>
              <span>PAYLOAD_SIZE: [{totalBytes} BYTES]</span>
              <span>STATUS: [SECTORS_LOADED // READY]</span>
            </div>
          </div>

          {/* Raw JSON Code Viewer */}
          <div className="flex-1 min-h-[220px] max-h-[46vh] bg-[#010802] border border-[#33ff00]/50 p-3 overflow-auto rounded-xs shadow-[inset_0_0_15px_rgba(0,0,0,0.9)] custom-scrollbar">
            {logs.length === 0 ? (
              <div className="text-center py-12 text-[#33ff00]/50 text-xs italic">
                &gt;&gt; NO ACTIVE PROTOCOL LOGS FOUND IN SECTORS 0-79. DRIVE A:\ IS BLANK. &lt;&lt;
              </div>
            ) : (
              <pre className="font-mono text-[11px] text-[#33ff00] leading-relaxed whitespace-pre font-medium select-text">
                {rawJsonString}
              </pre>
            )}
          </div>

          {/* Terminal Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#33ff00]/40 shrink-0 select-none">
            <div className="text-[10px] text-[#33ff00]/60">
              PRESS <span className="text-[#33ff00] font-bold">[E]</span> TO EXPORT JSON
            </div>

            <div className="flex items-center gap-2.5">
              {/* Copy to Clipboard */}
              <button
                type="button"
                onClick={handleCopyClipboard}
                className="px-3 py-1.5 border border-[#33ff00] text-xs font-bold bg-[#041a06] hover:bg-[#33ff00] hover:text-[#020d04] transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_8px_rgba(51,255,0,0.2)]"
              >
                <span className="material-symbols-outlined text-[15px]">
                  {copied ? 'check' : 'content_copy'}
                </span>
                <span>{copied ? '[ COPIED! ]' : '[ COPY_JSON ]'}</span>
              </button>

              {/* Export Full JSON File */}
              <button
                type="button"
                onClick={handleExportJson}
                className="px-3.5 py-1.5 border-2 border-[#33ff00] text-xs font-bold bg-[#0b3810] text-[#33ff00] hover:bg-[#33ff00] hover:text-[#020d04] transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(51,255,0,0.4)]"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>[ 💾 EXPORT_FULL_JSON (E) ]</span>
              </button>
            </div>
          </div>

          {/* Nerdy Retro Hardware Asset Attribution Footer */}
          <div className="pt-2 border-t border-[#33ff00]/20 flex flex-wrap justify-between items-center text-[9px] text-[#33ff00]/60 font-mono tracking-tight shrink-0 select-text">
            <span>// HARDWARE_SILICON_DRIVER: DISKETTE_3.5_MF2HD</span>
            <span className="flex items-center gap-1">
              <span>ASSET_SOURCE:</span>
              <a 
                href="https://www.vecteezy.com/free-vector/floppy-disk" 
                target="_blank" 
                rel="noreferrer noopener"
                className="text-[#33ff00] underline hover:text-white hover:bg-[#33ff00]/20 px-1 py-0.5 transition-colors font-bold"
              >
                Floppy Disk Vectors by Vecteezy
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
