import { useState } from 'react';
import type { ProtocolLogEntry } from '../types';
import { getCategoryMeta } from '../config/logCategories';
import { exportLogNoteStubToPng } from '../utils/exportLogNoteStub';

interface DotMatrixNoteStubProps {
  log: ProtocolLogEntry;
  userEmail?: string | null;
  onClose?: () => void;
}

export function DotMatrixNoteStub({ log, userEmail, onClose }: DotMatrixNoteStubProps) {
  const [isExporting, setIsExporting] = useState(false);
  const meta = getCategoryMeta(log.category);

  const formattedTime = (() => {
    try {
      const d = new Date(log.timestamp);
      return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } catch {
      return log.timestamp;
    }
  })();

  const handleCaptureBuffer = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExporting(true);
    exportLogNoteStubToPng(log, userEmail);
    setTimeout(() => {
      setIsExporting(false);
    }, 600);
  };

  const rawPayload = log.payload || {};
  const entries = Object.entries(rawPayload);

  return (
    <div 
      className="mt-2.5 mb-1 relative overflow-hidden border border-dashed border-[#166534]/50 shadow-lg animate-fade-in font-mono select-none"
      style={{
        backgroundColor: '#f6faf4', // Pale continuous form computer paper
        color: '#14381e' // 9-pin/24-pin dark green dot matrix ribbon ink
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Top Perforation Serration */}
      <div className="h-1.5 w-full border-b border-dashed border-[#166534]/40 bg-[#edf5eb] flex items-center justify-center">
        <span className="text-[7px] tracking-[4px] text-[#166534]/50 font-bold">----------------------------------</span>
      </div>

      {/* Main Continuous Feed Sheet Layout with Left and Right Tractor Strips */}
      <div className="flex relative">
        {/* LEFT TRACTOR FEED PERFORATION STRIP */}
        <div className="w-6 shrink-0 border-r border-dashed border-[#166534]/30 bg-[#edf5eb] flex flex-col items-center py-2 gap-2.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-[#dbe8d7] border border-[#166534]/35 shadow-inner"
              title="Tractor feed sprocket hole"
            />
          ))}
        </div>

        {/* CENTER PRINT CONTENT AREA */}
        <div className="flex-1 p-2.5 md:p-3 flex flex-col gap-2 min-w-0">
          {/* Header Banner */}
          <div className="border border-[#166534]/40 bg-[#e6f4e3] px-2 py-1 flex justify-between items-center text-[9px] font-black tracking-wider text-[#0e2f17]">
            <div className="flex items-center gap-1.5 truncate">
              <span className="material-symbols-outlined text-[13px] text-[#166534]">print</span>
              <span className="truncate">EPSON LX-800 // DOT_MATRIX_DISPATCH</span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[8.5px] px-1 py-0.2 bg-[#d4ebd0] border border-[#166534]/40 font-mono">
                ADP-{log.id.slice(0, 6).toUpperCase()}
              </span>
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="hover:text-red-600 font-bold px-1 text-[9px] cursor-pointer"
                  title="Close printable stub"
                >
                  [✕]
                </button>
              )}
            </div>
          </div>

          {/* Log Title & Metadata */}
          <div className="space-y-1 border-b border-[#166534]/20 pb-2">
            <div className="flex justify-between items-start text-[10px] font-bold text-[#1b4324]">
              <span className="tracking-wider">[{meta?.group || 'LOG'}] // {meta?.badge || log.category}</span>
              <span className="text-[9px] text-[#2c6138]">{formattedTime}</span>
            </div>

            <div className="text-xs font-black tracking-wide text-[#081e0f] break-words">
              &gt; {log.title}
            </div>
          </div>

          {/* Payload Data Table Entries */}
          <div className="space-y-1.5 text-[10px] text-[#14381e] my-0.5">
            <div className="text-[8.5px] font-black uppercase text-[#23582f] tracking-widest">
              --- TELEMETRY DATA ENTRIES ---
            </div>

            {entries.length === 0 ? (
              <div className="text-[9px] italic text-[#4a6b52] pl-2">
                (NO ADDITIONAL TELEMETRY FIELDS)
              </div>
            ) : (
              <div className="space-y-1 pl-1">
                {entries.map(([k, v]) => (
                  <div key={k} className="flex flex-col border-b border-[#166534]/10 pb-1">
                    <span className="text-[9px] font-bold text-[#0c2a15] uppercase">
                      * {k.replace(/_/g, ' ')}:
                    </span>
                    <span className="text-[10px] text-[#174323] pl-2 break-words font-mono">
                      {Array.isArray(v)
                        ? v.map((item) => (typeof item === 'object' ? JSON.stringify(item) : String(item))).join(', ')
                        : typeof v === 'object' && v !== null
                        ? JSON.stringify(v)
                        : String(v)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Verification & Sign-off */}
          <div className="pt-1.5 border-t border-[#166534]/20 flex justify-between items-center text-[8.5px] text-[#23582f] font-mono">
            <span className="truncate">OP: {userEmail ? userEmail.split('@')[0] : 'ENCLAVE_USER'}</span>
            <span className="font-bold">24-PIN STRIKE // OK</span>
          </div>

          {/* Action Toolbar: [ CAPTURE BUFFER // SERVER TAPE ] Button */}
          <div className="pt-1 flex justify-end">
            <button
              type="button"
              onClick={handleCaptureBuffer}
              disabled={isExporting}
              className="px-2.5 py-1 bg-[#166534] text-white hover:bg-[#0e4822] text-[10px] font-black tracking-wider flex items-center gap-1.5 shadow transition-all cursor-pointer disabled:opacity-50"
              title="Download high-resolution dot matrix PNG with perforated edges"
            >
              <span className="material-symbols-outlined text-[13px]">
                {isExporting ? 'hourglass_top' : 'save_alt'}
              </span>
              <span>{isExporting ? 'CAPTURING...' : '[ CAPTURE BUFFER // SERVER TAPE ]'}</span>
            </button>
          </div>
        </div>

        {/* RIGHT TRACTOR FEED PERFORATION STRIP */}
        <div className="w-6 shrink-0 border-l border-dashed border-[#166534]/30 bg-[#edf5eb] flex flex-col items-center py-2 gap-2.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-[#dbe8d7] border border-[#166534]/35 shadow-inner"
              title="Tractor feed sprocket hole"
            />
          ))}
        </div>
      </div>

      {/* Bottom Perforation Serration */}
      <div className="h-1.5 w-full border-t border-dashed border-[#166534]/40 bg-[#edf5eb] flex items-center justify-center">
        <span className="text-[7px] tracking-[4px] text-[#166534]/50 font-bold">----------------------------------</span>
      </div>
    </div>
  );
}
