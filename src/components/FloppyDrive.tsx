import floppyDiskSvg from '../assets/floppy-disk.svg';
import cassetteTapeSvg from '../assets/cassette-tape.svg';

interface FloppyDrivesProps {
  onOpenNotesModal: () => void;
  onOpenTranscriptModal: () => void;
  isCassetteUnlocked?: boolean;
  onOpenCassetteModal?: () => void;
}

export function FloppyDrive({ 
  onOpenNotesModal, 
  onOpenTranscriptModal, 
  isCassetteUnlocked = false, 
  onOpenCassetteModal 
}: FloppyDrivesProps) {
  return (
    <div className="fixed bottom-11 left-6 md:left-12 z-20 select-none flex items-end gap-3 pointer-events-auto">
      {/* DRIVE A:\ -- MISSION LOGS DATABASE (CYBER SKY BLUE) */}
      <div 
        className="group relative cursor-pointer flex flex-col items-center"
        onClick={() => {
          onOpenNotesModal();
        }}
        title="DRIVE A:\ 3.5-INCH DISKETTE - CLICK TO VIEW RAW DATABASE LOGS"
      >
        {/* Cyberpunk Sky Blue Container (No Text, 15px Top Padding to Inner Floppy) */}
        <div className="transition-all duration-300 ease-out transform translate-y-[30px] group-hover:translate-y-[-6px] bg-gradient-to-b from-[#38bdf8] to-[#0ea5e9] text-[#021827] border-x-2 border-b-2 border-[#0284c7] px-2.5 pt-[15px] pb-1.5 rounded-b-xs shadow-[0_0_14px_rgba(56,189,248,0.5),inset_0_0_8px_rgba(255,255,255,0.4)] group-hover:shadow-[0_0_22px_rgba(56,189,248,0.9),inset_0_0_12px_rgba(255,255,255,0.6)] relative flex flex-col items-center overflow-visible">
          {/* Micro CRT Scanline Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.6)_0px,rgba(0,0,0,0.6)_1px,transparent_1px,transparent_3px)]"></div>

          {/* Top Jagged / Torn Paper Serrated Edge in Glowing Sky Blue */}
          <div 
            className="absolute -top-1.5 left-0 right-0 h-1.5 bg-[#38bdf8] pointer-events-none shadow-[0_-2px_6px_rgba(56,189,248,0.8)]"
            style={{
              clipPath: 'polygon(0% 100%, 5% 0%, 10% 100%, 15% 0%, 20% 100%, 25% 0%, 30% 100%, 35% 0%, 40% 100%, 45% 0%, 50% 100%, 55% 0%, 60% 100%, 65% 0%, 70% 100%, 75% 0%, 80% 100%, 85% 0%, 90% 100%, 95% 0%, 100% 100%)'
            }}
          ></div>

          {/* Cyberpunk Rectangular Sprocket Holes */}
          <div className="absolute left-0.5 top-1 bottom-1 flex flex-col justify-between pointer-events-none opacity-70">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className="w-1.5 h-1.5 bg-[#0284c7] border border-[#38bdf8]/60 block shadow-[inset_0_0_2px_rgba(0,0,0,0.8)]"></span>
            ))}
          </div>
          <div className="absolute right-0.5 top-1 bottom-1 flex flex-col justify-between pointer-events-none opacity-70">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className="w-1.5 h-1.5 bg-[#0284c7] border border-[#38bdf8]/60 block shadow-[inset_0_0_2px_rgba(0,0,0,0.8)]"></span>
            ))}
          </div>

          {/* Inner 3.5-inch Floppy Diskette Graphic */}
          <div className="relative w-11 h-12 flex items-center justify-center p-0.5 z-10">
            <img 
              src={floppyDiskSvg} 
              alt="Drive A Diskette" 
              className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-105"
              style={{
                filter: 'brightness(1.15) contrast(1.1) drop-shadow(0 0 6px rgba(56,189,248,0.7))'
              }}
            />
          </div>
        </div>
      </div>

      {/* DRIVE B:\ -- SYNTHO_TRON CHAT TRANSCRIPT (CYBER LIME GREEN) */}
      <div 
        className="group relative cursor-pointer flex flex-col items-center"
        onClick={() => {
          onOpenTranscriptModal();
        }}
        title="DRIVE B:\ 3.5-INCH DISKETTE (LIME) - CLICK TO VIEW CHAT TRANSCRIPT"
      >
        {/* Cyberpunk Lime Green Container (No Text, 15px Top Padding to Inner Floppy) */}
        <div className="transition-all duration-300 ease-out transform translate-y-[30px] group-hover:translate-y-[-6px] bg-gradient-to-b from-[#a3e635] to-[#65a30d] text-[#051c02] border-x-2 border-b-2 border-[#4d7c0f] px-2.5 pt-[15px] pb-1.5 rounded-b-xs shadow-[0_0_14px_rgba(163,230,53,0.5),inset_0_0_8px_rgba(255,255,255,0.4)] group-hover:shadow-[0_0_22px_rgba(163,230,53,0.9),inset_0_0_12px_rgba(255,255,255,0.6)] relative flex flex-col items-center overflow-visible">
          {/* Micro CRT Scanline Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.6)_0px,rgba(0,0,0,0.6)_1px,transparent_1px,transparent_3px)]"></div>

          {/* Top Jagged / Torn Paper Serrated Edge in Glowing Lime */}
          <div 
            className="absolute -top-1.5 left-0 right-0 h-1.5 bg-[#a3e635] pointer-events-none shadow-[0_-2px_6px_rgba(163,230,53,0.8)]"
            style={{
              clipPath: 'polygon(0% 100%, 5% 0%, 10% 100%, 15% 0%, 20% 100%, 25% 0%, 30% 100%, 35% 0%, 40% 100%, 45% 0%, 50% 100%, 55% 0%, 60% 100%, 65% 0%, 70% 100%, 75% 0%, 80% 100%, 85% 0%, 90% 100%, 95% 0%, 100% 100%)'
            }}
          ></div>

          {/* Cyberpunk Rectangular Sprocket Holes */}
          <div className="absolute left-0.5 top-1 bottom-1 flex flex-col justify-between pointer-events-none opacity-70">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className="w-1.5 h-1.5 bg-[#4d7c0f] border border-[#a3e635]/60 block shadow-[inset_0_0_2px_rgba(0,0,0,0.8)]"></span>
            ))}
          </div>
          <div className="absolute right-0.5 top-1 bottom-1 flex flex-col justify-between pointer-events-none opacity-70">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className="w-1.5 h-1.5 bg-[#4d7c0f] border border-[#a3e635]/60 block shadow-[inset_0_0_2px_rgba(0,0,0,0.8)]"></span>
            ))}
          </div>

          {/* Inner 3.5-inch Floppy Diskette Graphic */}
          <div className="relative w-11 h-12 flex items-center justify-center p-0.5 z-10">
            <img 
              src={floppyDiskSvg} 
              alt="Drive B Diskette" 
              className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-105"
              style={{
                filter: 'brightness(1.15) contrast(1.1) drop-shadow(0 0 6px rgba(163,230,53,0.7))'
              }}
            />
          </div>
        </div>
      </div>

      {/* CLASSIFIED CASSETTE DECK // THE LOST CASSETTES OF JENNIFER (GLOWING & PULSATING CYBERPUNK RED) */}
      {isCassetteUnlocked && onOpenCassetteModal && (
        <div 
          className="group relative cursor-pointer flex flex-col items-center animate-fade-in"
          onClick={() => {
            onOpenCassetteModal();
          }}
          title="CLASSIFIED CASSETTE DECK: [ THE_JENNIFER_TAPES ] - UNLOCKED VIA CIPHER"
        >
          {/* Glowing and Pulsating Cyberpunk Red Container */}
          <div className="transition-all duration-300 ease-out transform translate-y-[30px] group-hover:translate-y-[-6px] bg-gradient-to-b from-[#ff0033] via-[#e6002e] to-[#99001f] text-[#ffffff] border-x-2 border-b-2 border-[#ff0033] px-2.5 pt-[15px] pb-1.5 rounded-b-xs shadow-[0_0_18px_rgba(255,0,51,0.7),inset_0_0_8px_rgba(255,255,255,0.4)] group-hover:shadow-[0_0_30px_rgba(255,0,51,1),inset_0_0_12px_rgba(255,255,255,0.7)] relative flex flex-col items-center overflow-visible animate-pulse">
            {/* Micro CRT Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.6)_0px,rgba(0,0,0,0.6)_1px,transparent_1px,transparent_3px)]"></div>

            {/* Top Jagged / Torn Paper Serrated Edge in Glowing Red */}
            <div 
              className="absolute -top-1.5 left-0 right-0 h-1.5 bg-[#ff0033] pointer-events-none shadow-[0_-2px_8px_rgba(255,0,51,0.9)]"
              style={{
                clipPath: 'polygon(0% 100%, 5% 0%, 10% 100%, 15% 0%, 20% 100%, 25% 0%, 30% 100%, 35% 0%, 40% 100%, 45% 0%, 50% 100%, 55% 0%, 60% 100%, 65% 0%, 70% 100%, 75% 0%, 80% 100%, 85% 0%, 90% 100%, 95% 0%, 100% 100%)'
              }}
            ></div>

            {/* Cyberpunk Rectangular Sprocket Holes */}
            <div className="absolute left-0.5 top-1 bottom-1 flex flex-col justify-between pointer-events-none opacity-80">
              {Array.from({ length: 4 }).map((_, i) => (
                <span key={i} className="w-1.5 h-1.5 bg-[#4d000f] border border-[#ff0033]/70 block shadow-[inset_0_0_2px_rgba(0,0,0,0.8)]"></span>
              ))}
            </div>
            <div className="absolute right-0.5 top-1 bottom-1 flex flex-col justify-between pointer-events-none opacity-80">
              {Array.from({ length: 4 }).map((_, i) => (
                <span key={i} className="w-1.5 h-1.5 bg-[#4d000f] border border-[#ff0033]/70 block shadow-[inset_0_0_2px_rgba(0,0,0,0.8)]"></span>
              ))}
            </div>

            {/* Inner Cassette Tape SVG Asset Graphic */}
            <div className="relative w-11 h-12 flex items-center justify-center p-0.5 z-10 -translate-y-[15px]">
              <img 
                src={cassetteTapeSvg} 
                alt="Classified Cassette Tape" 
                className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-105"
                style={{
                  filter: 'brightness(1.15) contrast(1.1) drop-shadow(0 0 8px rgba(255,0,51,0.85))'
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
