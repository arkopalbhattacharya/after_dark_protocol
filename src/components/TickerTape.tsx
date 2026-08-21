import { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';

interface TickerTapeProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TickerCacheData {
  message: string;
  timestamp: string;
  ticketId: number;
  expiresAt: number; // Timestamp in milliseconds (60 min window)
}

const CACHE_STORAGE_KEY = 'after_dark_ticker_cache';
const CACHE_DURATION_MS = 60 * 60 * 1000; // 60 minutes in ms

export function TickerTape({ isOpen, onClose }: TickerTapeProps) {
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [ticketId, setTicketId] = useState<number>(1042);
  const [timestamp, setTimestamp] = useState<string>('');
  const [isTorn, setIsTorn] = useState<boolean>(false);
  const [isRetracting, setIsRetracting] = useState<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Audio helper: Teletype mechanical printing sound
  const playPrintSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      for (let i = 0; i < 5; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(170 + Math.random() * 50, ctx.currentTime + i * 0.055);
        gain.gain.setValueAtTime(0.04, ctx.currentTime + i * 0.055);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.055 + 0.035);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.055);
        osc.stop(ctx.currentTime + i * 0.055 + 0.04);
      }
    } catch (e) {
      // Audio error ignored
    }
  };

  // Audio helper: Retro rewind / retract sound when sliding up
  const playRetractSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      for (let i = 0; i < 4; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        // Ascending frequency to simulate mechanical rewind
        osc.frequency.setValueAtTime(260 + i * 60, ctx.currentTime + i * 0.06);
        gain.gain.setValueAtTime(0.035, ctx.currentTime + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.06 + 0.045);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.06);
        osc.stop(ctx.currentTime + i * 0.06 + 0.05);
      }
    } catch (e) {
      // Audio error ignored
    }
  };

  // Check 60-minute cache or fetch new
  const loadMotivation = async () => {
    setIsTorn(false);
    setIsRetracting(false);

    try {
      const cachedStr = localStorage.getItem(CACHE_STORAGE_KEY);
      if (cachedStr) {
        const cached: TickerCacheData = JSON.parse(cachedStr);
        const now = Date.now();
        // If cached and not expired within 60 minutes
        if (cached && cached.expiresAt && now < cached.expiresAt && cached.message) {
          setMessage(cached.message);
          setTimestamp(cached.timestamp);
          setTicketId(cached.ticketId);
          setIsLoading(false);
          playPrintSound();
          return;
        }
      }
    } catch (e) {
      // Cache read error - proceed to generate
    }

    // Generate new motivation
    setIsLoading(true);
    playPrintSound();
    const newTimestamp = new Date().toLocaleTimeString();
    const newTicketId = Math.floor(1000 + Math.random() * 9000);
    setTimestamp(newTimestamp);
    setTicketId(newTicketId);

    try {
      const text = await api.getMotivationalTickerMessage();
      setMessage(text);

      // Save to localStorage with 60-minute expiry
      const newCache: TickerCacheData = {
        message: text,
        timestamp: newTimestamp,
        ticketId: newTicketId,
        expiresAt: Date.now() + CACHE_DURATION_MS
      };
      localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(newCache));
    } catch (err) {
      const fallback = "Your code compiles, your coffee is lukewarm, and the universe remains indifferent. Keep typing.";
      setMessage(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadMotivation();
    }
  }, [isOpen]);

  // Handle clicking outside to slide back up with reverse animation and sound
  const handleOutsideClick = () => {
    if (isRetracting || isTorn) return;
    setIsRetracting(true);
    playRetractSound();
    setTimeout(() => {
      onClose();
      setIsRetracting(false);
    }, 440);
  };

  // Download ticker box as high-res PNG
  const downloadTickerPNG = () => {
    const canvas = document.createElement('canvas');
    const width = 840;
    const padding = 54;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Measure and wrap text
    ctx.font = 'italic bold 28px "Space Mono", monospace, sans-serif';
    const words = message.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (ctx.measureText(`"${testLine}"`).width > width - 140 && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);

    const lineHeight = 40;
    const messageHeight = Math.max(lines.length * lineHeight, 60);
    const height = 300 + messageHeight;

    canvas.width = width;
    canvas.height = height;

    // Background Paper
    ctx.fillStyle = '#fdfbf2';
    ctx.fillRect(0, 0, width, height - 20);

    // Border
    ctx.strokeStyle = '#d6d0c0';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, width - 4, height - 24);

    // Sprocket Tractor Feed Holes
    ctx.fillStyle = '#12151a';
    const numHoles = 9;
    const holeSpacing = (height - 70) / (numHoles - 1);
    for (let i = 0; i < numHoles; i++) {
      const y = 35 + i * holeSpacing;
      // Left hole
      ctx.beginPath();
      ctx.arc(18, y, 6, 0, Math.PI * 2);
      ctx.fill();
      // Right hole
      ctx.beginPath();
      ctx.arc(width - 18, y, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Header
    ctx.fillStyle = '#8a2be2';
    ctx.font = 'bold 20px "Space Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('*** AFTER DARK PROTOCOL // VECTOR-SOUL M900 ***', padding + 10, 48);

    ctx.fillStyle = '#a04000';
    ctx.textAlign = 'right';
    ctx.fillText(`#TKT-${ticketId}`, width - padding - 10, 48);

    // Timestamp & Node
    ctx.fillStyle = '#555555';
    ctx.font = 'bold 17px "Space Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`DISPENSED: ${timestamp}`, padding + 10, 78);
    ctx.textAlign = 'right';
    ctx.fillText('NODE: SECTOR-07', width - padding - 10, 78);

    // Dashed Line Top
    ctx.strokeStyle = '#8c8574';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(padding, 98);
    ctx.lineTo(width - padding, 98);
    ctx.stroke();

    // Motivational Quote Message
    ctx.setLineDash([]);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'italic bold 27px "Space Mono", monospace, sans-serif';
    ctx.textAlign = 'center';
    const startY = 150;
    lines.forEach((line, idx) => {
      const lineText = (idx === 0 && lines.length === 1) 
        ? `"${line}"` 
        : (idx === 0 ? `"${line}` : (idx === lines.length - 1 ? `${line}"` : line));
      ctx.fillText(lineText, width / 2, startY + idx * lineHeight);
    });

    // Dashed Line Bottom
    const bottomDashY = startY + messageHeight + 15;
    ctx.strokeStyle = '#8c8574';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(padding, bottomDashY);
    ctx.lineTo(width - padding, bottomDashY);
    ctx.stroke();

    // Barcode
    ctx.setLineDash([]);
    ctx.fillStyle = '#222222';
    ctx.font = 'bold 22px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('||| |||| | ||||| || ||| |||| | |||', width / 2, bottomDashY + 36);

    // Footer Tagline
    ctx.fillStyle = '#777777';
    ctx.font = '15px "Space Mono", monospace';
    ctx.fillText('AUTHENTICATED TRANSMISSION // PROCEED WITH VELOCITY', width / 2, bottomDashY + 62);

    // Perforated Zigzag Bottom
    ctx.fillStyle = '#fdfbf2';
    const toothWidth = 20;
    const toothHeight = 15;
    const zigzagY = height - 20;
    ctx.beginPath();
    ctx.moveTo(0, zigzagY);
    for (let x = 0; x < width; x += toothWidth) {
      ctx.lineTo(x + toothWidth / 2, zigzagY + toothHeight);
      ctx.lineTo(x + toothWidth, zigzagY);
    }
    ctx.lineTo(width, zigzagY);
    ctx.closePath();
    ctx.fill();

    // Trigger PNG Download
    const link = document.createElement('a');
    link.download = `vector_soul_m900_ticket_${ticketId}.png`;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Handle Tear Off button
  const handleTearOff = () => {
    downloadTickerPNG();
    setIsTorn(true);
    setTimeout(() => {
      onClose();
      setIsTorn(false);
    }, 450);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Invisible backdrop for detecting click outside */}
      <div 
        className="fixed inset-0 z-40 cursor-default bg-transparent" 
        onClick={handleOutsideClick}
      ></div>

      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 z-50 select-none font-mono pointer-events-auto">
        {/* Mechanical Printer Slot / Bezel */}
        <div className="w-80 md:w-96 bg-[#0c1015] border-t-2 border-l-2 border-r-2 border-amber-warn/60 px-3 py-1 shadow-[0_4px_12px_rgba(0,0,0,0.8)] flex justify-between items-center text-[9px] text-amber-warn/80 font-bold tracking-wider rounded-t-sm">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#33ff00] animate-ping"></span>
            <span>VECTOR-SOUL // M900_FEEDER</span>
          </div>
          <span className="text-[8px] opacity-70">60M_CACHE: ACTIVE</span>
        </div>

        {/* Mechanical Paper Feed Egress Slot */}
        <div className="w-80 md:w-96 h-2 bg-[#05070a] border-x-2 border-b border-amber-warn/40 shadow-inner"></div>

        {/* Ticker Tape Paper Body */}
        <div 
          className={`w-80 md:w-96 bg-[#fdfbf2] text-[#12151a] shadow-[0_12px_35px_rgba(0,0,0,0.85)] border-x-2 border-[#d6d0c0] relative transition-all origin-top ${
            isTorn 
              ? 'translate-y-8 opacity-0 rotate-2 duration-300' 
              : isRetracting 
                ? 'ticker-paper-retract' 
                : 'ticker-paper-anim'
          }`}
          style={{
            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.7), inset 0 0 15px rgba(0, 0, 0, 0.04)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Tractor Feed Sprocket Holes Left & Right */}
          <div className="absolute left-1 top-0 bottom-0 flex flex-col justify-between py-2 pointer-events-none opacity-40">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#12151a]"></div>
            ))}
          </div>
          <div className="absolute right-1 top-0 bottom-0 flex flex-col justify-between py-2 pointer-events-none opacity-40">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#12151a]"></div>
            ))}
          </div>

          {/* Paper Content Wrapper */}
          <div className="px-6 py-4 flex flex-col gap-2.5">
            {/* Ticket Header */}
            <div className="border-b border-dashed border-[#8c8574] pb-2 text-[10px] flex flex-col gap-0.5">
              <div className="flex justify-between items-center font-bold text-[#8a2be2] text-[9px] tracking-wider">
                <span>*** VECTOR-SOUL // M900 ***</span>
                <span className="text-[#a04000]">#TKT-{ticketId}</span>
              </div>
              <div className="flex justify-between text-[9px] text-[#555] font-semibold">
                <span>DISPENSED: {timestamp}</span>
                <span>VALID_FOR: 60 MIN</span>
              </div>
            </div>

            {/* Motivational Message Body (Max 2 lines) */}
            <div className="min-h-[52px] flex items-center justify-center py-1">
              {isLoading ? (
                <div className="flex items-center gap-2 text-[11px] font-bold text-[#666] animate-pulse">
                  <span className="material-symbols-outlined text-[14px] animate-spin">sync</span>
                  <span>PRINTING TRANSMISSION...</span>
                </div>
              ) : (
                <div className="text-[13px] md:text-[14px] font-bold leading-snug text-center tracking-tight text-[#0f172a] typewriter-text italic">
                  &ldquo;{message}&rdquo;
                </div>
              )}
            </div>

            {/* Barcode & Decorative Receipt Footer */}
            <div className="border-t border-dashed border-[#8c8574] pt-2 flex flex-col items-center gap-1">
              <div className="text-[8px] tracking-[0.25em] font-mono text-[#333] font-bold select-none opacity-70">
                ||| |||| | ||||| || ||| |||| | |||
              </div>
              <div className="text-[8px] text-[#777] uppercase tracking-wider">
                AUTHENTICATED TRANSMISSION // PROCEED WITH VELOCITY
              </div>
            </div>

            {/* Cyberpunk Blue Sever Tape Button */}
            <div className="pt-1 flex justify-center">
              <button
                type="button"
                onClick={handleTearOff}
                className="w-full bg-gradient-to-r from-[#0284c7] via-[#026aa2] to-[#0369a1] text-white hover:from-[#0369a1] hover:to-[#0284c7] border border-[#38bdf8] font-bold py-1.5 px-3 transition-all flex items-center justify-center gap-1.5 cursor-pointer text-[11px] shadow-[0_0_12px_rgba(56,189,248,0.4)] hover:shadow-[0_0_18px_rgba(56,189,248,0.8)] tracking-wider active:scale-[0.99]"
                title="SEVER TAPE // CAPTURE BUFFER TO PNG"
              >
                <span className="material-symbols-outlined text-[14px] text-[#7dd3fc]">content_cut</span>
                <span className="font-mono tracking-wide">[ ✂ SEVER TAPE // CAPTURE BUFFER ]</span>
              </button>
            </div>
          </div>

          {/* Perforated Zigzag Tear-Off Bottom Edge */}
          <div 
            className="h-3 w-full bg-[#fdfbf2] relative overflow-hidden"
            style={{
              clipPath: 'polygon(0% 0%, 5% 100%, 10% 0%, 15% 100%, 20% 0%, 25% 100%, 30% 0%, 35% 100%, 40% 0%, 45% 100%, 50% 0%, 55% 100%, 60% 0%, 65% 100%, 70% 0%, 75% 100%, 80% 0%, 85% 100%, 90% 0%, 95% 100%, 100% 0%)'
            }}
          ></div>
        </div>
      </div>
    </>
  );
}
