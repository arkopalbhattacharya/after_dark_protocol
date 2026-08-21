import React, { useState, useEffect, useRef } from 'react';
import { JENNIFER_SEASONS_DATA, type TapeEpisode } from '../data/jenniferTapesData';

interface JenniferCassetteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSynthoReact?: (trackTitle: string) => void;
}

// Web Audio API Retro Tape Hiss, Static Grunge & Hard 80s Mechanical Button Click Generator
class TapeAudioEffects {
  private ctx: AudioContext | null = null;
  private noiseNode: AudioNode | null = null;
  private gainNode: GainNode | null = null;
  private humNode: OscillatorNode | null = null;
  private humGain: GainNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Hard 80s Mechanical Cassette Player Solenoid & Spring Latch Click Sound
  playMechanicalButtonClick() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // 1. Heavy mechanical plastic latch thud (solenoid impact)
      const thudOsc = this.ctx.createOscillator();
      const thudGain = this.ctx.createGain();
      thudOsc.type = 'triangle';
      thudOsc.frequency.setValueAtTime(160, now);
      thudOsc.frequency.exponentialRampToValueAtTime(35, now + 0.08);

      thudGain.gain.setValueAtTime(0.35, now);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      thudOsc.connect(thudGain);
      thudGain.connect(this.ctx.destination);
      thudOsc.start(now);
      thudOsc.stop(now + 0.09);

      // 2. Sharp metallic spring click snap
      const snapLen = Math.floor(this.ctx.sampleRate * 0.035);
      const snapBuffer = this.ctx.createBuffer(1, snapLen, this.ctx.sampleRate);
      const snapData = snapBuffer.getChannelData(0);
      for (let i = 0; i < snapLen; i++) {
        snapData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.005));
      }
      const snapSource = this.ctx.createBufferSource();
      snapSource.buffer = snapBuffer;

      const snapFilter = this.ctx.createBiquadFilter();
      snapFilter.type = 'bandpass';
      snapFilter.frequency.value = 2900;
      snapFilter.Q.value = 3.5;

      const snapGain = this.ctx.createGain();
      snapGain.gain.setValueAtTime(0.4, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      snapSource.connect(snapFilter);
      snapFilter.connect(snapGain);
      snapGain.connect(this.ctx.destination);
      snapSource.start(now);
    } catch { }
  }

  start() {
    try {
      this.initContext();
      if (!this.ctx) return;

      // Ensure any previous noise is cleaned up
      this.stop();

      // Generate pink tape noise buffer
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.045;
        b6 = white * 0.115926;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Bandpass filter for cassette head warmth (1.35kHz)
      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.value = 1350;
      bandpass.Q.value = 1.1;

      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.gainNode.gain.exponentialRampToValueAtTime(0.035, this.ctx.currentTime + 0.15);

      whiteNoise.connect(bandpass);
      bandpass.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);
      whiteNoise.start(0);
      this.noiseNode = whiteNoise;

      // 52Hz mains transformer hum
      this.humNode = this.ctx.createOscillator();
      this.humNode.type = 'sine';
      this.humNode.frequency.setValueAtTime(52, this.ctx.currentTime);
      this.humGain = this.ctx.createGain();
      this.humGain.gain.setValueAtTime(0.006, this.ctx.currentTime);
      this.humNode.connect(this.humGain);
      this.humGain.connect(this.ctx.destination);
      this.humNode.start(0);
    } catch { }
  }

  stop() {
    try {
      if (this.gainNode && this.ctx) {
        this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, this.ctx.currentTime);
        this.gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.08);
      }
      if (this.humGain && this.ctx) {
        this.humGain.gain.setValueAtTime(this.humGain.gain.value, this.ctx.currentTime);
        this.humGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.08);
      }
      setTimeout(() => {
        if (this.noiseNode) {
          try { (this.noiseNode as any).stop(); } catch { }
          this.noiseNode.disconnect();
          this.noiseNode = null;
        }
        if (this.humNode) {
          try { this.humNode.stop(); } catch { }
          this.humNode.disconnect();
          this.humNode = null;
        }
      }, 100);
    } catch { }
  }
}

const tapeAudioEngine = new TapeAudioEffects();

export function JenniferCassetteModal({ isOpen, onClose, onSynthoReact }: JenniferCassetteModalProps) {
  const [activeSeasonIndex, setActiveSeasonIndex] = useState<number>(0);
  const [activeEpisodeIndex, setActiveEpisodeIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSeconds, setPlaybackSeconds] = useState<number>(0);
  const [tapeCounter, setTapeCounter] = useState<number>(104);
  const [revealedLineIndex, setRevealedLineIndex] = useState<number>(0);
  const [activeWordCount, setActiveWordCount] = useState<number>(0);
  const [reelWindMode, setReelWindMode] = useState<'IDLE' | 'PLAYING' | 'REWINDING' | 'FAST_FORWARDING'>('IDLE');

  const progressBarRef = useRef<HTMLDivElement>(null);
  const transcriptContainerRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);

  const currentSeason = JENNIFER_SEASONS_DATA[activeSeasonIndex] || JENNIFER_SEASONS_DATA[0];
  const currentEpisode: TapeEpisode = currentSeason.episodes[activeEpisodeIndex] || currentSeason.episodes[0];

  // Stop audio and speech on unmount or close
  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      setReelWindMode('IDLE');
      tapeAudioEngine.stop();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  }, [isOpen]);

  // Main playback timer
  useEffect(() => {
    if (!isOpen || !isPlaying) {
      tapeAudioEngine.stop();
      return;
    }

    setReelWindMode('PLAYING');
    tapeAudioEngine.start();

    const interval = setInterval(() => {
      setPlaybackSeconds((prev) => {
        if (prev >= currentEpisode.durationSecs) {
          if (activeEpisodeIndex < currentSeason.episodes.length - 1) {
            setActiveEpisodeIndex(activeEpisodeIndex + 1);
            setRevealedLineIndex(0);
            setActiveWordCount(0);
            return 0;
          } else {
            setIsPlaying(false);
            setReelWindMode('IDLE');
            tapeAudioEngine.stop();
            if (onSynthoReact) {
              onSynthoReact(`${currentSeason.seasonTitle} - ${currentEpisode.title}`);
            }
            return currentEpisode.durationSecs;
          }
        }
        return prev + 1;
      });

      setTapeCounter((prev) => (prev + 1) % 999);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isOpen, isPlaying, activeSeasonIndex, activeEpisodeIndex, currentSeason, currentEpisode, onSynthoReact]);

  // Line progression pacing
  useEffect(() => {
    if (!isPlaying) return;
    const lineInterval = setInterval(() => {
      setRevealedLineIndex((prev) => {
        if (prev < currentEpisode.dialogues.length) {
          setActiveWordCount(0);
          return prev + 1;
        }
        return prev;
      });
    }, Math.max(1800, Math.floor((currentEpisode.durationSecs * 1000) / currentEpisode.dialogues.length)));

    return () => clearInterval(lineInterval);
  }, [isPlaying, currentEpisode]);

  // Real-time word-by-word streaming typewriter effect
  useEffect(() => {
    if (!isPlaying || revealedLineIndex === 0) return;
    const currentLine = currentEpisode.dialogues[revealedLineIndex - 1];
    if (!currentLine) return;

    const words = currentLine.text.split(' ');
    const totalWords = words.length;
    
    const wordInterval = setInterval(() => {
      setActiveWordCount((prev) => {
        if (prev < totalWords) {
          return prev + 1;
        }
        clearInterval(wordInterval);
        return prev;
      });
    }, Math.max(90, Math.floor(1800 / Math.max(1, totalWords))));

    return () => clearInterval(wordInterval);
  }, [isPlaying, revealedLineIndex, currentEpisode]);

  // Auto-scroll transcript container to active speaking line
  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [revealedLineIndex, activeWordCount]);

  // Dual-voice natural human narration:
  // JENNIFER: 30s well-groomed, self-made woman (poised, articulate, warm European/Spanish undertone)
  // DAAK: early 40s bearded philosopher and whimsical man (deep, resonant, witty British cadence)
  useEffect(() => {
    if (!isOpen || !isPlaying || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const currentDialogue = currentEpisode.dialogues[revealedLineIndex - 1];
    if (currentDialogue && currentDialogue.speaker !== 'SYS') {
      const cleanText = currentDialogue.text.replace(/[*_#`~[\]]/g, '').trim();
      if (!cleanText) return;

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      const voices = window.speechSynthesis.getVoices();

      if (currentDialogue.speaker === 'JENNIFER') {
        // Natural 30s articulate self-made woman
        utterance.pitch = 1.0;
        utterance.rate = 0.96;
        utterance.volume = 1.0;

        const naturalFemaleVoice = voices.find(v => 
          (v.name.toLowerCase().includes('samantha') && v.name.toLowerCase().includes('enhanced')) ||
          (v.name.toLowerCase().includes('karen') && v.name.toLowerCase().includes('premium')) ||
          v.name.toLowerCase().includes('aria') ||
          v.name.toLowerCase().includes('jenny') ||
          v.name.toLowerCase().includes('ava') ||
          v.name.toLowerCase().includes('zoe') ||
          v.name.toLowerCase().includes('serena') ||
          v.name.toLowerCase().includes('victoria') ||
          v.name.toLowerCase().includes('google us english female') ||
          v.name.toLowerCase().includes('google uk english female')
        ) || voices.find(v => 
          (v.lang.toLowerCase().startsWith('es') || v.name.toLowerCase().includes('spanish')) &&
          (v.name.toLowerCase().includes('monica') || 
           v.name.toLowerCase().includes('paulina') || 
           v.name.toLowerCase().includes('luciana') || 
           v.name.toLowerCase().includes('francisca') ||
           v.name.toLowerCase().includes('penelope'))
        ) || voices.find(v => 
          v.name.toLowerCase().includes('female') && v.lang.startsWith('en')
        ) || voices.find(v => 
          v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('victoria')
        );

        if (naturalFemaleVoice) {
          utterance.voice = naturalFemaleVoice;
        }
      } else {
        // Early 40s bearded philosopher & whimsical British man
        utterance.pitch = 0.93;
        utterance.rate = 0.94;
        utterance.volume = 1.0;

        const philosopherMaleVoice = voices.find(v => 
          (v.name.toLowerCase().includes('daniel') && v.name.toLowerCase().includes('enhanced')) ||
          (v.name.toLowerCase().includes('oliver') && v.name.toLowerCase().includes('enhanced')) ||
          v.name.toLowerCase().includes('arthur') ||
          v.name.toLowerCase().includes('george') ||
          v.name.toLowerCase().includes('malcolm') ||
          v.name.toLowerCase().includes('gordon') ||
          v.name.toLowerCase().includes('ryan') ||
          v.name.toLowerCase().includes('guy') ||
          v.name.toLowerCase().includes('google uk english male')
        ) || voices.find(v => 
          v.lang.toLowerCase().includes('en-gb') && v.name.toLowerCase().includes('male')
        ) || voices.find(v => 
          v.name.toLowerCase().includes('daniel') || v.lang.toLowerCase().includes('en-gb')
        ) || voices.find(v => 
          v.lang.startsWith('en') && (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('alex'))
        );

        if (philosopherMaleVoice) {
          utterance.voice = philosopherMaleVoice;
        }
      }

      window.speechSynthesis.speak(utterance);
    }
  }, [isOpen, isPlaying, revealedLineIndex, currentEpisode]);

  if (!isOpen) return null;

  const progressPercent = Math.min(100, Math.max(0, Math.round((playbackSeconds / currentEpisode.durationSecs) * 100)));

  // Fast forward trigger
  const handleFastForward = () => {
    tapeAudioEngine.playMechanicalButtonClick();
    setReelWindMode('FAST_FORWARDING');
    setPlaybackSeconds((prev) => Math.min(currentEpisode.durationSecs, prev + 6));
    setRevealedLineIndex((prev) => Math.min(currentEpisode.dialogues.length, prev + 1));
    setActiveWordCount(0);
    setTapeCounter((prev) => (prev + 12) % 999);
    setTimeout(() => {
      setReelWindMode(isPlaying ? 'PLAYING' : 'IDLE');
    }, 600);
  };

  // Rewind trigger
  const handleRewind = () => {
    tapeAudioEngine.playMechanicalButtonClick();
    setReelWindMode('REWINDING');
    setPlaybackSeconds((prev) => Math.max(0, prev - 6));
    setRevealedLineIndex((prev) => Math.max(1, prev - 1));
    setActiveWordCount(0);
    setTapeCounter((prev) => (prev - 12 + 999) % 999);
    setTimeout(() => {
      setReelWindMode(isPlaying ? 'PLAYING' : 'IDLE');
    }, 600);
  };

  // Play handler (instant with click sound)
  const handlePlayToggle = () => {
    tapeAudioEngine.playMechanicalButtonClick();
    if (isPlaying) {
      setIsPlaying(false);
      setReelWindMode('IDLE');
      tapeAudioEngine.stop();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } else {
      setIsPlaying(true);
      setReelWindMode('PLAYING');
      tapeAudioEngine.start();
      if (revealedLineIndex === 0) {
        setRevealedLineIndex(1);
        setActiveWordCount(0);
      }
    }
  };

  // Stop handler (instant with click sound)
  const handleStop = () => {
    tapeAudioEngine.playMechanicalButtonClick();
    setIsPlaying(false);
    setReelWindMode('IDLE');
    tapeAudioEngine.stop();
    setPlaybackSeconds(0);
    setRevealedLineIndex(0);
    setActiveWordCount(0);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  // Interactive seek bar handler
  const handleSeekProgress = (e: React.MouseEvent<HTMLDivElement>) => {
    tapeAudioEngine.playMechanicalButtonClick();
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const fraction = Math.max(0, Math.min(1, clickX / rect.width));
    const targetSeconds = Math.round(fraction * currentEpisode.durationSecs);
    setPlaybackSeconds(targetSeconds);

    const targetLineIndex = Math.min(
      currentEpisode.dialogues.length,
      Math.max(1, Math.floor((targetSeconds / currentEpisode.durationSecs) * currentEpisode.dialogues.length))
    );
    setRevealedLineIndex(targetLineIndex);
    setActiveWordCount(0);
  };

  const totalBlocks = 28;
  const filledBlocks = Math.round((progressPercent / 100) * totalBlocks);

  // Determine Reel Rotation Speed & Direction
  let reelAnimClass = '';
  let reelAnimDuration = '2.5s';
  let reelDirection = 'normal';

  if (reelWindMode === 'PLAYING') {
    reelAnimClass = 'animate-spin';
    reelAnimDuration = '2.4s';
    reelDirection = 'normal';
  } else if (reelWindMode === 'FAST_FORWARDING') {
    reelAnimClass = 'animate-spin';
    reelAnimDuration = '0.35s';
    reelDirection = 'normal';
  } else if (reelWindMode === 'REWINDING') {
    reelAnimClass = 'animate-spin';
    reelAnimDuration = '0.35s';
    reelDirection = 'reverse';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/92 backdrop-blur-lg animate-fade-in font-mono select-none">
      {/* Master Sky Blue Cyberpunk Cassette Console Frame */}
      <div 
        className="w-full max-w-6xl h-[94vh] bg-[#020617] border-2 border-[#38bdf8] shadow-[0_0_50px_rgba(56,189,248,0.45),inset_0_0_30px_rgba(0,0,0,0.95)] p-3 md:p-5 relative flex flex-col gap-3 text-xs overflow-hidden"
        style={{
          textShadow: '0 0 6px rgba(56,189,248,0.6)'
        }}
      >
        {/* Phosphor CRT Scanline & Sky Blue Cyberpunk Static Glow */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[repeating-linear-gradient(0deg,rgba(56,189,248,0.35)_0px,rgba(56,189,248,0.35)_1px,transparent_1px,transparent_3px)]"></div>
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(circle,rgba(56,189,248,0.3)_10%,transparent_70%)]"></div>

        {/* Master Console Header - Strictly showing THE_JENNIFER_TAPES */}
        <div className="flex justify-between items-center border-b border-[#38bdf8]/40 pb-2 text-[#38bdf8] flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px] text-[#38bdf8] animate-pulse">radio</span>
            <span className="font-black tracking-widest text-sm sm:text-base uppercase text-[#38bdf8]">
              THE_JENNIFER_TAPES
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-[#7dd3fc] px-2 py-0.5 border border-[#38bdf8]/50 bg-black/60 font-mono tracking-widest">
              TAPE_INDEX: [{String(tapeCounter).padStart(3, '0')}]
            </span>
            <button
              type="button"
              onClick={() => {
                handleStop();
                onClose();
              }}
              className="text-[#38bdf8] hover:text-white transition-colors cursor-pointer border border-[#38bdf8]/50 px-2.5 py-0.5 hover:border-white font-bold"
            >
              [ ✕ CLOSE ]
            </button>
          </div>
        </div>

        {/* Season Selector Hierarchy Tabs in Sky Blue Cyberpunk Style */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1.5 border-b border-[#38bdf8]/30 pb-2 flex-shrink-0">
          {JENNIFER_SEASONS_DATA.map((s, idx) => {
            const isSelected = activeSeasonIndex === idx;
            return (
              <button
                key={s.seasonNumber}
                type="button"
                onClick={() => {
                  tapeAudioEngine.playMechanicalButtonClick();
                  setActiveSeasonIndex(idx);
                  setActiveEpisodeIndex(0);
                  setPlaybackSeconds(0);
                  setRevealedLineIndex(0);
                  setActiveWordCount(0);
                  if (isPlaying) {
                    setRevealedLineIndex(1);
                  }
                }}
                className={`px-2 py-1.5 border text-left font-mono transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#0284c7] text-white border-[#38bdf8] font-bold shadow-[0_0_15px_rgba(56,189,248,0.7)]'
                    : 'bg-[#030c1e] border-[#38bdf8]/30 text-[#7dd3fc]/70 hover:border-[#38bdf8]/70 hover:text-white'
                }`}
              >
                <span className="text-[9px] uppercase tracking-wider text-[#bae6fd]">SEASON 0{s.seasonNumber}</span>
                <span className="text-[10px] font-bold truncate">{s.seasonTitle.replace(/SEASON \d+: /, '')}</span>
              </button>
            );
          })}
        </div>

        {/* Main Grid: LEFT (Large Deck & Episodes Stack) + RIGHT (Full Height Extended Transcript Box) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 flex-1 overflow-hidden min-h-0">
          
          {/* LEFT PANEL: Large Cassette Deck & Episode Stack */}
          <div className="md:col-span-5 flex flex-col gap-2.5 overflow-hidden h-full">
            
            {/* Physical Cassette Deck Housing with Large Animated Rotating Wheels */}
            <div className="bg-[#030c1e] border-2 border-[#38bdf8]/70 rounded p-3 shadow-[inset_0_0_20px_rgba(0,0,0,0.9)] flex flex-col gap-2.5 flex-shrink-0">
              
              {/* Header Label */}
              <div className="bg-gradient-to-r from-[#0284c7] via-[#38bdf8] to-[#0284c7] text-[#020617] px-3 py-1 font-bold flex justify-between items-center text-[10px]">
                <span className="tracking-widest font-black uppercase truncate">
                  [ CrO2 // {currentSeason.seasonTitle.replace(/SEASON \d+: /, '')} ]
                </span>
                <span className="font-mono">
                  S0{currentSeason.seasonNumber}_EP0{currentEpisode.episodeNumber}
                </span>
              </div>

              {/* Large Cassette Spools & Center Window */}
              <div className="bg-[#010409] border-2 border-[#38bdf8]/60 p-3 rounded flex items-center justify-between relative overflow-hidden shadow-[inset_0_0_15px_rgba(0,0,0,0.9)]">
                
                {/* Large Left Rotating Spool */}
                <div 
                  className={`w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-[#38bdf8] flex items-center justify-center relative bg-[#06152d] shadow-[0_0_18px_rgba(56,189,248,0.4)] ${reelAnimClass}`} 
                  style={{ 
                    animationDuration: reelAnimDuration,
                    animationDirection: reelDirection as any
                  }}
                >
                  <div className="w-9 h-9 rounded-full border-2 border-[#38bdf8]/80 bg-black flex items-center justify-center shadow-inner">
                    <div className="w-3 h-3 bg-[#38bdf8] rounded-full"></div>
                  </div>
                  {/* Spoke Teeth */}
                  <span className="absolute top-1.5 w-1.5 h-3 bg-[#38bdf8] rounded-sm"></span>
                  <span className="absolute bottom-1.5 w-1.5 h-3 bg-[#38bdf8] rounded-sm"></span>
                  <span className="absolute left-1.5 w-3 h-1.5 bg-[#38bdf8] rounded-sm"></span>
                  <span className="absolute right-1.5 w-3 h-1.5 bg-[#38bdf8] rounded-sm"></span>
                  <span className="absolute top-3 left-3 w-2 h-2 border border-[#38bdf8]/40 rounded-full"></span>
                  <span className="absolute bottom-3 right-3 w-2 h-2 border border-[#38bdf8]/40 rounded-full"></span>
                </div>

                {/* Center Tape Window */}
                <div className="flex-1 mx-2 bg-[#020b18] border border-[#38bdf8]/50 p-2 rounded flex flex-col items-center justify-center text-center overflow-hidden">
                  <span className="text-[10px] md:text-[11px] text-[#38bdf8] font-black tracking-widest uppercase truncate max-w-full">
                    {currentEpisode.title}
                  </span>
                  <span className="text-[9px] text-[#bae6fd]/70 truncate max-w-full mt-0.5">
                    {currentEpisode.location}
                  </span>
                  <span className="text-[8px] text-[#7dd3fc] mt-1 font-mono tracking-wider">
                    {reelWindMode === 'REWINDING' ? '◀◀ REWINDING TAPE...' : reelWindMode === 'FAST_FORWARDING' ? 'FAST FORWARDING ▶▶' : reelWindMode === 'PLAYING' ? '● TAPE RUNNING 4.75 CM/S' : 'DECK IDLE'}
                  </span>
                </div>

                {/* Large Right Rotating Spool */}
                <div 
                  className={`w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-[#38bdf8] flex items-center justify-center relative bg-[#06152d] shadow-[0_0_18px_rgba(56,189,248,0.4)] ${reelAnimClass}`} 
                  style={{ 
                    animationDuration: reelAnimDuration,
                    animationDirection: reelDirection as any
                  }}
                >
                  <div className="w-9 h-9 rounded-full border-2 border-[#38bdf8]/80 bg-black flex items-center justify-center shadow-inner">
                    <div className="w-3 h-3 bg-[#38bdf8] rounded-full"></div>
                  </div>
                  {/* Spoke Teeth */}
                  <span className="absolute top-1.5 w-1.5 h-3 bg-[#38bdf8] rounded-sm"></span>
                  <span className="absolute bottom-1.5 w-1.5 h-3 bg-[#38bdf8] rounded-sm"></span>
                  <span className="absolute left-1.5 w-3 h-1.5 bg-[#38bdf8] rounded-sm"></span>
                  <span className="absolute right-1.5 w-3 h-1.5 bg-[#38bdf8] rounded-sm"></span>
                  <span className="absolute top-3 right-3 w-2 h-2 border border-[#38bdf8]/40 rounded-full"></span>
                  <span className="absolute bottom-3 left-3 w-2 h-2 border border-[#38bdf8]/40 rounded-full"></span>
                </div>
              </div>

              {/* 80s Clickable/Scrubbable Terminal Progress Bar */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[9px] text-[#7dd3fc] font-mono">
                  <span>&gt; SCRUB_SEEK_BAR:</span>
                  <span>
                    {String(Math.floor(playbackSeconds / 60)).padStart(2, '0')}:{String(playbackSeconds % 60).padStart(2, '0')} / {String(Math.floor(currentEpisode.durationSecs / 60)).padStart(2, '0')}:{String(currentEpisode.durationSecs % 60).padStart(2, '0')} [{progressPercent}%]
                  </span>
                </div>

                {/* Clickable Terminal Progress Rail */}
                <div
                  ref={progressBarRef}
                  onClick={handleSeekProgress}
                  title="CLICK ANYWHERE TO SEEK / SCRUB TAPE"
                  className="w-full bg-black border border-[#38bdf8]/60 h-6 px-2 flex items-center justify-between cursor-pointer select-none relative hover:border-[#38bdf8] transition-colors shadow-inner"
                >
                  <div className="flex items-center gap-0.5 font-mono text-[12px] tracking-tighter w-full overflow-hidden">
                    {Array.from({ length: totalBlocks }).map((_, bIdx) => {
                      const isFilled = bIdx < filledBlocks;
                      return (
                        <span 
                          key={bIdx} 
                          className={isFilled ? 'text-[#38bdf8] font-black' : 'text-white/20 font-normal'}
                        >
                          {isFilled ? '█' : '░'}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Transport Buttons with Immediate Audio/Motor Reaction */}
              <div className="flex items-center justify-between pt-1 border-t border-[#38bdf8]/30">
                <div className="flex items-center gap-1.5">
                  {/* Rewind */}
                  <button
                    type="button"
                    onClick={handleRewind}
                    className="px-2.5 py-1 border border-[#38bdf8]/60 bg-[#02132e] text-[#38bdf8] hover:bg-[#38bdf8] hover:text-[#020617] transition-all cursor-pointer font-bold text-[10px]"
                    title="REWIND (REVERSE MOTOR)"
                  >
                    [ ◀◀ REW ]
                  </button>

                  {/* Play / Pause Toggle (Instant) */}
                  <button
                    type="button"
                    onClick={handlePlayToggle}
                    className={`px-3 py-1 border font-bold transition-all cursor-pointer flex items-center gap-1 text-[10px] ${
                      isPlaying
                        ? 'bg-[#38bdf8] text-[#020617] border-[#38bdf8] shadow-[0_0_16px_rgba(56,189,248,0.9)]'
                        : 'bg-[#02132e] text-[#38bdf8] border-[#38bdf8]/60 hover:bg-[#38bdf8] hover:text-[#020617]'
                    }`}
                    title={isPlaying ? "PAUSE AUDIO" : "PLAY AUDIO"}
                  >
                    <span>{isPlaying ? '[ ❚❚ PAUSE ]' : '[ ▶ PLAY ]'}</span>
                  </button>

                  {/* Stop (Instant) */}
                  <button
                    type="button"
                    onClick={handleStop}
                    className="px-2.5 py-1 border border-[#38bdf8]/60 bg-[#02132e] text-[#38bdf8] hover:bg-[#38bdf8] hover:text-[#020617] transition-all cursor-pointer font-bold text-[10px]"
                    title="STOP AUDIO (CANCEL)"
                  >
                    [ ■ STOP ]
                  </button>

                  {/* Fast Forward */}
                  <button
                    type="button"
                    onClick={handleFastForward}
                    className="px-2.5 py-1 border border-[#38bdf8]/60 bg-[#02132e] text-[#38bdf8] hover:bg-[#38bdf8] hover:text-[#020617] transition-all cursor-pointer font-bold text-[10px]"
                    title="FAST FORWARD MOTOR"
                  >
                    [ FF ▶▶ ]
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-[9px] text-[#7dd3fc]">
                  <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-[#38bdf8] animate-ping' : 'bg-white/20'}`}></span>
                  <span>{isPlaying ? 'AUDIO_ON' : 'MUTED'}</span>
                </div>
              </div>
            </div>

            {/* Scrollable Stack of 10 Audio Cassettes in Selected Season */}
            <div className="flex-1 border border-[#38bdf8]/30 bg-[#020917] p-2 flex flex-col gap-1 overflow-hidden min-h-0">
              <div className="text-[10px] text-[#7dd3fc] font-bold border-b border-[#38bdf8]/30 pb-1 flex justify-between items-center flex-shrink-0">
                <span>CASSETTE_STACK // {currentSeason.subtitle}</span>
                <span className="text-white/60">10 TAPES</span>
              </div>

              <div className="flex-1 overflow-y-auto pr-1 space-y-1.5">
                {currentSeason.episodes.map((ep, idx) => {
                  const isCurrent = activeEpisodeIndex === idx;
                  return (
                    <div
                      key={ep.id}
                      onClick={() => {
                        tapeAudioEngine.playMechanicalButtonClick();
                        setActiveEpisodeIndex(idx);
                        setPlaybackSeconds(0);
                        setRevealedLineIndex(1);
                        setActiveWordCount(0);
                        setIsPlaying(true);
                        setReelWindMode('PLAYING');
                        tapeAudioEngine.start();
                      }}
                      className={`p-1.5 border transition-all cursor-pointer flex flex-col justify-between ${
                        isCurrent
                          ? 'bg-[#032048] border-[#38bdf8] text-white shadow-[0_0_10px_rgba(56,189,248,0.6)]'
                          : 'bg-[#030d1e] border-[#38bdf8]/30 text-[#7dd3fc]/70 hover:border-[#38bdf8] hover:text-white'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[9px] text-[#7dd3fc]">
                        <span className="font-bold">
                          TAPE 0{ep.episodeNumber} // {ep.recordedDate}
                        </span>
                        <span className="text-white/50">{ep.durationSecs}s</span>
                      </div>

                      <div className="font-bold text-[10px] text-white mt-0.5 truncate flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px] text-[#38bdf8]">
                          {isCurrent && isPlaying ? 'volume_up' : 'album'}
                        </span>
                        <span className="truncate">{ep.title}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Extended Full-Height Real-Time Transcript Terminal */}
          <div className="md:col-span-7 flex flex-col h-full overflow-hidden border border-[#38bdf8]/50 bg-[#01040a] rounded shadow-[inset_0_0_20px_rgba(0,0,0,0.9)]">
            
            {/* Transcript Top Bar */}
            <div className="bg-[#030e22] border-b border-[#38bdf8]/40 p-2.5 flex justify-between items-center flex-shrink-0 text-[10px] text-[#7dd3fc]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[14px] text-[#38bdf8] animate-pulse">subtitles</span>
                <span className="font-bold tracking-widest uppercase">
                  &gt; LIVE_VOICE_TRANSCRIPTION // {currentEpisode.title}
                </span>
              </div>
              <span className="text-white/60 font-mono">{currentEpisode.recordedDate}</span>
            </div>

            {/* Full-Height Scrolling Dialogue Stream with Word-by-Word Synchronized Spoken Flow */}
            <div 
              ref={transcriptContainerRef}
              className="flex-1 p-3.5 overflow-y-auto space-y-3 font-mono leading-relaxed"
            >
              {currentEpisode.dialogues.slice(0, Math.max(1, revealedLineIndex)).map((d, dIdx) => {
                const isCurrentActiveLine = dIdx === revealedLineIndex - 1;
                const isJenny = d.speaker === 'JENNIFER';
                const isDaak = d.speaker === 'DAAK' || d.speaker === 'SYNTHO_TRON';
                const words = d.text.split(' ');

                // For the currently vocalized line, stream words up to activeWordCount; for completed lines, show all words
                const visibleWords = isCurrentActiveLine && isPlaying
                  ? words.slice(0, Math.max(1, activeWordCount))
                  : words;

                return (
                  <div 
                    key={dIdx} 
                    ref={isCurrentActiveLine ? activeLineRef : null}
                    className={`p-2 rounded border transition-all animate-fade-in ${
                      isCurrentActiveLine
                        ? 'bg-[#031c3e] border-[#38bdf8]/80 shadow-[0_0_14px_rgba(56,189,248,0.35)]'
                        : 'bg-black/40 border-white/5 opacity-80'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-black text-[10px] tracking-wider uppercase ${
                        isJenny ? 'text-[#38bdf8]' : isDaak ? 'text-[#7dd3fc]' : 'text-amber-warn'
                      }`}>
                        [{d.speaker}]:
                      </span>
                      {isCurrentActiveLine && isPlaying && (
                        <span className="text-[9px] text-[#38bdf8] animate-pulse font-bold tracking-widest">
                          ● TRANSMITTING_VOICE...
                        </span>
                      )}
                    </div>

                    <div className={`text-xs md:text-sm leading-relaxed ${
                      isJenny ? 'text-[#bae6fd]' : isDaak ? 'text-[#e0f2fe]' : 'text-white/70 italic'
                    }`}>
                      {visibleWords.join(' ')}
                      {isCurrentActiveLine && isPlaying && activeWordCount < words.length && (
                        <span className="inline-block w-2 h-3.5 ml-1 bg-[#38bdf8] animate-pulse align-middle"></span>
                      )}
                    </div>
                  </div>
                );
              })}

              {!isPlaying && revealedLineIndex === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-[#38bdf8]/50 gap-2">
                  <span className="material-symbols-outlined text-[36px] text-[#38bdf8]/40 animate-pulse">play_circle</span>
                  <span className="text-xs font-bold tracking-widest">
                    &gt; CASSETTE DECK READY // PRESS [ ▶ PLAY ] OR SELECT A TAPE TO COMMENCE REPLAY
                  </span>
                  <span className="text-[10px] text-white/40 max-w-sm">
                    Speech audio synthesis and analog magnetic tape hiss will engage dynamically.
                  </span>
                </div>
              )}
            </div>

            {/* Transcript Footer Status Bar */}
            <div className="border-t border-[#38bdf8]/30 bg-[#020917] p-2 flex justify-between items-center text-[9px] text-[#7dd3fc]/70 flex-shrink-0">
              <span>&gt; ACOUSTIC_FILTER: TAPE_OXIDE_1350HZ // 52HZ_MAINS_HUM</span>
              <span>AMOR FATI // 1984–1989 ETERNAL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
