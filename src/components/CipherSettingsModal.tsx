import { useState, useEffect } from 'react';
import {
  MONTH_NAMES,
  MONTH_ABBR,
  DEFAULT_CIPHER_DATE,
  getStoredCipherPassDate,
  saveStoredCipherPassDate,
  type CipherDate
} from '../utils/cipherDate';

interface CipherSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CipherSettingsModal({ isOpen, onClose }: CipherSettingsModalProps) {
  const [day, setDay] = useState<number>(31);
  const [month, setMonth] = useState<number>(8);
  const [year, setYear] = useState<number>(2007);
  const [savedFeedback, setSavedFeedback] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const current = getStoredCipherPassDate();
      setDay(current.day);
      setMonth(current.month);
      setYear(current.year);
      setSavedFeedback(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getDaysInMonth = (m: number, y: number) => {
    return new Date(y, m, 0).getDate();
  };

  const maxDays = getDaysInMonth(month, year);

  const stepDay = (delta: number) => {
    setDay((prev) => {
      let next = prev + delta;
      if (next < 1) next = maxDays;
      if (next > maxDays) next = 1;
      return next;
    });
  };

  const stepMonth = (delta: number) => {
    setMonth((prev) => {
      let next = prev + delta;
      if (next < 1) next = 12;
      if (next > 12) next = 1;
      return next;
    });
  };

  const stepYear = (delta: number) => {
    setYear((prev) => prev + delta);
  };

  const handleReset = () => {
    setDay(DEFAULT_CIPHER_DATE.day);
    setMonth(DEFAULT_CIPHER_DATE.month);
    setYear(DEFAULT_CIPHER_DATE.year);
  };

  const handleSave = () => {
    const updated: CipherDate = {
      day,
      month,
      year
    };
    saveStoredCipherPassDate(updated);
    setSavedFeedback(true);
    setTimeout(() => {
      setSavedFeedback(false);
      onClose();
    }, 900);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-mono select-none"
      style={{ textShadow: 'none' }}
    >
      <div className="fixed inset-0" onClick={onClose}></div>

      <div 
        className="relative z-10 w-full max-w-lg border-2 p-5 flex flex-col gap-4 shadow-2xl overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-panel)',
          borderColor: 'var(--color-primary)',
          color: 'var(--text-on-surface)'
        }}
      >
        {/* Header Bar */}
        <div 
          className="flex justify-between items-center border-b pb-2 text-xs font-black tracking-widest"
          style={{
            borderColor: 'var(--border-primary)',
            color: 'var(--color-primary)'
          }}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">key</span>
            <span>[ SYS_CONFIG // CIPHER_CHRONO_LOCK_TARGET ]</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-2 py-0.5 border font-bold text-xs cursor-pointer transition-colors"
            style={{
              borderColor: 'var(--color-primary)',
              color: 'var(--color-primary)',
              backgroundColor: 'transparent'
            }}
          >
            [X] ESC
          </button>
        </div>

        {/* Info Banner */}
        <div 
          className="border p-2.5 text-[11px] leading-relaxed"
          style={{
            backgroundColor: 'var(--bg-container-high)',
            borderColor: 'var(--border-primary)',
            color: 'var(--text-on-surface-variant)'
          }}
        >
          &gt; CONFIGURE THE PASSCODE DATE FOR THE JENNIFER TAPES CHRONO-LOCK CIPHER (COMMAND: <code className="font-bold text-white">/jenny</code>). DEFAULT: <span className="font-bold text-white">31 AUGUST 2007</span>.
        </div>

        {/* 3 Digital Stepper Dials */}
        <div className="grid grid-cols-3 gap-3 my-1">
          {/* DAY */}
          <div 
            className="border p-2.5 flex flex-col items-center gap-2"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-primary)'
            }}
          >
            <span className="text-[9.5px] font-bold tracking-widest" style={{ color: 'var(--color-primary)' }}>
              [ DAY ]
            </span>

            <button
              type="button"
              onClick={() => stepDay(1)}
              className="w-full py-1 border text-xs font-bold transition-colors cursor-pointer"
              style={{
                borderColor: 'var(--border-primary)',
                backgroundColor: 'var(--bg-container-low)',
                color: 'var(--color-primary)'
              }}
            >
              ▲ +1
            </button>

            <div className="text-2xl font-black tracking-widest my-1 font-mono" style={{ color: 'var(--color-primary)' }}>
              {String(day).padStart(2, '0')}
            </div>

            <button
              type="button"
              onClick={() => stepDay(-1)}
              className="w-full py-1 border text-xs font-bold transition-colors cursor-pointer"
              style={{
                borderColor: 'var(--border-primary)',
                backgroundColor: 'var(--bg-container-low)',
                color: 'var(--color-primary)'
              }}
            >
              ▼ -1
            </button>
          </div>

          {/* MONTH */}
          <div 
            className="border p-2.5 flex flex-col items-center gap-2"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-primary)'
            }}
          >
            <span className="text-[9.5px] font-bold tracking-widest" style={{ color: 'var(--color-primary)' }}>
              [ MONTH ]
            </span>

            <button
              type="button"
              onClick={() => stepMonth(1)}
              className="w-full py-1 border text-xs font-bold transition-colors cursor-pointer"
              style={{
                borderColor: 'var(--border-primary)',
                backgroundColor: 'var(--bg-container-low)',
                color: 'var(--color-primary)'
              }}
            >
              ▲ +1
            </button>

            <div className="flex flex-col items-center my-1">
              <span className="text-2xl font-black tracking-wider font-mono" style={{ color: 'var(--color-primary)' }}>
                {MONTH_ABBR[month - 1]}
              </span>
            </div>

            <button
              type="button"
              onClick={() => stepMonth(-1)}
              className="w-full py-1 border text-xs font-bold transition-colors cursor-pointer"
              style={{
                borderColor: 'var(--border-primary)',
                backgroundColor: 'var(--bg-container-low)',
                color: 'var(--color-primary)'
              }}
            >
              ▼ -1
            </button>
          </div>

          {/* YEAR */}
          <div 
            className="border p-2.5 flex flex-col items-center gap-2"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-primary)'
            }}
          >
            <span className="text-[9.5px] font-bold tracking-widest" style={{ color: 'var(--color-primary)' }}>
              [ YEAR ]
            </span>

            <button
              type="button"
              onClick={() => stepYear(1)}
              className="w-full py-1 border text-xs font-bold transition-colors cursor-pointer"
              style={{
                borderColor: 'var(--border-primary)',
                backgroundColor: 'var(--bg-container-low)',
                color: 'var(--color-primary)'
              }}
            >
              ▲ +1
            </button>

            <div className="text-2xl font-black tracking-widest my-1 font-mono" style={{ color: 'var(--color-primary)' }}>
              {year}
            </div>

            <button
              type="button"
              onClick={() => stepYear(-1)}
              className="w-full py-1 border text-xs font-bold transition-colors cursor-pointer"
              style={{
                borderColor: 'var(--border-primary)',
                backgroundColor: 'var(--bg-container-low)',
                color: 'var(--color-primary)'
              }}
            >
              ▼ -1
            </button>
          </div>
        </div>

        {/* Selected Pass Date Readout */}
        <div 
          className="border px-3.5 py-2 flex justify-between items-center text-xs"
          style={{
            backgroundColor: 'var(--bg-container-low)',
            borderColor: 'var(--border-primary)'
          }}
        >
          <span style={{ color: 'var(--text-on-surface-variant)' }}>CONFIGURED_PASS_DATE:</span>
          <span className="font-bold tracking-widest" style={{ color: 'var(--color-primary)' }}>
            {String(day).padStart(2, '0')} {MONTH_NAMES[month - 1]} {year}
          </span>
        </div>

        {/* Feedback Banner */}
        {savedFeedback && (
          <div 
            className="border py-1.5 px-3 text-xs font-bold tracking-widest animate-pulse text-center"
            style={{
              borderColor: 'var(--color-primary)',
              backgroundColor: 'color-mix(in srgb, var(--color-primary) 20%, transparent)',
              color: 'var(--color-primary)'
            }}
          >
            [ PASS_DATE_SAVED // CHRONO_LOCK_UPDATED_SUCCESSFULLY ]
          </div>
        )}

        {/* Actions Footer */}
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 border font-bold text-xs transition-colors cursor-pointer"
            style={{
              borderColor: 'var(--border-primary)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-on-surface-variant)'
            }}
          >
            [ RESET DEFAULT (31-AUG-2007) ]
          </button>
          <div className="flex-1"></div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 border font-bold text-xs transition-colors cursor-pointer"
            style={{
              borderColor: 'var(--border-primary)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-on-surface)'
            }}
          >
            [ CANCEL ]
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 font-black text-xs tracking-widest transition-all cursor-pointer"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-on-primary)'
            }}
          >
            [ SAVE PASS DATE ]
          </button>
        </div>
      </div>
    </div>
  );
}
