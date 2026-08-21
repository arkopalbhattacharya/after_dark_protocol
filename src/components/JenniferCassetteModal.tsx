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
  private isRunning = false;

  public initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Hard 80s Mechanical Cassette Player Solenoid & Spring Latch Click Sound
  playMechanicalButtonClick() {
    try {
      const ctx = this.initContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // 1. Heavy mechanical plastic latch thud (solenoid impact)
      const thudOsc = ctx.createOscillator();
      const thudGain = ctx.createGain();
      thudOsc.type = 'triangle';
      thudOsc.frequency.setValueAtTime(160, now);
      thudOsc.frequency.exponentialRampToValueAtTime(35, now + 0.08);

      thudGain.gain.setValueAtTime(0.35, now);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      thudOsc.connect(thudGain);
      thudGain.connect(ctx.destination);
      thudOsc.start(now);
      thudOsc.stop(now + 0.09);

      // 2. Sharp metallic spring click snap
      const snapLen = Math.floor(ctx.sampleRate * 0.035);
      const snapBuffer = ctx.createBuffer(1, snapLen, ctx.sampleRate);
      const snapData = snapBuffer.getChannelData(0);
      for (let i = 0; i < snapLen; i++) {
        snapData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.005));
      }
      const snapSource = ctx.createBufferSource();
      snapSource.buffer = snapBuffer;

      const snapFilter = ctx.createBiquadFilter();
      snapFilter.type = 'bandpass';
      snapFilter.frequency.value = 2900;
      snapFilter.Q.value = 3.5;

      const snapGain = ctx.createGain();
      snapGain.gain.setValueAtTime(0.4, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      snapSource.connect(snapFilter);
      snapFilter.connect(snapGain);
      snapGain.connect(ctx.destination);
      snapSource.start(now);
    } catch { }
  }

  start() {
    if (this.isRunning) return;
    try {
      const ctx = this.initContext();
      if (!ctx) return;
      this.isRunning = true;

      // Generate pink tape noise buffer
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
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
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.035;
        b6 = white * 0.115926;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Bandpass filter for cassette head warmth (1.35kHz)
      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.value = 1350;
      bandpass.Q.value = 1.1;

      this.gainNode = ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
      this.gainNode.gain.exponentialRampToValueAtTime(0.025, ctx.currentTime + 0.15);

      whiteNoise.connect(bandpass);
      bandpass.connect(this.gainNode);
      this.gainNode.connect(ctx.destination);
      whiteNoise.start(0);
      this.noiseNode = whiteNoise;

      // 52Hz mains transformer hum
      this.humNode = ctx.createOscillator();
      this.humNode.type = 'sine';
      this.humNode.frequency.setValueAtTime(52, ctx.currentTime);
      this.humGain = ctx.createGain();
      this.humGain.gain.setValueAtTime(0.004, ctx.currentTime);
      this.humNode.connect(this.humGain);
      this.humGain.connect(ctx.destination);
      this.humNode.start(0);
    } catch { }
  }

  stop() {
    if (!this.isRunning) return;
    this.isRunning = false;
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
      }, 90);
    } catch { }
  }
}

const tapeAudioEngine = new TapeAudioEffects();

export function JenniferCassetteModal({ isOpen, onClose, onSynthoReact }: JenniferCassetteModalProps) {
  const [activeSeasonIndex, setActiveSeasonIndex] = useState<number>(0);
  const [activeEpisodeIndex, setActiveEpisodeIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSeconds, setPlaybackSeconds] = useState<number>(0);
  const [exactDuration, setExactDuration] = useState<number>(96);
  const [tapeCounter, setTapeCounter] = useState<number>(104);
  const [reelWindMode, setReelWindMode] = useState<'IDLE' | 'PLAYING' | 'REWINDING' | 'FAST_FORWARDING'>('IDLE');
  const [audioFrequencies, setAudioFrequencies] = useState<number[]>(new Array(16).fill(0));

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const transcriptContainerRef = useRef<HTMLDivElement>(null);

  const currentSeason = JENNIFER_SEASONS_DATA[activeSeasonIndex] || JENNIFER_SEASONS_DATA[0];
  const currentEpisode: TapeEpisode = currentSeason.episodes[activeEpisodeIndex] || currentSeason.episodes[0];
  const totalDuration = exactDuration || currentEpisode.durationSecs || 60;

  // Cleanup on modal close or unmount
  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      setReelWindMode('IDLE');
      tapeAudioEngine.stop();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      setAudioFrequencies(new Array(16).fill(0));
    }
  }, [isOpen]);

  // Sync isPlaying state with the actual HTML5 audio element
  useEffect(() => {
    if (!isOpen) return;

    if (isPlaying) {
      setReelWindMode('PLAYING');
      tapeAudioEngine.start();
      if (currentEpisode.audioSrc && audioRef.current) {
        audioRef.current.play().catch((err) => {
          console.warn('Audio play request error:', err);
        });
      }
    } else {
      setReelWindMode('IDLE');
      tapeAudioEngine.stop();
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [isOpen, isPlaying, currentEpisode.audioSrc]);

  // Real-time Audio Spectrum Visualizer Animation Loop (Bounces organically during playback)
  useEffect(() => {
    if (!isOpen || !isPlaying) {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      setAudioFrequencies(new Array(16).fill(0));
      return;
    }

    let phase = 0;
    const animateVisualizer = () => {
      phase += 0.12;
      const levels = Array.from({ length: 16 }, (_, i) => {
        const primary = Math.sin(phase * 2.2 + i * 0.45) * 38;
        const secondary = Math.cos(phase * 3.1 - i * 0.7) * 25;
        const flutter = (Math.random() * 2 - 1) * 15;
        const combined = 42 + primary + secondary + flutter;
        return Math.max(10, Math.min(96, Math.round(combined)));
      });
      setAudioFrequencies(levels);
      animFrameRef.current = requestAnimationFrame(animateVisualizer);
    };

    animFrameRef.current = requestAnimationFrame(animateVisualizer);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isOpen, isPlaying]);

  // Secondary playback timer for speech-synthesized episodes (when audioSrc is not an MP3)
  useEffect(() => {
    if (!isOpen || !isPlaying || currentEpisode.audioSrc) return;

    const interval = setInterval(() => {
      setPlaybackSeconds((prev) => {
        if (prev >= totalDuration) {
          if (activeEpisodeIndex < currentSeason.episodes.length - 1) {
            setActiveEpisodeIndex((prevEp) => prevEp + 1);
            return 0;
          } else {
            setIsPlaying(false);
            if (onSynthoReact) {
              onSynthoReact(`${currentSeason.seasonTitle} - ${currentEpisode.title}`);
            }
            return totalDuration;
          }
        }
        return prev + 1;
      });

      setTapeCounter((prev) => (prev + 1) % 999);
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying, activeEpisodeIndex, currentSeason, currentEpisode, totalDuration, onSynthoReact]);

  if (!isOpen) return null;

  const progressPercent = Math.min(100, Math.max(0, Math.round((playbackSeconds / totalDuration) * 100)));

  // Fast forward trigger
  const handleFastForward = () => {
    tapeAudioEngine.playMechanicalButtonClick();
    setReelWindMode('FAST_FORWARDING');
    const target = Math.min(totalDuration, playbackSeconds + 6);
    setPlaybackSeconds(target);
    if (audioRef.current && currentEpisode.audioSrc) {
      audioRef.current.currentTime = target;
    }
    setTapeCounter((prev) => (prev + 12) % 999);
    setTimeout(() => {
      setReelWindMode(isPlaying ? 'PLAYING' : 'IDLE');
    }, 600);
  };

  // Rewind trigger
  const handleRewind = () => {
    tapeAudioEngine.playMechanicalButtonClick();
    setReelWindMode('REWINDING');
    const target = Math.max(0, playbackSeconds - 6);
    setPlaybackSeconds(target);
    if (audioRef.current && currentEpisode.audioSrc) {
      audioRef.current.currentTime = target;
    }
    setTapeCounter((prev) => (prev - 12 + 999) % 999);
    setTimeout(() => {
      setReelWindMode(isPlaying ? 'PLAYING' : 'IDLE');
    }, 600);
  };

  // Play / Pause Toggle
  const handlePlayToggle = () => {
    tapeAudioEngine.playMechanicalButtonClick();
    setIsPlaying(!isPlaying);
  };

  // Stop handler
  const handleStop = () => {
    tapeAudioEngine.playMechanicalButtonClick();
    setIsPlaying(false);
    setPlaybackSeconds(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.pause();
    }
  };

  // Interactive seek bar handler
  const handleSeekProgress = (e: React.MouseEvent<HTMLDivElement>) => {
    tapeAudioEngine.playMechanicalButtonClick();
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const fraction = Math.max(0, Math.min(1, clickX / rect.width));
    const targetSeconds = Math.round(fraction * totalDuration);
    setPlaybackSeconds(targetSeconds);

    if (audioRef.current && currentEpisode.audioSrc) {
      audioRef.current.currentTime = targetSeconds;
    }
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
      {/* Hidden Native Audio Element Managed by React */}
      <audio
        ref={audioRef}
        src={currentEpisode.audioSrc || undefined}
        preload="auto"
        onLoadedMetadata={(e) => {
          const d = (e.target as HTMLAudioElement).duration;
          if (d && !isNaN(d)) {
            setExactDuration(Math.round(d));
          }
        }}
        onTimeUpdate={(e) => {
          const a = e.target as HTMLAudioElement;
          const curr = Math.floor(a.currentTime);
          setPlaybackSeconds(curr);
          setTapeCounter((prev) => (prev + 1) % 999);
        }}
        onEnded={() => {
          if (activeEpisodeIndex < currentSeason.episodes.length - 1) {
            setActiveEpisodeIndex((prev) => prev + 1);
            setPlaybackSeconds(0);
          } else {
            setIsPlaying(false);
            if (onSynthoReact) {
              onSynthoReact(`${currentSeason.seasonTitle} - ${currentEpisode.title}`);
            }
          }
        }}
      />

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
                }}
                className={`px-2 py-1.5 border text-left font-mono transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#0284c7] text-white border-[#38bdf8] font-bold shadow-[0_0_15px_rgba(56,189,248,0.7)]'
                    : 'bg-[#030c1e] border-[#38bdf8]/30 text-[#7dd3fc]/70 hover:border-[#38bdf8]/70 hover:text-white'
                }`}
              >
                <span className="text-[9px] uppercase tracking-wider text-[#bae6fd]">DECK_{s.seasonNumber}</span>
                <span className="text-[10px] font-bold truncate">
                  {s.seasonTitle.replace(/^DECK_\d+: /, '').replace(/^SEASON \d+: /, '')}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Grid: LEFT (Large Deck & Episodes Stack) + RIGHT (Full Height Extended Transcript Box) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 flex-1 overflow-hidden min-h-0">
          
          {/* LEFT PANEL: Large Cassette Deck & Episode Stack */}
          <div className="md:col-span-5 flex flex-col gap-2.5 overflow-hidden h-full">
            
            {/* Physical Cassette Deck Housing with Large Animated Rotating Wheels */}
            <div className="bg-[#030c1e] border-2 border-[#38bdf8]/70 rounded p-3 shadow-[inset_0_0_20px_rgba(0,0,0,0.9)] flex flex-col gap-2 flex-shrink-0">
              
              {/* Header Label */}
              <div className="bg-gradient-to-r from-[#0284c7] via-[#38bdf8] to-[#0284c7] text-[#020617] px-3 py-1 font-bold flex justify-between items-center text-[10px]">
                <span className="tracking-widest font-black uppercase truncate">
                  [ CrO2 // {currentSeason.seasonTitle.replace(/^DECK_\d+: /, '').replace(/^SEASON \d+: /, '')} ]
                </span>
                <span className="font-mono">
                  DECK_0{currentSeason.seasonNumber}_TAPE0{currentEpisode.episodeNumber}
                </span>
              </div>

              {/* Large Cassette Spools & Center Window */}
              <div className="bg-[#010409] border-2 border-[#38bdf8]/60 p-3 rounded flex items-center justify-between relative overflow-hidden shadow-[inset_0_0_15px_rgba(0,0,0,0.9)]">
                
                {/* Large Left Rotating Spool */}
                <div 
                  className={`w-20 h-20 md:w-22 md:h-22 rounded-full border-4 border-[#38bdf8] flex items-center justify-center relative bg-[#06152d] shadow-[0_0_18px_rgba(56,189,248,0.4)] ${reelAnimClass}`} 
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
                    {reelWindMode === 'REWINDING' ? '◀◀ REWINDING TAPE...' : reelWindMode === 'FAST_FORWARDING' ? 'FAST FORWARDING ▶▶' : reelWindMode === 'PLAYING' ? (currentEpisode.audioSrc ? '● ANALOG MASTER RUNNING 4.75 CM/S' : '● TAPE RUNNING 4.75 CM/S') : 'DECK IDLE'}
                  </span>
                </div>

                {/* Large Right Rotating Spool */}
                <div 
                  className={`w-20 h-20 md:w-22 md:h-22 rounded-full border-4 border-[#38bdf8] flex items-center justify-center relative bg-[#06152d] shadow-[0_0_18px_rgba(56,189,248,0.4)] ${reelAnimClass}`} 
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

              {/* Stereo Audio Frequency Spectrum Visualizer / VU Meter */}
              <div className="bg-[#020b18] border border-[#38bdf8]/50 p-2 rounded flex flex-col gap-1 shadow-inner">
                <div className="flex justify-between items-center text-[9px] text-[#7dd3fc] font-mono border-b border-[#38bdf8]/30 pb-1">
                  <span className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-[#38bdf8] animate-ping' : 'bg-white/20'}`}></span>
                    <span className="font-bold">SPECTRUM_ANALYZER // 16-BAND_EQ</span>
                  </span>
                  <span className="text-[8.5px] text-[#bae6fd]/80 font-mono">
                    {isPlaying ? (currentEpisode.audioSrc ? '♫ CrO2_ANALOG_MASTER' : '♫ SYNTH_AUDIO_VOX') : '0.0 dB // IDLE'}
                  </span>
                </div>

                <div className="h-9 flex items-end justify-between gap-1 px-1 pt-1 bg-[#01040a] rounded-xs border border-[#38bdf8]/20">
                  {audioFrequencies.map((lvl, idx) => {
                    const isPeak = lvl > 75;
                    const isMid = lvl > 40;
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full">
                        <div 
                          className={`w-full rounded-t-xs transition-all duration-75 ${
                            isPeak 
                              ? 'bg-gradient-to-t from-[#0284c7] via-[#38bdf8] to-[#ff0033] shadow-[0_0_8px_rgba(255,0,51,0.8)]' 
                              : isMid 
                              ? 'bg-gradient-to-t from-[#0284c7] via-[#38bdf8] to-[#7dd3fc] shadow-[0_0_6px_rgba(56,189,248,0.7)]' 
                              : 'bg-gradient-to-t from-[#034078] to-[#0284c7]'
                          }`}
                          style={{ height: `${Math.max(8, lvl)}%` }}
                        ></div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 80s Clickable/Scrubbable Terminal Progress Bar */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[9px] text-[#7dd3fc] font-mono">
                  <span>&gt; SCRUB_SEEK_BAR:</span>
                  <span>
                    {String(Math.floor(playbackSeconds / 60)).padStart(2, '0')}:{String(playbackSeconds % 60).padStart(2, '0')} / {String(Math.floor(totalDuration / 60)).padStart(2, '0')}:{String(totalDuration % 60).padStart(2, '0')} [{progressPercent}%]
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
                  <span>{isPlaying ? (currentEpisode.audioSrc ? 'ANALOG_MASTER' : 'SYNTH_VOX') : 'MUTED'}</span>
                </div>
              </div>
            </div>

            {/* Scrollable Stack of Audio Cassettes in Selected Season */}
            <div className="flex-1 border border-[#38bdf8]/30 bg-[#020917] p-2 flex flex-col gap-1 overflow-hidden min-h-0">
              <div className="text-[10px] text-[#7dd3fc] font-bold border-b border-[#38bdf8]/30 pb-1 flex justify-between items-center flex-shrink-0">
                <span>CASSETTE_STACK // {currentSeason.subtitle}</span>
                <span className="text-white/60">{currentSeason.episodes.length} TAPES</span>
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
                        setIsPlaying(true);
                      }}
                      className={`p-1.5 border transition-all cursor-pointer flex flex-col justify-between ${
                        isCurrent
                          ? 'bg-[#032048] border-[#38bdf8] text-white shadow-[0_0_10px_rgba(56,189,248,0.6)]'
                          : 'bg-[#030d1e] border-[#38bdf8]/30 text-[#7dd3fc]/70 hover:border-[#38bdf8] hover:text-white'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[9px] text-[#7dd3fc]">
                        <span className="font-bold flex items-center gap-1">
                          <span>TAPE 0{ep.episodeNumber} // {ep.recordedDate}</span>
                          {ep.audioSrc && (
                            <span className="text-[8px] bg-[#0284c7] text-white px-1 py-0.2 rounded-xs font-black">
                              [♫ MASTER]
                            </span>
                          )}
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
                <span className="material-symbols-outlined text-[14px] text-[#38bdf8]">description</span>
                <span className="font-bold tracking-widest text-[#38bdf8]">
                  TRANSCRIPT_LOG // {currentEpisode.title}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[9px]">
                <span className="text-[#bae6fd]/70">{currentEpisode.recordedDate}</span>
                <span className="text-[#38bdf8] font-bold">[CrO2 STEREO]</span>
              </div>
            </div>

            {/* Transcript Scroll Area: Full Audio Transcript Displayed In One Go */}
            <div 
              ref={transcriptContainerRef}
              className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 font-mono text-xs md:text-sm select-text"
            >
              {currentEpisode.dialogues.map((d, idx) => {
                const isJenny = d.speaker === 'JENNIFER';
                const isDaak = d.speaker === 'DAAK';
                const isSys = d.speaker === 'SYS';

                return (
                  <div 
                    key={idx}
                    className={`transition-all duration-200 p-3 rounded border ${
                      isSys
                        ? 'bg-[#020b18]/60 border-[#38bdf8]/20 text-[#7dd3fc]/60 italic text-[11px]'
                        : isJenny
                        ? 'bg-[#03152d]/85 border-[#38bdf8]/40 shadow-[0_0_10px_rgba(56,189,248,0.15)]'
                        : 'bg-[#021026]/85 border-[#0284c7]/30'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-1 border-b border-[#38bdf8]/20 mb-1.5 text-[10px]">
                      <span className={`font-black tracking-wider uppercase ${
                        isJenny ? 'text-[#38bdf8]' : isDaak ? 'text-[#7dd3fc]' : 'text-amber-warn'
                      }`}>
                        {isJenny ? '▶ DR. JENNIFER RUIZ' : isDaak ? '▶ CHIEF ENGINEER DAAK' : '▶ SYSTEM LOG'}
                      </span>
                      <span className="text-[9px] text-[#7dd3fc]/60 font-mono">
                        LINE [{String(idx + 1).padStart(2, '0')}]
                      </span>
                    </div>

                    <p className={`leading-relaxed tracking-wide ${
                      isJenny ? 'text-[#bae6fd]' : isDaak ? 'text-[#e0f2fe]' : 'text-white/70 italic'
                    }`}>
                      {d.text}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Transcript Footer Status */}
            <div className="bg-[#020b18] border-t border-[#38bdf8]/30 p-2 flex justify-between items-center text-[9px] text-[#7dd3fc]/70 flex-shrink-0">
              <span>CrO2_TAPE_BIAS // HIGH_FIDELITY_AUDIO</span>
              <span className="text-[#38bdf8]">FULL_TRANSCRIPT_LOADED // COMPLETE</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
