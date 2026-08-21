import React, { useState, useEffect, useRef } from 'react';

interface JenniferCipherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function JenniferCipherModal({ isOpen, onClose, onSuccess }: JenniferCipherModalProps) {
  const [inputVal, setInputVal] = useState('');
  const [hasError, setHasError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setInputVal('');
      setHasError(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal === 'arsenal-coventry-what-the hell') {
      onSuccess();
    } else {
      setHasError(true);
      setInputVal('');
      setTimeout(() => {
        setHasError(false);
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/92 backdrop-blur-md animate-fade-in font-mono select-none">
      <div className="w-full max-w-md bg-[#020617] border-2 border-[#38bdf8] shadow-[0_0_35px_rgba(56,189,248,0.4)] p-5 relative flex flex-col gap-4">
        {/* CRT Scanline Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[repeating-linear-gradient(0deg,rgba(56,189,248,0.4)_0px,rgba(56,189,248,0.4)_1px,transparent_1px,transparent_3px)]"></div>

        {/* Minimal 80s Terminal Header with Close */}
        <div className="flex justify-between items-center border-b border-[#38bdf8]/30 pb-2 text-[#38bdf8] text-xs">
          <span className="font-bold tracking-widest">[ TERMINAL // CIPHER_AUTH ]</span>
          <button
            type="button"
            onClick={onClose}
            className="text-[#38bdf8] hover:text-white transition-colors cursor-pointer border border-[#38bdf8]/40 px-2 py-0.5"
          >
            [ ✕ ESC ]
          </button>
        </div>

        {/* Pure blank terminal input box with no hints */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 my-2">
          <div className="flex items-center gap-2 bg-black border border-[#38bdf8]/60 px-3 py-2.5 shadow-[inset_0_0_10px_rgba(56,189,248,0.2)]">
            <span className="text-[#38bdf8] font-bold text-sm select-none">&gt;</span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 bg-transparent outline-none text-[#bae6fd] font-mono text-sm tracking-wider placeholder-transparent"
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
          </div>

          {hasError && (
            <div className="text-[#ff3333] text-xs font-bold tracking-widest animate-pulse text-center">
              [ ERR // ACCESS_DENIED: INVALID_CIPHER ]
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
