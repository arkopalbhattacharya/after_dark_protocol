import { useEffect } from 'react';

interface PurgeModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function PurgeModal({ isOpen, onConfirm, onClose }: PurgeModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'n' || e.key === 'N') {
        onClose();
      } else if (e.key === 'y' || e.key === 'Y' || e.key === 'Enter') {
        onConfirm();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onConfirm, onClose]);

  if (!isOpen) return null;

  const skeletonAscii = `     .... NO! ...                  ... MNO! ...
   ..... MNO!! ...................... MNNOO! ...
 ..... MMNO! ......................... MNNOO!! .
.... MNOONNOO!   MMMMMMMMMMPPPOII!   MNNO!!!! .
 ... !O! NNO! MMMMMMMMMMMMMPPPOOOII!! NO! ....
    ...... ! MMMMMMMMMMMMMPPPPOOOOIII! ! ...
   ........ MMMMMMMMMMMMPPPPPOOOOOOII!! .....
   ........ MMMMMOOOOOOPPPPPPPPOOOOMII! ...
    ....... MMMMM..    OPPMMP    .,OMI! ....
     ...... MMMM::   o.,OPMP,.o   ::I!! ...
         .... NNM:::.,,OOPM!P,.::::!! ....
          .. MMNNNNNOOOOPMO!!IIPPO!!O! .....
         ... MMMMMNNNNOO:!!:!!IPPPPOO! ....
           .. MMMMMNNOOMMNNIIIPPPOO!! ......
          ...... MMMONNMMNNNIIIOO!..........
       ....... MN MOMMMNNNIIIIIO! OO ..........
    ......... MNO! IiiiiiiiiiiiI OOOO ...........
  ...... NNN.MNO! . O!!!!!!!!!O . OONO NO! ........
   .... MNNNNNO! ...OOOOOOOOOOO .  MMNNON!........
   ...... MNNNNO! .. PPPPPPPPP .. MMNON!........
      ...... OO! ................. ON! .......
         ................................`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in font-mono">
      {/* Click outside to cancel */}
      <div className="fixed inset-0" onClick={onClose}></div>

      {/* Phosphor Green CRT Window */}
      <div 
        className="relative z-10 w-full max-w-2xl bg-[#020d04] border-2 border-[#33ff00] text-[#33ff00] shadow-[0_0_40px_rgba(51,255,0,0.5),inset_0_0_20px_rgba(51,255,0,0.15)] flex flex-col overflow-hidden select-none"
        style={{ textShadow: '0 0 7px rgba(51,255,0,0.85)' }}
      >
        {/* CRT Scanline Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(51,255,0,0.15)_2px,rgba(51,255,0,0.15)_4px)] z-20"></div>

        {/* Header Bar */}
        <div className="bg-[#05240a] border-b-2 border-[#33ff00] px-4 py-2 flex justify-between items-center text-xs tracking-widest font-bold z-30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#ff3333] animate-pulse">warning</span>
            <span>[SYS_MEM_PURGE // LEVEL-5_OVERRIDE]</span>
          </div>
          <button
            onClick={onClose}
            className="px-2 py-0.5 border border-[#33ff00] bg-transparent text-[#33ff00] hover:bg-[#33ff00] hover:text-[#020d04] font-bold transition-all text-xs cursor-pointer"
          >
            [X] ESC
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 md:p-6 space-y-4 z-30">
          {/* Skeleton Danger ASCII Art - Centered Fit-Content Container with 5x Flicker */}
          <div className="w-full flex justify-center overflow-x-auto">
            <div className="w-fit border p-3 text-[9px] sm:text-[10px] md:text-[11px] font-bold whitespace-pre shadow-inner text-left ascii-alarm-flicker">
              <pre 
                style={{ 
                  fontFamily: "'Courier New', Courier, monospace",
                  lineHeight: 1.15,
                  letterSpacing: '0px',
                  textAlign: 'left'
                }}
              >
                {skeletonAscii}
              </pre>
            </div>
          </div>

          {/* Nerdy Cyberpunk Warning Message */}
          <div className="space-y-2 text-xs border-y border-[#33ff00]/30 py-3">
            <div className="flex items-center gap-2 font-bold">
              <span className="animate-ping text-[#ff3333]">●</span>
              <span className="text-[#ff4444] tracking-wide">&gt;&gt; CRITICAL OVERRIDE: PURGE LOCAL DATAFRAME</span>
            </div>
            
            <p className="text-[#33ff00]/90 leading-relaxed text-[11px]">
              OPERATOR DIRECTIVE: Executing this demagnetization will zero-fill all indexed AI lab trials, caffeine brews, workout biometrics, duty rosters, and freeform logs stored within disk block <code className="bg-[#052b0c] px-1 text-[#33ff00] border border-[#33ff00]/40">[after_dark_logs]</code>.
            </p>
            
            <p className="text-[#33ff00]/70 text-[10px] italic">
              Magnetic degaussing is permanent. All cluster partitions will reset to raw unallocated 0x00 space.
            </p>
          </div>

          {/* Action Confirmation Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-1/2 py-2 px-3 border border-[#33ff00] bg-[#041e08] text-[#33ff00] hover:bg-[#33ff00] hover:text-[#020d04] font-bold transition-all text-xs cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_0_10px_rgba(51,255,0,0.2)]"
            >
              <span className="material-symbols-outlined text-[14px]">shield</span>
              <span>[ ABORT // KEEP DATA (N) ]</span>
            </button>

            <button
              type="button"
              onClick={onConfirm}
              className="w-full sm:w-1/2 py-2 px-3 border-2 border-[#ff3333] bg-[#2a0004] text-[#ff4444] hover:bg-[#ff2222] hover:text-[#000] font-bold transition-all text-xs cursor-pointer shadow-[0_0_18px_rgba(255,51,51,0.6)] flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[14px]">delete_forever</span>
              <span>[ PURGE // ZERO_FILL (Y) ]</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
