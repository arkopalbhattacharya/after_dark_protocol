import { useState, useEffect, useMemo } from 'react';
import { MANUAL_SECTIONS } from '../data/manualData';

interface ManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ManualModal({ isOpen, onClose }: ManualModalProps) {
  const [activeSectionId, setActiveSectionId] = useState<string>('cold_boot_auth');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Tape replacement animation states
  const [tapePhaseIndex, setTapePhaseIndex] = useState(0);
  const [tapeProgress, setTapeProgress] = useState(38);
  const [reelFrame, setReelFrame] = useState(0);

  const TAPE_STATUS_PHASES = [
    'UNMOUNTING 9-TRACK MAGNETIC SPOOL // VOL_0x8086 [PARITY_DEGRADED]',
    'DETECTED IRREVERSIBLE CRC FLUX FAULTS IN SECTORS 00-42...',
    'ROBOTIC TAPE CAROUSEL: DISPATCHING REPLACEMENT SPOOL #ADP-8086-REV-B...',
    'THREADING 0.5" MAGNETIC TAPE LEADER ACROSS DUAL VACUUM TENSION COLUMNS...',
    'CALIBRATING AZIMUTH & DEGAUSSING READ/WRITE RECORDING HEADS...'
  ];

  const REEL_ANIM_FRAMES = [
    '  ( ◐ ) ═════════════════ [ TAPE_DRIVE_01: REELING ] ═════════════════ ( ◑ )  ',
    '  ( ◓ ) ═════════════════ [ TAPE_DRIVE_01: REELING ] ═════════════════ ( ◒ )  ',
    '  ( ◑ ) ═════════════════ [ TAPE_DRIVE_01: REELING ] ═════════════════ ( ◐ )  ',
    '  ( ◒ ) ═════════════════ [ TAPE_DRIVE_01: REELING ] ═════════════════ ( ◓ )  '
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Tape animation timer
  useEffect(() => {
    if (!isOpen) return;

    const reelInterval = setInterval(() => {
      setReelFrame((prev) => (prev + 1) % REEL_ANIM_FRAMES.length);
    }, 180);

    const progressInterval = setInterval(() => {
      setTapeProgress((prev) => {
        const next = prev + 1;
        if (next > 95) return 24;
        return next;
      });
    }, 350);

    const phaseInterval = setInterval(() => {
      setTapePhaseIndex((prev) => (prev + 1) % TAPE_STATUS_PHASES.length);
    }, 3200);

    return () => {
      clearInterval(reelInterval);
      clearInterval(progressInterval);
      clearInterval(phaseInterval);
    };
  }, [isOpen]);

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return MANUAL_SECTIONS;
    const q = searchQuery.toLowerCase();
    return MANUAL_SECTIONS.filter(
      (sec) =>
        sec.title.toLowerCase().includes(q) ||
        sec.category.toLowerCase().includes(q) ||
        sec.summary.toLowerCase().includes(q) ||
        sec.number.includes(q)
    );
  }, [searchQuery]);

  const activeSectionIndex = MANUAL_SECTIONS.findIndex((s) => s.id === activeSectionId);
  const activeSection = MANUAL_SECTIONS[activeSectionIndex >= 0 ? activeSectionIndex : 0];

  const handlePrev = () => {
    if (activeSectionIndex > 0) {
      setActiveSectionId(MANUAL_SECTIONS[activeSectionIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (activeSectionIndex < MANUAL_SECTIONS.length - 1) {
      setActiveSectionId(MANUAL_SECTIONS[activeSectionIndex + 1].id);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/90 backdrop-blur-md animate-fade-in font-mono select-none"
      style={{ textShadow: 'none' }}
    >
      <div className="fixed inset-0" onClick={onClose}></div>

      {/* Main Field Manual Container */}
      <div 
        className="relative z-10 w-full max-w-5xl h-[88vh] max-h-[850px] flex flex-col border-2 shadow-2xl overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-panel)',
          borderColor: 'var(--color-primary)',
          boxShadow: '0 0 45px var(--glow-color), inset 0 0 20px rgba(0, 0, 0, 0.6)'
        }}
      >
        {/* CRT Scanline Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20 z-20"
          style={{
            background: 'repeating-linear-gradient(0deg, var(--panel-scanline) 0px, var(--panel-scanline) 1px, transparent 1px, transparent 3px)'
          }}
        ></div>

        {/* 1. Header Bar */}
        <div 
          className="flex justify-between items-center px-4 py-2.5 border-b shrink-0 z-10"
          style={{
            backgroundColor: 'var(--bg-header)',
            borderColor: 'var(--border-primary)',
            color: 'var(--color-primary)'
          }}
        >
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[19px] animate-pulse">menu_book</span>
            <span className="font-bold text-xs md:text-sm tracking-widest uppercase truncate">
              [ MIL-STD-8086 // CLASSIFIED OPERATOR FIELD MANUAL ]
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-[10px] text-on-surface-variant font-bold">
              DOC_VER: 1.0.4 // ENCLAVE_CLEARANCE_LVL_4
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-2.5 py-1 border font-bold text-xs cursor-pointer transition-colors"
              style={{
                borderColor: 'var(--border-primary)',
                color: 'var(--color-primary)',
                backgroundColor: 'var(--bg-surface)'
              }}
            >
              [X] ESC
            </button>
          </div>
        </div>

        {/* 2. Sub-Toolbar with Quick Search */}
        <div 
          className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 px-4 py-2 border-b shrink-0 z-10"
          style={{
            backgroundColor: 'var(--bg-container-high)',
            borderColor: 'var(--border-primary)'
          }}
        >
          <div className="flex items-center gap-2 text-xs font-bold" style={{ color: 'var(--color-primary)' }}>
            <span className="material-symbols-outlined text-[16px]">terminal</span>
            <span>SYSTEM MANUAL DIRECTORY & TECHNICAL CHEATSHEETS</span>
          </div>

          {/* Search Filter */}
          <div className="flex items-center border px-2 py-1 bg-black/40 min-w-[220px]" style={{ borderColor: 'var(--border-primary)' }}>
            <span className="text-[11px] mr-1.5 opacity-70" style={{ color: 'var(--color-primary)' }}>&gt;</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="FILTER CHAPTERS..."
              className="bg-transparent border-none outline-none text-xs font-mono w-full"
              style={{ color: 'var(--text-on-surface)' }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs opacity-70 hover:opacity-100 cursor-pointer ml-1"
                style={{ color: 'var(--color-primary)' }}
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* 3. Two-Pane Content Area (Dimmed underneath overlay) */}
        <div className="flex-1 flex overflow-hidden z-10 relative">
          {/* LEFT PANE: Chapter Navigation List (32% width) */}
          <div 
            className="w-72 sm:w-80 border-r flex flex-col overflow-y-auto shrink-0 opacity-40 blur-[0.5px]"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-primary)'
            }}
          >
            <div 
              className="p-2 border-b text-[10px] font-black tracking-widest uppercase flex justify-between items-center"
              style={{
                backgroundColor: 'var(--bg-container-low)',
                borderColor: 'var(--border-primary)',
                color: 'var(--color-primary)'
              }}
            >
              <span>CHAPTERS ({filteredSections.length})</span>
              <span className="text-[9px] opacity-75">SELECT_TO_READ</span>
            </div>

            <div className="divide-y" style={{ borderColor: 'var(--border-primary)' }}>
              {filteredSections.map((sec) => {
                const isActive = sec.id === activeSection.id;
                return (
                  <div
                    key={sec.id}
                    className="w-full text-left p-3 flex flex-col gap-1 border-l-4"
                    style={{
                      backgroundColor: isActive ? 'var(--bg-container-high)' : 'transparent',
                      borderLeftColor: isActive ? 'var(--color-primary)' : 'transparent',
                      color: isActive ? 'var(--color-primary)' : 'var(--text-on-surface)'
                    }}
                  >
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-mono font-black" style={{ color: isActive ? 'var(--color-primary)' : 'var(--text-on-surface-variant)' }}>
                        [{sec.number}] {sec.category}
                      </span>
                    </div>

                    <div className="text-xs font-black tracking-wide truncate">
                      {sec.title}
                    </div>

                    <div className="text-[10px] line-clamp-2 opacity-75 leading-relaxed" style={{ color: 'var(--text-on-surface-variant)' }}>
                      {sec.summary}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT PANE: Selected Chapter Document View (Dimmed) */}
          <div 
            className="flex-1 p-4 md:p-6 overflow-y-auto flex flex-col gap-5 leading-relaxed opacity-40 blur-[0.5px]"
            style={{
              backgroundColor: 'var(--bg-panel)',
              color: 'var(--text-on-surface)'
            }}
          >
            <div 
              className="border p-3.5 flex flex-col gap-1.5"
              style={{
                backgroundColor: 'var(--bg-container-high)',
                borderColor: 'var(--border-primary)'
              }}
            >
              <div className="flex justify-between items-center text-xs font-mono font-black" style={{ color: 'var(--color-primary)' }}>
                <span>CHAPTER {activeSection.number} // {activeSection.category}</span>
              </div>
              <h2 className="text-sm md:text-base font-black tracking-wider uppercase" style={{ color: 'var(--text-on-surface)' }}>
                {activeSection.content.heading}
              </h2>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RETRO 80s CYBERPUNK OVERLAY: MAGNETIC TAPE CORRUPTION & SPOOL REPLACEMENT */}
          {/* ========================================================================= */}
          <div className="absolute inset-0 z-30 bg-black/85 backdrop-blur-[2px] flex items-center justify-center p-4 md:p-8">
            <div 
              className="w-full max-w-2xl border-2 p-5 md:p-7 flex flex-col gap-5 shadow-[0_0_50px_rgba(255,183,3,0.3)] animate-fade-in relative overflow-hidden"
              style={{
                backgroundColor: 'var(--bg-panel)',
                borderColor: 'var(--color-primary)'
              }}
            >
              {/* Caution Hazard Top Ribbon */}
              <div 
                className="w-full h-3 border-b mb-1 opacity-90"
                style={{
                  background: 'repeating-linear-gradient(45deg, var(--color-primary) 0px, var(--color-primary) 12px, #000 12px, #000 24px)',
                  borderColor: 'var(--border-primary)'
                }}
              ></div>

              {/* Error Header Banner */}
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-3xl animate-bounce" style={{ color: '#ff0033' }}>
                  warning
                </span>
                <div>
                  <div className="text-xs font-mono font-black tracking-widest text-[#ff4d6d]">
                    [ CRITICAL // FATAL_CRC_ERROR 0x8086_BAD_SECTOR_CORRUPTION ]
                  </div>
                  <h1 className="text-sm md:text-base font-black tracking-wider uppercase" style={{ color: 'var(--color-primary)' }}>
                    ARCHIVAL MANUAL MAGNETIC SPOOL CORRUPTED
                  </h1>
                </div>
              </div>

              {/* Spinning Magnetic Tape Reel ASCII Box */}
              <div 
                className="border p-4 bg-black/60 flex flex-col items-center justify-center gap-2 font-mono text-center shadow-inner"
                style={{ borderColor: 'var(--border-primary)' }}
              >
                <div className="text-xs md:text-sm font-black tracking-widest text-[#33ff00] drop-shadow-[0_0_8px_rgba(51,255,0,0.6)]">
                  {REEL_ANIM_FRAMES[reelFrame]}
                </div>
                <div className="text-[10px] tracking-wider uppercase" style={{ color: 'var(--color-primary)' }}>
                  ROBOTIC TAPE LIBRARY // DRIVE_A: AUTOMATIC SPOOL SWAP IN PROGRESS
                </div>
              </div>

              {/* Dynamic Status Telemetry Stream */}
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between items-center text-[10px] text-on-surface-variant font-bold">
                  <span>TELEMETRY STATUS:</span>
                  <span className="text-[#33ff00] animate-pulse">● DRIVE_HEAD_ACTIVE</span>
                </div>

                <div 
                  className="border p-2.5 text-[11px] font-bold tracking-wide flex items-center gap-2 bg-black/40 min-h-[38px]"
                  style={{
                    borderColor: 'var(--border-primary)',
                    color: 'var(--text-on-surface)'
                  }}
                >
                  <span className="animate-pulse font-black" style={{ color: 'var(--color-primary)' }}>&gt;&gt;</span>
                  <span className="truncate">{TAPE_STATUS_PHASES[tapePhaseIndex]}</span>
                </div>
              </div>

              {/* Parity Rebuilding Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10.5px] font-mono font-bold" style={{ color: 'var(--color-primary)' }}>
                  <span>PARITY RECONSTRUCTION & BUFFER SYNCHRONIZATION:</span>
                  <span className="font-black">{tapeProgress}%</span>
                </div>
                <div 
                  className="w-full h-3 border bg-black/80 overflow-hidden"
                  style={{ borderColor: 'var(--border-primary)' }}
                >
                  <div 
                    className="h-full transition-all duration-300 shadow-[0_0_12px_var(--glow-color)]"
                    style={{
                      width: `${tapeProgress}%`,
                      backgroundColor: 'var(--color-primary)'
                    }}
                  ></div>
                </div>
              </div>

              {/* Informative Explanation Message */}
              <div 
                className="text-[11px] leading-relaxed p-3 border opacity-90"
                style={{
                  backgroundColor: 'var(--bg-container-low)',
                  borderColor: 'var(--border-primary)',
                  color: 'var(--text-on-surface-variant)'
                }}
              >
                <span className="font-bold" style={{ color: 'var(--color-primary)' }}>OPERATOR NOTICE:</span> Field Manual documentation sectors are undergoing full degaussing, magnetic tape reel replacement, and parity calibration. Manual guidance records will be restored upon calibration completion.
              </div>

              {/* Standby / Dismiss Action */}
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2 border font-mono font-bold text-xs tracking-widest uppercase transition-all cursor-pointer hover:scale-[1.02]"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    borderColor: 'var(--color-primary)',
                    color: 'var(--color-on-primary)',
                    boxShadow: '0 0 15px var(--glow-color)'
                  }}
                >
                  [ ACKNOWLEDGE // STANDBY (ESC) ]
                </button>
              </div>

              {/* Caution Hazard Bottom Ribbon */}
              <div 
                className="w-full h-2 border-t mt-1 opacity-90"
                style={{
                  background: 'repeating-linear-gradient(45deg, var(--color-primary) 0px, var(--color-primary) 12px, #000 12px, #000 24px)',
                  borderColor: 'var(--border-primary)'
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* 4. Footer Pagination Bar */}
        <div 
          className="flex justify-between items-center px-4 py-2 border-t shrink-0 z-10 text-xs font-mono"
          style={{
            backgroundColor: 'var(--bg-header)',
            borderColor: 'var(--border-primary)',
            color: 'var(--color-primary)'
          }}
        >
          <button
            type="button"
            onClick={handlePrev}
            disabled={activeSectionIndex <= 0}
            className="px-3 py-1 border font-bold hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            style={{ borderColor: 'var(--border-primary)' }}
          >
            [ ◀ PREV_CHAPTER ]
          </button>

          <span className="font-black text-[11px] tracking-widest hidden sm:inline">
            CHAPTER [ {activeSection.number} / {String(MANUAL_SECTIONS.length).padStart(2, '0')} ]
          </span>

          <button
            type="button"
            onClick={handleNext}
            disabled={activeSectionIndex >= MANUAL_SECTIONS.length - 1}
            className="px-3 py-1 border font-bold hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            style={{ borderColor: 'var(--border-primary)' }}
          >
            [ NEXT_CHAPTER ▶ ]
          </button>
        </div>
      </div>
    </div>
  );
}
