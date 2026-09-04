import { useState, useEffect } from 'react';
import {
  MONTH_NAMES,
  MONTH_ABBR,
  verifyCipherDate,
  type CipherDate
} from '../utils/cipherDate';

interface JenniferCipherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function JenniferCipherModal({ isOpen, onClose, onSuccess }: JenniferCipherModalProps) {
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [selectedMonth, setSelectedMonth] = useState<number>(1); // 1-12
  const [selectedYear, setSelectedYear] = useState<number>(2000);
  const [hasError, setHasError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Default initial date selector view
      setSelectedDay(1);
      setSelectedMonth(1);
      setSelectedYear(2000);
      setHasError(false);
      setIsSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Maximum days in selected month
  const getDaysInMonth = (m: number, y: number) => {
    return new Date(y, m, 0).getDate();
  };

  const maxDays = getDaysInMonth(selectedMonth, selectedYear);

  const stepDay = (delta: number) => {
    setSelectedDay((prev) => {
      let next = prev + delta;
      if (next < 1) next = maxDays;
      if (next > maxDays) next = 1;
      return next;
    });
  };

  const stepMonth = (delta: number) => {
    setSelectedMonth((prev) => {
      let next = prev + delta;
      if (next < 1) next = 12;
      if (next > 12) next = 1;
      return next;
    });
  };

  const stepYear = (delta: number) => {
    setSelectedYear((prev) => prev + delta);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const candidate: CipherDate = {
      day: selectedDay,
      month: selectedMonth,
      year: selectedYear
    };

    if (verifyCipherDate(candidate)) {
      setIsSuccess(true);
      setHasError(false);
      setTimeout(() => {
        onSuccess();
      }, 700);
    } else {
      // Triggers crimson red box and 5-cycle shake animation, then resets to normal
      setHasError(true);
      setTimeout(() => {
        setHasError(false);
      }, 850);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in font-mono select-none"
      style={{ textShadow: 'none' }}
    >
      <div className="fixed inset-0" onClick={onClose}></div>

      {/* Main Modal Box - Uses active theme variables normally; Shifts to Red & Shakes 5 times on Error */}
      <div 
        className={`relative z-10 w-full max-w-lg p-5 flex flex-col gap-4 overflow-hidden transition-colors duration-200 shadow-2xl ${
          hasError ? 'cipher-shake-5' : ''
        }`}
        style={{
          backgroundColor: hasError ? '#220308' : 'var(--bg-panel)',
          border: hasError ? '2px solid #ff0033' : '2px solid var(--color-primary)',
          color: hasError ? '#ff3366' : 'var(--text-on-surface)',
          boxShadow: hasError 
            ? '0 0 55px rgba(255, 0, 51, 0.75), inset 0 0 30px rgba(255, 0, 51, 0.35)' 
            : '0 0 40px var(--glow-color), inset 0 0 20px rgba(0, 0, 0, 0.5)'
        }}
      >
        {/* CRT Scanline Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            background: hasError
              ? 'repeating-linear-gradient(0deg, rgba(255, 0, 51, 0.4) 0px, rgba(255, 0, 51, 0.4) 1px, transparent 1px, transparent 3px)'
              : 'repeating-linear-gradient(0deg, var(--panel-scanline) 0px, var(--panel-scanline) 1px, transparent 1px, transparent 3px)'
          }}
        ></div>

        {/* Header Bar */}
        <div 
          className="flex justify-between items-center border-b pb-2 text-xs font-black tracking-widest"
          style={{ 
            borderColor: hasError ? 'rgba(255, 0, 51, 0.5)' : 'var(--border-primary)',
            color: hasError ? '#ff3366' : 'var(--color-primary)'
          }}
        >
          <div className="flex items-center gap-2">
            <span className={`material-symbols-outlined text-[17px] ${hasError ? 'animate-bounce text-[#ff0033]' : 'animate-pulse'}`}>
              {hasError ? 'warning' : 'lock_clock'}
            </span>
            <span>
              {hasError ? '[ ACCESS_DENIED // TEMPORAL_MISMATCH ]' : '[ TEMPORAL_CIPHER // CHRONO_LOCK ]'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-2 py-0.5 border font-bold text-xs cursor-pointer transition-colors"
            style={{
              borderColor: hasError ? '#ff0033' : 'var(--color-primary)',
              color: hasError ? '#ff3366' : 'var(--color-primary)',
              backgroundColor: 'transparent'
            }}
          >
            [X] ESC
          </button>
        </div>

        {/* Sub-banner Notice */}
        <div 
          className="border p-2 text-[10.5px] leading-relaxed font-mono"
          style={{
            backgroundColor: hasError ? '#35060d' : 'var(--bg-container-high)',
            borderColor: hasError ? '#ff0033' : 'var(--border-primary)',
            color: hasError ? '#ff99aa' : 'var(--text-on-surface-variant)'
          }}
        >
          {hasError 
            ? '> FATAL: TEMPORAL COORDINATES REJECTED. CHRONO-LOCK INITIATING RECOIL SHOCK.'
            : '> AUTHENTICATE HISTORICAL TEMPORAL COORDINATES (DAY / MONTH / YEAR) TO RELEASE MAGNETIC CASSETTE ROM INTERLOCKS.'}
        </div>

        {/* Retro Date Selector Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 my-1">
          {/* 3 Digital Stepper Dials: Day | Month | Year */}
          <div className="grid grid-cols-3 gap-3">
            {/* 1. DAY DIAL */}
            <div 
              className="border p-2.5 flex flex-col items-center gap-2"
              style={{
                backgroundColor: hasError ? '#30050c' : 'var(--bg-surface)',
                borderColor: hasError ? '#ff0033' : 'var(--border-primary)',
                boxShadow: hasError ? 'inset 0 0 15px rgba(255, 0, 51, 0.3)' : 'inset 0 0 12px rgba(0, 0, 0, 0.3)'
              }}
            >
              <span className="text-[9.5px] font-bold tracking-widest" style={{ color: hasError ? '#ff4d6d' : 'var(--color-primary)' }}>
                [ DAY ]
              </span>

              <button
                type="button"
                onClick={() => stepDay(1)}
                className="w-full py-1 border text-xs font-bold transition-colors cursor-pointer"
                style={{
                  borderColor: hasError ? '#ff0033' : 'var(--border-primary)',
                  backgroundColor: hasError ? 'rgba(255, 0, 51, 0.2)' : 'var(--bg-container-low)',
                  color: hasError ? '#ff99aa' : 'var(--color-primary)'
                }}
              >
                ▲ +1
              </button>

              <div 
                className="text-2xl font-black tracking-widest my-1 font-mono"
                style={{
                  color: hasError ? '#ff1744' : 'var(--color-primary)',
                  textShadow: hasError ? '0 0 10px rgba(255, 23, 68, 0.8)' : 'none'
                }}
              >
                {String(selectedDay).padStart(2, '0')}
              </div>

              <button
                type="button"
                onClick={() => stepDay(-1)}
                className="w-full py-1 border text-xs font-bold transition-colors cursor-pointer"
                style={{
                  borderColor: hasError ? '#ff0033' : 'var(--border-primary)',
                  backgroundColor: hasError ? 'rgba(255, 0, 51, 0.2)' : 'var(--bg-container-low)',
                  color: hasError ? '#ff99aa' : 'var(--color-primary)'
                }}
              >
                ▼ -1
              </button>
            </div>

            {/* 2. MONTH DIAL */}
            <div 
              className="border p-2.5 flex flex-col items-center gap-2"
              style={{
                backgroundColor: hasError ? '#30050c' : 'var(--bg-surface)',
                borderColor: hasError ? '#ff0033' : 'var(--border-primary)',
                boxShadow: hasError ? 'inset 0 0 15px rgba(255, 0, 51, 0.3)' : 'inset 0 0 12px rgba(0, 0, 0, 0.3)'
              }}
            >
              <span className="text-[9.5px] font-bold tracking-widest" style={{ color: hasError ? '#ff4d6d' : 'var(--color-primary)' }}>
                [ MONTH ]
              </span>

              <button
                type="button"
                onClick={() => stepMonth(1)}
                className="w-full py-1 border text-xs font-bold transition-colors cursor-pointer"
                style={{
                  borderColor: hasError ? '#ff0033' : 'var(--border-primary)',
                  backgroundColor: hasError ? 'rgba(255, 0, 51, 0.2)' : 'var(--bg-container-low)',
                  color: hasError ? '#ff99aa' : 'var(--color-primary)'
                }}
              >
                ▲ +1
              </button>

              <div className="flex flex-col items-center my-1">
                <span 
                  className="text-2xl font-black tracking-wider font-mono"
                  style={{
                    color: hasError ? '#ff1744' : 'var(--color-primary)',
                    textShadow: hasError ? '0 0 10px rgba(255, 23, 68, 0.8)' : 'none'
                  }}
                >
                  {MONTH_ABBR[selectedMonth - 1]}
                </span>
              </div>

              <button
                type="button"
                onClick={() => stepMonth(-1)}
                className="w-full py-1 border text-xs font-bold transition-colors cursor-pointer"
                style={{
                  borderColor: hasError ? '#ff0033' : 'var(--border-primary)',
                  backgroundColor: hasError ? 'rgba(255, 0, 51, 0.2)' : 'var(--bg-container-low)',
                  color: hasError ? '#ff99aa' : 'var(--color-primary)'
                }}
              >
                ▼ -1
              </button>
            </div>

            {/* 3. YEAR DIAL */}
            <div 
              className="border p-2.5 flex flex-col items-center gap-2"
              style={{
                backgroundColor: hasError ? '#30050c' : 'var(--bg-surface)',
                borderColor: hasError ? '#ff0033' : 'var(--border-primary)',
                boxShadow: hasError ? 'inset 0 0 15px rgba(255, 0, 51, 0.3)' : 'inset 0 0 12px rgba(0, 0, 0, 0.3)'
              }}
            >
              <span className="text-[9.5px] font-bold tracking-widest" style={{ color: hasError ? '#ff4d6d' : 'var(--color-primary)' }}>
                [ YEAR ]
              </span>

              <button
                type="button"
                onClick={() => stepYear(1)}
                className="w-full py-1 border text-xs font-bold transition-colors cursor-pointer"
                style={{
                  borderColor: hasError ? '#ff0033' : 'var(--border-primary)',
                  backgroundColor: hasError ? 'rgba(255, 0, 51, 0.2)' : 'var(--bg-container-low)',
                  color: hasError ? '#ff99aa' : 'var(--color-primary)'
                }}
              >
                ▲ +1
              </button>

              <div 
                className="text-2xl font-black tracking-widest my-1 font-mono"
                style={{
                  color: hasError ? '#ff1744' : 'var(--color-primary)',
                  textShadow: hasError ? '0 0 10px rgba(255, 23, 68, 0.8)' : 'none'
                }}
              >
                {selectedYear}
              </div>

              <button
                type="button"
                onClick={() => stepYear(-1)}
                className="w-full py-1 border text-xs font-bold transition-colors cursor-pointer"
                style={{
                  borderColor: hasError ? '#ff0033' : 'var(--border-primary)',
                  backgroundColor: hasError ? 'rgba(255, 0, 51, 0.2)' : 'var(--bg-container-low)',
                  color: hasError ? '#ff99aa' : 'var(--color-primary)'
                }}
              >
                ▼ -1
              </button>
            </div>
          </div>

          {/* Staged Date Coordinate Readout */}
          <div 
            className="border px-3 py-2 flex justify-between items-center text-xs"
            style={{
              backgroundColor: hasError ? '#1a0205' : 'var(--bg-container-low)',
              borderColor: hasError ? '#ff0033' : 'var(--border-primary)'
            }}
          >
            <span style={{ color: hasError ? '#ff99aa' : 'var(--text-on-surface-variant)' }}>STAGED_COORDINATE:</span>
            <span className="font-bold tracking-widest" style={{ color: hasError ? '#ff1744' : 'var(--text-on-surface)' }}>
              {String(selectedDay).padStart(2, '0')} {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
            </span>
          </div>

          {/* Status Diagnostic Message */}
          {hasError && (
            <div className="text-[#ffffff] bg-[#ff0033] border border-[#ff0033] py-1.5 px-3 text-xs font-black tracking-widest text-center shadow-[0_0_15px_rgba(255,0,51,0.8)]">
              [ ERR // CHRONO_MISMATCH: INVALID_TEMPORAL_COORDINATES ]
            </div>
          )}

          {isSuccess && (
            <div 
              className="border py-1.5 px-3 text-xs font-bold tracking-widest animate-pulse text-center"
              style={{
                borderColor: 'var(--color-primary)',
                backgroundColor: 'color-mix(in srgb, var(--color-primary) 20%, transparent)',
                color: 'var(--color-primary)'
              }}
            >
              [ ACCESS_GRANTED // UNLOCKING JENNIFER CASSETTE ARCHIVE... ]
            </div>
          )}

          {/* Submit Action */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border font-bold text-xs transition-colors cursor-pointer"
              style={{
                borderColor: hasError ? '#ff0033' : 'var(--border-primary)',
                color: hasError ? '#ff99aa' : 'var(--text-on-surface)',
                backgroundColor: hasError ? 'transparent' : 'var(--bg-surface)'
              }}
            >
              [ CANCEL ]
            </button>
            <button
              type="submit"
              disabled={isSuccess}
              className="flex-[2] py-2 font-black text-xs tracking-widest transition-all cursor-pointer disabled:opacity-50"
              style={{
                backgroundColor: hasError ? '#ff0033' : 'var(--color-primary)',
                color: hasError ? '#ffffff' : 'var(--color-on-primary)',
                boxShadow: hasError ? '0 0 20px rgba(255, 0, 51, 0.8)' : '0 0 15px var(--glow-color)'
              }}
            >
              {hasError ? '[ RECOIL ERROR // SHIFTING ]' : '[ AUTHENTICATE CHRONO_LOCK ]'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
