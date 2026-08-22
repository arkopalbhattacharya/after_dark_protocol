import { useEffect } from 'react';
import type { ThemeName } from '../types';

interface ThemeModalProps {
  isOpen: boolean;
  currentTheme: ThemeName;
  onSelectTheme: (theme: ThemeName) => void;
  onClose: () => void;
}

interface ThemeOption {
  id: ThemeName;
  key: string;
  name: string;
  codename: string;
  description: string;
  swatches: { name: string; color: string }[];
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'MIDNIGHT_V1.5',
    key: '1',
    name: 'MIDNIGHT_V1.5',
    codename: 'OBSIDIAN_PROTOCOL // NIGHT_CITY',
    description: 'High-contrast nocturnal terminal with neon cyan filaments and obsidian void.',
    swatches: [
      { name: 'Cyan', color: '#1edce0' },
      { name: 'Amber', color: '#fdaf00' },
      { name: 'Void', color: '#0a0e14' },
      { name: 'Panel', color: '#12171f' }
    ]
  },
  {
    id: 'MORNING_MIST_V1.0',
    key: '2',
    name: 'MORNING_MIST_V1.0',
    codename: 'OBSIDIAN_MORNING // SOLAR_LAB',
    description: 'Daylight laboratory aesthetic with solar white surfaces, deep teal, and amber alerts.',
    swatches: [
      { name: 'Teal', color: '#006970' },
      { name: 'Amber', color: '#feb700' },
      { name: 'Solar', color: '#ffffff' },
      { name: 'Slate', color: '#dfe3e7' }
    ]
  },
  {
    id: 'COMET_SUNSET_V1.0',
    key: '3',
    name: 'COMET_SUNSET_V1.0',
    codename: 'OBSIDIAN_SUNSET // GOLDEN_HOUR',
    description: 'Sweltering retro-vaporwave copper haze with golden amber and burnt orange emitters.',
    swatches: [
      { name: 'Amber', color: '#fdaf00' },
      { name: 'Copper', color: '#ea6b1e' },
      { name: 'Dark', color: '#180b06' },
      { name: 'Dusk', color: '#271812' }
    ]
  },
  {
    id: 'NEO_TWYLITE_V1.0',
    key: '4',
    name: 'NEO_TWYLITE_V1.0',
    codename: 'OBSIDIAN_TWILIGHT // ELECTRIC_VOID',
    description: 'Electric neon-magenta and cyan rays radiating against a deep indigo twilight matrix.',
    swatches: [
      { name: 'Magenta', color: '#ff00ff' },
      { name: 'Cyan', color: '#00eefc' },
      { name: 'Void', color: '#150629' },
      { name: 'Indigo', color: '#231437' }
    ]
  },
  {
    id: 'NEON_CITY_AFTERWORK',
    key: '5',
    name: 'NEON_CITY_AFTERWORK',
    codename: 'NEON_CITY // AFTER_HOURS',
    description: 'Electric bluish-purple neon emitters, neon yellow protocol typography, and neon teal status telemetry over deep twilight.',
    swatches: [
      { name: 'Blurple', color: '#8247ff' },
      { name: 'Yellow', color: '#fcee0a' },
      { name: 'Teal', color: '#008080' },
      { name: 'Void', color: '#150629' }
    ]
  }
];

export function ThemeModal({ 
  isOpen, 
  currentTheme, 
  onSelectTheme, 
  onClose
}: ThemeModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === '1') {
        onSelectTheme('MIDNIGHT_V1.5');
      } else if (e.key === '2') {
        onSelectTheme('MORNING_MIST_V1.0');
      } else if (e.key === '3') {
        onSelectTheme('COMET_SUNSET_V1.0');
      } else if (e.key === '4') {
        onSelectTheme('NEO_TWYLITE_V1.0');
      } else if (e.key === '5') {
        onSelectTheme('NEON_CITY_AFTERWORK');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onSelectTheme, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-mono">
      {/* Background click to dismiss */}
      <div className="fixed inset-0" onClick={onClose}></div>

      {/* Phosphor Green Terminal Window */}
      <div 
        className="relative z-10 w-full max-w-2xl bg-[#031405] border-2 border-[#33ff00] text-[#33ff00] shadow-[0_0_35px_rgba(51,255,0,0.4),inset_0_0_20px_rgba(51,255,0,0.1)] flex flex-col overflow-hidden"
        style={{ textShadow: '0 0 6px rgba(51,255,0,0.8)' }}
      >
        {/* Terminal Scanline Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-25 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(51,255,0,0.15)_2px,rgba(51,255,0,0.15)_4px)] z-20"></div>

        {/* Terminal Header Bar */}
        <div className="bg-[#062409] border-b-2 border-[#33ff00] px-4 py-2 flex justify-between items-center text-xs tracking-widest font-bold select-none z-30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#33ff00]">terminal</span>
            <span>[SYS_THEME_SUBSYSTEM // VT-220_PHOSPHOR_SCREEN]</span>
          </div>
          <button
            onClick={onClose}
            className="px-2 py-0.5 border border-[#33ff00] bg-transparent text-[#33ff00] hover:bg-[#33ff00] hover:text-[#031405] font-bold transition-all text-xs cursor-pointer"
          >
            [X] ESC
          </button>
        </div>

        {/* Terminal Body */}
        <div className="p-4 md:p-6 space-y-4 overflow-y-auto max-h-[80vh] z-30">
          {/* ASCII Banner */}
          <div className="text-[11px] leading-tight text-[#33ff00] opacity-90 border-b border-[#33ff00]/40 pb-2.5">
            <div className="font-bold tracking-wider">╔═══════════════════════════════════════════════════════════════╗</div>
            <div className="font-bold tracking-wider">║  &gt;&gt; SYSTEM COLOR MATRIX // SELECT ACTIVE PROTOCOL [1-5]       ║</div>
            <div className="font-bold tracking-wider">╚═══════════════════════════════════════════════════════════════╝</div>
            <div className="mt-2 text-[10px] text-[#33ff00]/70 flex justify-between">
              <span>DRIVER: PROTOCOL_STITCH_RENDERER_v4.2</span>
              <span>ACTIVE: [{currentTheme}]</span>
            </div>
          </div>

          {/* Theme List Grid */}
          <div className="grid grid-cols-1 gap-3">
            {THEME_OPTIONS.map((theme) => {
              const isActive = currentTheme === theme.id;
              return (
                <div
                  key={theme.id}
                  onClick={() => onSelectTheme(theme.id)}
                  className={`p-3 border transition-all cursor-pointer group flex flex-col gap-2 relative ${
                    isActive
                      ? 'bg-[#0b3810] border-[#33ff00] shadow-[0_0_15px_rgba(51,255,0,0.4)]'
                      : 'bg-[#041a07] border-[#33ff00]/40 hover:border-[#33ff00] hover:bg-[#072a0c]'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <span className="px-1.5 py-0.5 border border-[#33ff00] bg-[#031405] text-[#33ff00] text-xs">
                        [{theme.key}]
                      </span>
                      <span className="tracking-wide group-hover:underline">{theme.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isActive && (
                        <span className="px-2 py-0.5 bg-[#33ff00] text-[#031405] text-[10px] font-bold tracking-wider animate-pulse">
                          [ ACTIVE_PROFILE ]
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTheme(theme.id);
                        }}
                        className={`text-[10px] font-bold px-2 py-0.5 border ${
                          isActive
                            ? 'border-[#33ff00] bg-transparent text-[#33ff00]'
                            : 'border-[#33ff00]/50 text-[#33ff00] group-hover:bg-[#33ff00] group-hover:text-[#031405]'
                        } transition-colors`}
                      >
                        {isActive ? 'CURRENT' : '[ APPLY ]'}
                      </button>
                    </div>
                  </div>

                  <div className="text-[11px] text-[#33ff00]/80">
                    <span className="text-[#33ff00] font-semibold">{theme.codename}</span>
                    <p className="text-[10px] text-[#33ff00]/60 mt-0.5">{theme.description}</p>
                  </div>

                  {/* Swatches Preview */}
                  <div className="flex items-center gap-2 pt-1 border-t border-[#33ff00]/20">
                    <span className="text-[9px] text-[#33ff00]/50 tracking-wider">PALETTE_PREVIEW:</span>
                    <div className="flex gap-1.5 items-center">
                      {theme.swatches.map((swatch, sIdx) => (
                        <div
                          key={sIdx}
                          className="flex items-center gap-1 bg-[#020b03] border border-[#33ff00]/30 px-1.5 py-0.5 text-[9px]"
                          title={`${swatch.name}: ${swatch.color}`}
                        >
                          <span
                            className="w-2.5 h-2.5 inline-block border border-black"
                            style={{ backgroundColor: swatch.color }}
                          ></span>
                          <span className="text-[9px] text-[#33ff00]/80">{swatch.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Command Prompt Line */}
          <div className="border border-[#33ff00]/50 p-2.5 bg-[#041a07] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#33ff00]">&gt; PROMPT:</span>
              <span className="text-[#33ff00]/90">PRESS [1-5] OR CLICK PROFILE TO EXECUTE MATRIX</span>
              <span className="inline-block w-2 h-3.5 bg-[#33ff00] animate-pulse"></span>
            </div>
            <button
              onClick={onClose}
              className="bg-[#33ff00] text-[#031405] font-bold px-3 py-1 text-xs hover:bg-[#66ff33] transition-colors cursor-pointer"
            >
              [ DISMISS // ESC ]
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
