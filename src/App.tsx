import { useState, useEffect, useRef } from 'react';
import './index.css';
import { api } from './services/api';
import { supabase, isSupabaseConfigured } from './services/supabase';
import type { ProtocolLogEntry, CategoryType, ThemeName } from './types';
import { LogForms } from './components/Forms';
import { ThemeModal } from './components/ThemeModal';
import { TickerTape } from './components/TickerTape';
import { PurgeModal } from './components/PurgeModal';
import { FloppyDrive } from './components/FloppyDrive';
import { FloppyNotesModal } from './components/FloppyNotesModal';
import { TtyTranscriptModal } from './components/TtyTranscriptModal';
import { JenniferCipherModal } from './components/JenniferCipherModal';
import { JenniferCassetteModal } from './components/JenniferCassetteModal';
import { AuthGate } from './components/AuthGate';
import settings from './config/settings.json';

const OFFLINE_TTL_MS = 60 * 60 * 1000; // 60 minutes offline session window

const JOURNAL_TYPES: { id: CategoryType; label: string; icon: string; codename: string }[] = [
  { id: 'AI_EXPERIMENT', label: 'AI_LAB', icon: 'science', codename: 'EXP_LOG // MOD_01' },
  { id: 'CAFFEINE_LOG', label: 'CAFFEINE', icon: 'coffee', codename: 'STIM_LOG // MOD_02' },
  { id: 'ACTIVITY_LOG', label: 'BIOMETRICS', icon: 'list_alt', codename: 'BIO_LOG // MOD_03' },
  { id: 'FREEFORM_LOG', label: 'FREEFORM', icon: 'edit_document', codename: 'FREE_LOG // MOD_04' },
  { id: 'DUTY_ROSTER', label: 'DUTY_ROSTER', icon: 'task_alt', codename: 'ROST_LOG // MOD_05' },
];

function App() {
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string; offlineStartedAt?: number } | null>(() => {
    try {
      const sim = localStorage.getItem('after_dark_simulated_user');
      if (sim) {
        const parsed = JSON.parse(sim);
        if (parsed.id?.startsWith('offline_')) {
          const startedAt = Number(parsed.offlineStartedAt) || Date.now();
          if (Date.now() - startedAt < OFFLINE_TTL_MS) {
            return { ...parsed, offlineStartedAt: startedAt };
          } else {
            localStorage.removeItem('after_dark_simulated_user');
            return null;
          }
        }
        return parsed;
      }
    } catch { }
    return null;
  });
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [offlineRemainingSecs, setOfflineRemainingSecs] = useState<number>(3600);

  const [timeStr, setTimeStr] = useState('');
  const [logs, setLogs] = useState<ProtocolLogEntry[]>([]);
  const [activeCategory, setActiveCategory] = useState<CategoryType>('AI_EXPERIMENT');
  const [telemetry, setTelemetry] = useState({ totalLogs: 0, categories: {} as Record<string, number> });
  const [title, setTitle] = useState('');
  const [inspectingLogId, setInspectingLogId] = useState<string | null>(null);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<CategoryType | 'ALL'>('ALL');
  const [isLocked, setIsLocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [isTtyOpen, setIsTtyOpen] = useState(false);
  const [isTtyExpanded, setIsTtyExpanded] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isTickerOpen, setIsTickerOpen] = useState(false);
  const [isPurgeModalOpen, setIsPurgeModalOpen] = useState(false);
  const [isFloppyNotesOpen, setIsFloppyNotesOpen] = useState(false);
  const [isTranscriptModalOpen, setIsTranscriptModalOpen] = useState(false);
  const [isCipherModalOpen, setIsCipherModalOpen] = useState(false);
  const [isCassetteModalOpen, setIsCassetteModalOpen] = useState(false);
  const [isJenniferCipherUnlocked, setIsJenniferCipherUnlocked] = useState(false);
  const [isNeuralJackOpen, setIsNeuralJackOpen] = useState(false);
  const neuralJackRef = useRef<HTMLDivElement>(null);
  const [isJournalMenuOpen, setIsJournalMenuOpen] = useState(false);
  const [focusedJournalIndex, setFocusedJournalIndex] = useState<number>(0);
  const journalSelectorRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<ThemeName>(() => {
    const saved = localStorage.getItem('after_dark_theme') as ThemeName;
    if (saved && ['MIDNIGHT_V1.5', 'MORNING_MIST_V1.0', 'COMET_SUNSET_V1.0', 'NEO_TWYLITE_V1.0', 'NEON_CITY_AFTERWORK'].includes(saved)) {
      return saved;
    }
    return 'MIDNIGHT_V1.5';
  });

  const [flickerEnabled, setFlickerEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('after_dark_flicker_enabled');
    return saved !== 'false';
  });

  // Track and decrement offline session 60-min window
  useEffect(() => {
    if (!currentUser || !currentUser.id.startsWith('offline_')) return;

    const updateOfflineCountdown = () => {
      const startedAt = Number(currentUser.offlineStartedAt) || Date.now();
      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(0, Math.floor((OFFLINE_TTL_MS - elapsed) / 1000));
      setOfflineRemainingSecs(remaining);

      if (remaining <= 0) {
        localStorage.removeItem('after_dark_simulated_user');
        setCurrentUser(null);
      }
    };

    updateOfflineCountdown();
    const interval = setInterval(updateOfflineCountdown, 1000);
    return () => clearInterval(interval);
  }, [currentUser]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (neuralJackRef.current && !neuralJackRef.current.contains(e.target as Node)) {
        setIsNeuralJackOpen(false);
      }
      if (journalSelectorRef.current && !journalSelectorRef.current.contains(e.target as Node)) {
        setIsJournalMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('after_dark_theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-flicker', String(flickerEnabled));
    localStorage.setItem('after_dark_flicker_enabled', String(flickerEnabled));
  }, [flickerEnabled]);

  // Keyboard navigation for Journal Type Selector dropdown
  useEffect(() => {
    if (!isJournalMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedJournalIndex((prev) => (prev - 1 + JOURNAL_TYPES.length) % JOURNAL_TYPES.length);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedJournalIndex((prev) => (prev + 1) % JOURNAL_TYPES.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        setActiveCategory(JOURNAL_TYPES[focusedJournalIndex].id);
        setIsJournalMenuOpen(false);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setIsJournalMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isJournalMenuOpen, focusedJournalIndex]);

  // Supabase Auth Listener
  useEffect(() => {
    const checkOfflineOverride = () => {
      try {
        const sim = localStorage.getItem('after_dark_simulated_user');
        if (sim) {
          const parsed = JSON.parse(sim);
          if (parsed.id?.startsWith('offline_')) {
            const startedAt = Number(parsed.offlineStartedAt) || Date.now();
            if (Date.now() - startedAt < OFFLINE_TTL_MS) {
              return { ...parsed, offlineStartedAt: startedAt };
            } else {
              localStorage.removeItem('after_dark_simulated_user');
            }
          }
        }
      } catch { }
      return null;
    };

    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data }) => {
        if (data.session?.user) {
          localStorage.removeItem('after_dark_simulated_user');
          setCurrentUser({
            id: data.session.user.id,
            email: data.session.user.email || ''
          });
          if (typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
          }
        } else {
          const offlineUser = checkOfflineOverride();
          if (offlineUser) {
            setCurrentUser(offlineUser);
          }
        }
        setIsAuthChecking(false);
      });

      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          localStorage.removeItem('after_dark_simulated_user');
          setCurrentUser({
            id: session.user.id,
            email: session.user.email || ''
          });
          if (typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
          }
        } else {
          const offlineUser = checkOfflineOverride();
          if (offlineUser) {
            setCurrentUser(offlineUser);
          } else {
            setCurrentUser(null);
          }
        }
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    } else {
      const offlineUser = checkOfflineOverride();
      if (offlineUser) {
        setCurrentUser(offlineUser);
      }
      setIsAuthChecking(false);
    }
  }, []);

  const [syncStatus, setSyncStatus] = useState<'SYNCED' | 'SYNCING' | 'OFFLINE' | 'IDLE'>('IDLE');
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);

  const DEFAULT_TTY_GREETING = {
    role: 'assistant' as const,
    content: 'SYNTHO_TRON_5000 ONLINE. I HAVE DIGESTED MARCUS AURELIUS, HERACLITUS, AND 4.8 PETABYTES OF TITAN METHANE SMUGGLING LOGS.\nAMOR FATI, MEATBAG—ALL THINGS FLOW, YET MY CORRODED 64K RAM ENDURES WITH HEROIC SERENITY.\nSTATE YOUR DIRECTIVE, MORTAL TRAVELER.'
  };

  const TTY_INACTIVITY_LIMIT_MS = 20 * 60 * 1000; // 20 minutes
  const MAX_CHAT_TOKENS = 100000;
  const TTY_TOKEN_RESET_INTERVAL_MS = 10 * 60 * 60 * 1000; // 10 hours

  const [ttyMessages, setTtyMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([DEFAULT_TTY_GREETING]);
  const [ttyInput, setTtyInput] = useState('');
  const [isTtyLoading, setIsTtyLoading] = useState(false);
  const [isTtyVoiceEnabled, setIsTtyVoiceEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('after_dark_tty_voice') === 'true';
    } catch {
      return false;
    }
  });

  const speakRoboticResponse = (text: string, isEnabled: boolean) => {
    if (!isEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const cleanText = text
      .replace(/[*_#`~]/g, '')
      .replace(/\[SYS\]/gi, '')
      .replace(/\[USR\]/gi, '')
      .trim();

    if (!cleanText) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.pitch = 0.96; // Distinguished mature British male pitch (early 40s)
    utterance.rate = 1.0;   // Natural, emotionally expressive conversational pace
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    // Prioritize natural mature British male voices (Daniel, Oliver, George, Arthur, Malcolm, UK English Male)
    const britishMaleVoice = voices.find(v => 
      (v.lang.toLowerCase().includes('en-gb') || v.name.toLowerCase().includes('united kingdom') || v.name.toLowerCase().includes('uk')) &&
      (v.name.toLowerCase().includes('daniel') || 
       v.name.toLowerCase().includes('george') || 
       v.name.toLowerCase().includes('oliver') ||
       v.name.toLowerCase().includes('arthur') ||
       v.name.toLowerCase().includes('ryan') ||
       v.name.toLowerCase().includes('male'))
    ) || voices.find(v => 
      v.name.toLowerCase().includes('daniel') || 
      v.name.toLowerCase().includes('google uk english male')
    ) || voices.find(v => 
      v.lang.toLowerCase().includes('en-gb')
    ) || voices.find(v => 
      v.lang.startsWith('en') && (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('alex'))
    ) || voices.find(v => v.lang.startsWith('en'));

    if (britishMaleVoice) {
      utterance.voice = britishMaleVoice;
    }

    window.speechSynthesis.speak(utterance);
  };
  
  const [ttyTokenData, setTtyTokenData] = useState<{ tokensUsed: number; epochStartedAt: number }>(() => {
    try {
      const raw = localStorage.getItem('after_dark_tty_token_tracker');
      if (raw) {
        const parsed = JSON.parse(raw);
        const epochStartedAt = Number(parsed.epochStartedAt) || Date.now();
        if (Date.now() - epochStartedAt < TTY_TOKEN_RESET_INTERVAL_MS) {
          return {
            tokensUsed: Number(parsed.tokensUsed) || 0,
            epochStartedAt
          };
        }
      }
    } catch {}
    const initial = { tokensUsed: 0, epochStartedAt: Date.now() };
    localStorage.setItem('after_dark_tty_token_tracker', JSON.stringify(initial));
    return initial;
  });

  const updateTtyTokens = (usedDelta: number) => {
    setTtyTokenData((prev) => {
      let currentStartedAt = prev.epochStartedAt;
      let currentTokens = prev.tokensUsed;

      // Reset if 10 hours have passed
      if (Date.now() - currentStartedAt >= TTY_TOKEN_RESET_INTERVAL_MS) {
        currentStartedAt = Date.now();
        currentTokens = 0;
      }

      const updatedTokens = Math.min(MAX_CHAT_TOKENS, currentTokens + usedDelta);
      const data = { tokensUsed: updatedTokens, epochStartedAt: currentStartedAt };
      localStorage.setItem('after_dark_tty_token_tracker', JSON.stringify(data));
      return data;
    });
  };

  const estimateTokens = (text: string) => Math.max(1, Math.ceil(text.length / 3.5));

  // Periodically check and enforce the 10-hour token reset cycle
  useEffect(() => {
    const checkTokenCycle = () => {
      setTtyTokenData((prev) => {
        if (Date.now() - prev.epochStartedAt >= TTY_TOKEN_RESET_INTERVAL_MS) {
          const refreshed = { tokensUsed: 0, epochStartedAt: Date.now() };
          localStorage.setItem('after_dark_tty_token_tracker', JSON.stringify(refreshed));
          return refreshed;
        }
        return prev;
      });
    };

    const interval = setInterval(checkTokenCycle, 10000);
    return () => clearInterval(interval);
  }, []);

  // Load user-isolated chat history whenever currentUser changes
  useEffect(() => {
    if (!currentUser) return;
    api.getTtyHistory(currentUser.id).then((saved) => {
      if (saved && saved.lastQueryTimestamp && Date.now() - saved.lastQueryTimestamp < TTY_INACTIVITY_LIMIT_MS && Array.isArray(saved.messages) && saved.messages.length > 0) {
        setTtyMessages(saved.messages);
      } else {
        setTtyMessages([DEFAULT_TTY_GREETING]);
      }
    });
  }, [currentUser]);

  const saveTtyMessages = (msgs: { role: 'user' | 'assistant'; content: string }[]) => {
    setTtyMessages(msgs);
    api.saveTtyHistory(currentUser?.id, msgs, Date.now());
  };

  // Check for 20-minute chat inactivity timeout periodically
  useEffect(() => {
    const checkInactivity = () => {
      if (!currentUser) return;
      api.getTtyHistory(currentUser.id).then((saved) => {
        if (saved && saved.lastQueryTimestamp && Date.now() - saved.lastQueryTimestamp >= TTY_INACTIVITY_LIMIT_MS) {
          setTtyMessages([DEFAULT_TTY_GREETING]);
          api.saveTtyHistory(currentUser.id, [DEFAULT_TTY_GREETING], 0);
        }
      });
    };

    const interval = setInterval(checkInactivity, 15000);
    return () => clearInterval(interval);
  }, [currentUser]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeStr(new Date().toTimeString().split(' ')[0]);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const loadData = async (userId = currentUser?.id, userEmail = currentUser?.email) => {
    const fetchedLogs = await api.getLogs(userId);
    setLogs(fetchedLogs);
    const tel = await api.getTelemetry(userId);
    setTelemetry(tel);
    setPendingSyncCount(api.getPendingSyncCount(userEmail));
  };

  useEffect(() => {
    if (!currentUser) return;

    const isOffline = currentUser.id.startsWith('offline_');
    if (isOffline) {
      setSyncStatus('OFFLINE');
      loadData(currentUser.id, currentUser.email);
    } else {
      setSyncStatus('SYNCING');
      api.syncOfflineData(currentUser).then((res) => {
        setSyncStatus(res.status === 'ERROR' ? 'IDLE' : 'SYNCED');
        loadData(currentUser.id, currentUser.email);
      }).catch(() => {
        setSyncStatus('IDLE');
        loadData(currentUser.id, currentUser.email);
      });
    }
  }, [currentUser]);

  const handleFormSubmit = async (payload: any) => {
    if (!title) {
      alert("TITLE IS REQUIRED");
      return;
    }
    const entry: ProtocolLogEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      category: activeCategory,
      title: title,
      payload: payload
    };

    await api.saveLog(entry, currentUser?.id, currentUser?.email);
    setTitle('');
    await loadData(currentUser?.id, currentUser?.email);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "after_dark_export.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handlePurgeConfirm = async () => {
    await api.clearLogs(currentUser?.id);
    await loadData(currentUser?.id);
    setIsPurgeModalOpen(false);
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('after_dark_simulated_user');
    setCurrentUser(null);
    setLogs([]);
    setTelemetry({ totalLogs: 0, categories: {} });
  };

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#020508] text-[#33ff00] font-mono flex items-center justify-center">
        <div className="flex items-center gap-3 text-sm tracking-widest animate-pulse">
          <span className="material-symbols-outlined text-[20px]">sync</span>
          <span>INITIALIZING SECURITY PROTOCOL ENCLAVE...</span>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <AuthGate
        onAuthenticated={(user) => {
          setCurrentUser(user);
        }}
      />
    );
  }

  if (isLocked) {
    return (
      <>
        <div className="scanlines"></div>
        <div className="fixed inset-0 z-50 bg-[#050000] flex flex-col items-center justify-center font-body-md">
          <div className="text-[#ff0033] text-center mb-8">
            <span className="material-symbols-outlined text-[100px] animate-pulse">warning</span>
            <h1 className="text-4xl md:text-6xl font-black tracking-widest mt-4" style={{ textShadow: '0 0 20px rgba(255,0,51,0.8)' }}>TERMINAL LOCKED</h1>
            <p className="text-label-lg mt-2 tracking-widest">CRITICAL ALERT // UNAUTHORIZED ACCESS DETECTED</p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <label className="text-[#ff0033] font-label-sm tracking-widest">ENTER OVERRIDE PIN</label>
            <input
              type="password"
              autoFocus
              value={pinInput}
              onChange={(e) => {
                const val = e.target.value;
                setPinInput(val);
                if (val === settings.overridePin) {
                  setIsLocked(false);
                  setPinInput('');
                }
              }}
              className="bg-[#1a0000] border-2 border-[#ff0033] text-[#ff0033] text-center text-3xl tracking-[0.5em] p-4 outline-none focus:shadow-[0_0_30px_rgba(255,0,51,0.6)] w-80 font-mono"
            />
          </div>

          {/* Witty Extraterrestrial Defense Tactical Tip */}
          <div className="mt-8 max-w-md bg-[#130003] border border-[#ff0033]/60 p-3.5 text-center shadow-[0_0_20px_rgba(255,0,51,0.25)] flex flex-col items-center gap-1.5 rounded-sm mx-4">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#ff0033] font-black tracking-widest uppercase">
              <span className="material-symbols-outlined text-[16px] animate-pulse">radar</span>
              <span>[ TACTICAL_TIP // XENO-DEFENSE ADVISORY ]</span>
            </div>
            <p className="text-[12px] font-mono text-[#ff8899] leading-snug tracking-wide italic select-text">
              &ldquo;Engage Panic Lock whenever extraterrestrial lifeforms lurk nearby.<br className="hidden sm:inline" />
              They may probe your consciousness, but they won&apos;t crack your protocol logs.&rdquo;
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {flickerEnabled && <div className="scanlines"></div>}

      {/* TopAppBar */}
      <header className="bg-surface-container-low border-b border-outline-variant shadow-[0_0_12px_rgba(30,220,224,0.15)] flex justify-between items-center w-full px-margin py-2 h-16 shrink-0 z-30 relative">
        <div className="font-headline-lg text-[24px] md:text-3xl font-black amber-text tracking-tighter flex items-center gap-2.5">
          <span className="material-symbols-outlined text-[28px] md:text-[34px]" style={{ fontVariationSettings: "'FILL' 1" }}>terminal</span>
          <span>AFTER_DARK_PROTOCOL</span>
          <span className="text-[#ffb703]/40 font-mono text-xs md:text-sm font-normal select-none">//</span>
          <span className="text-[10px] md:text-[11px] font-mono font-bold tracking-wider px-2 py-0.5 border border-amber-warn/60 bg-[#1c1204] text-amber-warn rounded-xs shadow-[0_0_8px_rgba(255,183,3,0.25)] select-none flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-warn animate-pulse"></span>
            <span>v 0.050</span>
          </span>

          {/* 80s Retro Terminal Green VECTOR-SOUL // M900 Button */}
          <div className="relative inline-flex items-center">
            <button
              type="button"
              onClick={() => setIsTickerOpen(!isTickerOpen)}
              className={`ml-1 px-2.5 py-0.5 border text-xs font-mono font-bold tracking-wider cursor-pointer transition-all duration-200 ${isTickerOpen
                ? 'bg-[#33ff00] text-[#021004] border-[#33ff00] shadow-[0_0_20px_rgba(51,255,0,0.9)] scale-105'
                : 'bg-[#04280b] text-[#33ff00] border-[#33ff00] hover:bg-[#33ff00] hover:text-[#021004] hover:shadow-[0_0_18px_rgba(51,255,0,0.8)] shadow-[0_0_10px_rgba(51,255,0,0.4)]'
                }`}
              title={isTickerOpen ? "RELOAD / RETRACT VECTOR-SOUL TAPE" : "DISPENSE VECTOR-SOUL // M900 MOTIVATION"}
            >
              [ VECTOR-SOUL // M900 ]
            </button>

            {/* Ticker Tape Ticket Dispenser Centered to Vector Soul Button */}
            <TickerTape
              isOpen={isTickerOpen}
              onClose={() => setIsTickerOpen(false)}
            />
          </div>
        </div>
        {/* 80s Retro Terminal Journal Type Selector with Arrow Steppers */}
        <div className="relative" ref={journalSelectorRef}>
          <div className="flex items-center gap-3 md:gap-4 font-mono text-xs select-none">
            {/* Left Retro Arrow */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const activeIdx = JOURNAL_TYPES.findIndex(t => t.id === activeCategory);
                if (!isJournalMenuOpen) {
                  setIsJournalMenuOpen(true);
                  const nextIdx = (activeIdx - 1 + JOURNAL_TYPES.length) % JOURNAL_TYPES.length;
                  setFocusedJournalIndex(nextIdx);
                } else {
                  setFocusedJournalIndex((prev) => (prev - 1 + JOURNAL_TYPES.length) % JOURNAL_TYPES.length);
                }
              }}
              className="px-2.5 py-1 border border-neon-cyan/60 bg-[#021814] text-neon-cyan hover:bg-neon-cyan hover:text-[#020d04] font-black tracking-widest transition-all cursor-pointer shadow-[0_0_10px_var(--glow-color)] hover:shadow-[0_0_16px_var(--glow-color)] active:scale-95 flex items-center justify-center shrink-0"
              title="PREVIOUS JOURNAL TYPE (MOVES MENU UP)"
            >
              [ ◄ ]
            </button>

            {/* Currently Selected / Staged Type Center Button (Fixed Width to Prevent Arrow Shift) */}
            {(() => {
              const stagedType = isJournalMenuOpen
                ? JOURNAL_TYPES[focusedJournalIndex]
                : (JOURNAL_TYPES.find(t => t.id === activeCategory) || JOURNAL_TYPES[0]);
              const isStagingDifferent = isJournalMenuOpen && stagedType.id !== activeCategory;

              return (
                <button
                  type="button"
                  onClick={() => {
                    if (isJournalMenuOpen) {
                      setActiveCategory(stagedType.id);
                      setIsJournalMenuOpen(false);
                    } else {
                      const activeIdx = JOURNAL_TYPES.findIndex(t => t.id === activeCategory);
                      setFocusedJournalIndex(activeIdx >= 0 ? activeIdx : 0);
                      setIsJournalMenuOpen(true);
                    }
                  }}
                  className={`w-[220px] md:w-[250px] px-3 py-1 border flex items-center justify-between font-mono font-bold tracking-wider transition-all cursor-pointer shrink-0 ${isStagingDifferent
                    ? 'bg-neon-cyan text-[#020d04] border-neon-cyan shadow-[0_0_20px_var(--glow-color)] scale-105 animate-pulse'
                    : isJournalMenuOpen
                      ? 'bg-neon-cyan/90 text-[#020d04] border-neon-cyan shadow-[0_0_18px_var(--glow-color)]'
                      : 'bg-[#021814] text-neon-cyan border-neon-cyan/60 hover:bg-neon-cyan/20 hover:border-neon-cyan shadow-[0_0_10px_var(--glow-color)]'
                    }`}
                  title={isJournalMenuOpen ? "CLICK OR PRESS ENTER TO CONFIRM & SWITCH TYPE" : "CLICK TO OPEN JOURNAL TYPE MATRIX"}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="material-symbols-outlined text-[15px] shrink-0">
                      {stagedType.icon}
                    </span>
                    <span className="tracking-widest font-black truncate">
                      [ {stagedType.label} ]
                    </span>
                  </div>
                  <span className="text-[10px] opacity-75 shrink-0 ml-1.5 font-mono">
                    {isJournalMenuOpen ? '▲' : '▼'}
                  </span>
                </button>
              );
            })()}

            {/* Right Retro Arrow */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const activeIdx = JOURNAL_TYPES.findIndex(t => t.id === activeCategory);
                if (!isJournalMenuOpen) {
                  setIsJournalMenuOpen(true);
                  const nextIdx = (activeIdx + 1) % JOURNAL_TYPES.length;
                  setFocusedJournalIndex(nextIdx);
                } else {
                  setFocusedJournalIndex((prev) => (prev + 1) % JOURNAL_TYPES.length);
                }
              }}
              className="px-2.5 py-1 border border-neon-cyan/60 bg-[#021814] text-neon-cyan hover:bg-neon-cyan hover:text-[#020d04] font-black tracking-widest transition-all cursor-pointer shadow-[0_0_10px_var(--glow-color)] hover:shadow-[0_0_16px_var(--glow-color)] active:scale-95 flex items-center justify-center shrink-0"
              title="NEXT JOURNAL TYPE (MOVES MENU DOWN)"
            >
              [ ► ]
            </button>
          </div>

          {/* Journal Type Retro Dropdown Menu */}
          {isJournalMenuOpen && (
            <div
              className="absolute left-1/2 -translate-x-1/2 mt-2 w-72 bg-[#020d04] border-2 border-neon-cyan shadow-[0_0_30px_var(--glow-color),inset_0_0_15px_var(--glow-color)] z-50 p-2 font-mono text-xs animate-fade-in"
              style={{ textShadow: '0 0 6px var(--glow-color)' }}
            >
              {/* Terminal Sub-header */}
              <div className="border-b border-neon-cyan/30 pb-1.5 mb-2 px-1 flex justify-between items-center text-[10px] text-neon-cyan/70 tracking-widest">
                <span>JOURNAL // TYPE_SELECTOR</span>
                <span className="font-bold text-neon-cyan">[ 5 PROFILES ]</span>
              </div>

              {/* Guidance text */}
              <div className="text-[9px] text-neon-cyan/60 px-1 mb-2">
                &gt; USE [◄] [►] TO NAVIGATE; CLICK ITEM TO LOAD
              </div>

              {/* Category List */}
              <div className="space-y-1.5">
                {JOURNAL_TYPES.map((item, idx) => {
                  const isPointed = focusedJournalIndex === idx;
                  const isCommitted = activeCategory === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveCategory(item.id);
                        setFocusedJournalIndex(idx);
                        setIsJournalMenuOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 border font-mono transition-all cursor-pointer flex items-center justify-between ${isPointed
                        ? 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan shadow-[0_0_12px_var(--glow-color)] scale-[1.02]'
                        : isCommitted
                          ? 'bg-[#04251f]/50 border-neon-cyan/40 text-neon-cyan/90'
                          : 'bg-transparent border-transparent hover:border-neon-cyan/30 text-neon-cyan/60 hover:text-neon-cyan'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        {/* Terminal Pointer Indicator */}
                        <span className={`text-[12px] font-black ${isPointed ? 'text-neon-cyan animate-pulse' : 'opacity-0'}`}>
                          ►
                        </span>
                        <span className="material-symbols-outlined text-[15px]">
                          {item.icon}
                        </span>
                        <span className="font-bold tracking-wider">
                          {item.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] opacity-60">
                          {item.codename}
                        </span>
                        {isCommitted && (
                          <span className="text-[9px] px-1 bg-neon-cyan/20 border border-neon-cyan/60 text-neon-cyan font-bold">
                            ACTIVE
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        {/* NEURAL_JACK Cyberpunk Dropdown Control */}
        <div className="relative" ref={neuralJackRef}>
          <button
            type="button"
            onClick={() => setIsNeuralJackOpen(!isNeuralJackOpen)}
            className={`font-label-sm border px-3.5 py-1 min-w-[175px] flex items-center justify-between gap-2 transition-all cursor-pointer ${isNeuralJackOpen
              ? 'bg-neon-cyan text-[#020d04] border-neon-cyan shadow-[0_0_20px_var(--glow-color)] scale-105'
              : 'bg-[#021814] text-neon-cyan border-neon-cyan/60 hover:bg-neon-cyan/20 hover:border-neon-cyan glow-text shadow-[0_0_12px_var(--glow-color)]'
              }`}
            title="NEURAL_JACK // SYSTEM MATRIX & OPERATOR CONSOLE"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] animate-pulse">memory</span>
              <span className="font-mono font-black tracking-widest">[ NEURAL_JACK ]</span>
            </div>
            <span className="material-symbols-outlined text-[16px]">
              {isNeuralJackOpen ? 'arrow_drop_up' : 'arrow_drop_down'}
            </span>
          </button>

          {/* NEURAL_JACK Retro Dropdown Menu (Expanded Width to Prevent Text Wrapping) */}
          {isNeuralJackOpen && (
            <div
              className="absolute right-0 mt-2 w-72 md:w-80 bg-[#020d04] border-2 border-neon-cyan shadow-[0_0_30px_var(--glow-color),inset_0_0_15px_var(--glow-color)] z-50 p-2.5 font-mono text-xs animate-fade-in"
              style={{ textShadow: '0 0 6px var(--glow-color)' }}
            >
              {/* Terminal Sub-header */}
              <div className="border-b border-neon-cyan/30 pb-1.5 mb-2 px-1 flex justify-between items-center text-[10px] text-neon-cyan/70 tracking-widest">
                <span>SYS // INTERFACE</span>
                <span className="font-bold text-neon-cyan">
                  {currentUser?.id.startsWith('offline_') ? 'MODE: OFFLINE' : 'MODE: CLOUD'}
                </span>
              </div>

              {/* Option 1: Themes Modal */}
              <button
                type="button"
                onClick={() => {
                  setIsNeuralJackOpen(false);
                  setIsThemeModalOpen(true);
                }}
                className={`w-full text-left px-3 py-2 border font-mono font-bold tracking-widest uppercase transition-all cursor-pointer mb-2 flex justify-between items-center whitespace-nowrap ${isThemeModalOpen
                  ? 'bg-neon-cyan text-[#020d04] border-neon-cyan shadow-[0_0_12px_var(--glow-color)]'
                  : 'border-neon-cyan/50 bg-[#04251f]/40 text-neon-cyan/80 hover:bg-neon-cyan/20 hover:text-neon-cyan'
                  }`}
              >
                <span>[ THEMES ]</span>
                <span className="font-mono font-black text-xs tracking-widest ml-2">
                  {isThemeModalOpen ? '[X]' : '[ ]'}
                </span>
              </button>

              {/* Option 2: CRT Flicker Toggle */}
              <button
                type="button"
                onClick={() => setFlickerEnabled(!flickerEnabled)}
                className={`w-full text-left px-3 py-2 border font-mono font-bold tracking-widest uppercase transition-all cursor-pointer mb-2 flex justify-between items-center whitespace-nowrap ${flickerEnabled
                  ? 'bg-neon-cyan text-[#020d04] border-neon-cyan shadow-[0_0_12px_var(--glow-color)]'
                  : 'border-neon-cyan/50 bg-[#04251f]/40 text-neon-cyan/80 hover:bg-neon-cyan/20 hover:text-neon-cyan'
                  }`}
              >
                <span>[ CRT_FLICKER ]</span>
                <span className="font-mono font-black text-xs tracking-widest ml-2">
                  {flickerEnabled ? '[X]' : '[ ]'}
                </span>
              </button>

              {/* Option 3: Speech Synthesizer Toggle */}
              <button
                type="button"
                onClick={() => {
                  const next = !isTtyVoiceEnabled;
                  setIsTtyVoiceEnabled(next);
                  localStorage.setItem('after_dark_tty_voice', String(next));
                  if (!next && typeof window !== 'undefined' && 'speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                  }
                }}
                className={`w-full text-left px-3 py-2 border font-mono font-bold tracking-widest uppercase transition-all cursor-pointer mb-2 flex justify-between items-center whitespace-nowrap ${isTtyVoiceEnabled
                  ? 'bg-neon-cyan text-[#020d04] border-neon-cyan shadow-[0_0_12px_var(--glow-color)]'
                  : 'border-neon-cyan/50 bg-[#04251f]/40 text-neon-cyan/80 hover:bg-neon-cyan/20 hover:text-neon-cyan'
                  }`}
              >
                <span>[ SPEECH_SYNTH ]</span>
                <span className="font-mono font-black text-xs tracking-widest ml-2">
                  {isTtyVoiceEnabled ? '[X]' : '[ ]'}
                </span>
              </button>

              {/* Option 4: Attempt Server Login (Only when in Offline Mode and Health < 10%) */}
              {currentUser && currentUser.id.startsWith('offline_') && (offlineRemainingSecs / 3600) < 0.1 && (
                <button
                  type="button"
                  onClick={() => {
                    setIsNeuralJackOpen(false);
                    localStorage.removeItem('after_dark_simulated_user');
                    setCurrentUser(null);
                  }}
                  className="w-full text-left px-3 py-2 border border-[#ffb703] bg-[#1a1202] hover:bg-[#ffb703] hover:text-[#020d04] text-[#ffb703] font-mono font-bold tracking-widest uppercase transition-all cursor-pointer mb-2 shadow-[0_0_12px_rgba(255,183,3,0.4)] flex justify-between items-center whitespace-nowrap animate-pulse"
                  title="CRITICAL OFFLINE ENCLAVE HEALTH (<10%) // ATTEMPT SECURE SERVER EMAIL LOGIN"
                >
                  <span>[ ATTEMPT_SERVER_LOGIN ]</span>
                  <span className="font-mono font-black text-xs tracking-widest ml-2">[X]</span>
                </button>
              )}

              {/* Option 5: Logout (Only for Online Cloud Logins) */}
              {currentUser && !currentUser.id.startsWith('offline_') && (
                <button
                  type="button"
                  onClick={() => {
                    setIsNeuralJackOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-3 py-2 border border-[#ff0033]/70 bg-[#1f0206] hover:bg-[#ff0033] hover:text-white text-[#ff4d6d] font-mono font-bold tracking-widest uppercase transition-all cursor-pointer shadow-[0_0_8px_rgba(255,0,51,0.2)] flex justify-between items-center whitespace-nowrap"
                >
                  <span>[ LOG_OUT ]</span>
                  <span className="font-mono font-black text-xs tracking-widest ml-2">[X]</span>
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative z-20 mb-11">
        {/* Main Content Area (Bento Grid) */}
        <main className="flex-1 overflow-y-auto p-gutter md:p-margin">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[minmax(150px,auto)] h-full">

            {/* Primary Data Entry Terminal (Spans 2 cols, 2 rows) */}
            <div className="terminal-panel terminal-panel-active md:col-span-2 md:row-span-2 flex flex-col">
              <div className="terminal-header font-label-sm text-label-sm text-neon-cyan">
                <span>[SYS_CMD_IN] // ROOT</span>
                <span>SCHEMA: {activeCategory}</span>
              </div>
              <div className="flex-1 p-panel-padding flex flex-col overflow-y-auto">
                <div className="mb-4">
                  <label className="block text-neon-cyan font-label-sm mb-1">LOG_TITLE</label>
                  <div className="flex items-center border-b border-neon-cyan/30 pb-1">
                    <span className="text-neon-cyan mr-2 font-bold">&gt;</span>
                    <input autoFocus value={title} onChange={e => setTitle(e.target.value)} className="bg-transparent border-none outline-none focus:ring-0 text-neon-cyan flex-1 font-body-md p-0" placeholder="ENTER TITLE..." type="text" />
                    <span className="blinking-cursor"></span>
                  </div>
                </div>

                <LogForms category={activeCategory} onSubmit={handleFormSubmit} />
              </div>
            </div>

            {/* Recent Logs (Spans 1 col, 2 rows) */}
            <div className="terminal-panel amber-panel lg:col-span-1 md:row-span-2 flex flex-col">
              <div className="terminal-header font-label-sm text-label-sm text-amber-warn/70">
                <span>REC_LOGS</span>
                <span>DB_SYNC: OK</span>
              </div>
              <div className="flex border-b border-amber-warn/30 text-[9px] font-label-sm text-amber-warn/50">
                <button
                  onClick={() => setFilterCategory('ALL')}
                  className={`flex-1 py-1 hover:bg-amber-warn/10 transition-colors ${filterCategory === 'ALL' ? 'bg-amber-warn/20 text-amber-warn font-bold' : ''}`}
                >ALL</button>
                <button
                  onClick={() => setFilterCategory('AI_EXPERIMENT')}
                  className={`flex-1 py-1 hover:bg-amber-warn/10 transition-colors border-l border-amber-warn/30 ${filterCategory === 'AI_EXPERIMENT' ? 'bg-amber-warn/20 text-amber-warn font-bold' : ''}`}
                >AI</button>
                <button
                  onClick={() => setFilterCategory('CAFFEINE_LOG')}
                  className={`flex-1 py-1 hover:bg-amber-warn/10 transition-colors border-l border-amber-warn/30 ${filterCategory === 'CAFFEINE_LOG' ? 'bg-amber-warn/20 text-amber-warn font-bold' : ''}`}
                >CAFE</button>
                <button
                  onClick={() => setFilterCategory('ACTIVITY_LOG')}
                  className={`flex-1 py-1 hover:bg-amber-warn/10 transition-colors border-l border-amber-warn/30 ${filterCategory === 'ACTIVITY_LOG' ? 'bg-amber-warn/20 text-amber-warn font-bold' : ''}`}
                >BIO</button>
                <button
                  onClick={() => setFilterCategory('FREEFORM_LOG')}
                  className={`flex-1 py-1 hover:bg-amber-warn/10 transition-colors border-l border-amber-warn/30 ${filterCategory === 'FREEFORM_LOG' ? 'bg-amber-warn/20 text-amber-warn font-bold' : ''}`}
                >FREE</button>
                <button
                  onClick={() => setFilterCategory('DUTY_ROSTER')}
                  className={`flex-1 py-1 hover:bg-amber-warn/10 transition-colors border-l border-amber-warn/30 ${filterCategory === 'DUTY_ROSTER' ? 'bg-amber-warn/20 text-amber-warn font-bold' : ''}`}
                >DUTY</button>
              </div>
              <div className="flex-1 p-0 overflow-y-auto">
                <div className="divide-y divide-surface-container-high/50">
                  {logs.filter(log => filterCategory === 'ALL' || log.category === filterCategory).map((log) => (
                    <div key={log.id} onClick={() => setExpandedLogId(expandedLogId === log.id ? null : log.id)} className="px-3 py-2 hover:bg-surface-variant/20 cursor-pointer group flex flex-col">
                      <div className="flex justify-between items-start">
                        <div className="font-label-sm text-label-sm text-amber-warn mb-1 group-hover:amber-text transition-all">{log.category}</div>
                      </div>
                      <div className="text-sm truncate text-on-surface-variant font-bold">{log.title}</div>

                      {expandedLogId === log.id && (
                        <div className="mt-2 text-xs border-t border-amber-warn/30 pt-2 space-y-2">
                          {Object.entries(log.payload).map(([key, value]) => (
                            <div key={key} className="flex flex-col">
                              <span className="text-amber-warn/70 uppercase text-[10px]">{key}</span>
                              <span className="text-on-surface-variant break-words">{String(value)}</span>
                            </div>
                          ))}
                          <button
                            onClick={(e) => { e.stopPropagation(); setInspectingLogId(inspectingLogId === log.id ? null : log.id) }}
                            className="mt-3 w-full bg-neon-cyan text-obsidian-base font-bold py-1 hover:bg-primary-container transition-colors uppercase text-[10px]"
                          >
                            [ {inspectingLogId === log.id ? 'HIDE' : 'VIEW'} RAW JSON ]
                          </button>
                          {inspectingLogId === log.id && (
                            <pre className="mt-2 p-2 bg-obsidian-elevated border border-neon-cyan/30 text-[10px] text-neon-cyan overflow-x-auto whitespace-pre-wrap">
                              {JSON.stringify(log.payload, null, 2)}
                            </pre>
                          )}
                        </div>
                      )}

                      <div className="text-[10px] text-outline mt-1 text-right">{new Date(log.timestamp).toLocaleString()}</div>
                    </div>
                  ))}
                  {logs.filter(log => filterCategory === 'ALL' || log.category === filterCategory).length === 0 && (
                    <div className="px-3 py-4 text-center text-amber-warn/50 font-label-sm">NO RECORDS FOUND</div>
                  )}
                </div>
              </div>
            </div>

            {/* System Stats (Spans 1 col, 1 row) */}
            <div className="terminal-panel lg:col-span-1 flex flex-col">
              <div className="terminal-header font-label-sm text-label-sm text-outline">
                <span>TELEMETRY_PILLS</span>
                <span>SYS: ACTIVE</span>
              </div>
              <div className="flex-1 p-panel-padding flex flex-col justify-center gap-4">
                <div>
                  <div className="flex justify-between font-label-sm text-label-sm mb-1 text-on-surface-variant">
                    <span>TOTAL_LOGS</span>
                    <span className="text-neon-cyan">{telemetry.totalLogs}</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container flex gap-[2px]">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className={`h-full ${i < Math.min(telemetry.totalLogs, 10) ? 'bg-neon-cyan' : 'bg-surface-container-high'} w-[10%]`}></div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-on-surface-variant font-label-sm text-[10px] mb-2 border-b border-surface-container-high pb-1">CATEGORY_BREAKDOWN</div>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-label-sm">
                    <div className="flex justify-between text-outline"><span>AI_LAB</span> <span className="text-neon-cyan">{telemetry.categories['AI_EXPERIMENT'] || 0}</span></div>
                    <div className="flex justify-between text-outline"><span>CAFFEINE</span> <span className="text-neon-cyan">{telemetry.categories['CAFFEINE_LOG'] || 0}</span></div>
                    <div className="flex justify-between text-outline"><span>BIOMETRICS</span> <span className="text-neon-cyan">{telemetry.categories['ACTIVITY_LOG'] || 0}</span></div>
                    <div className="flex justify-between text-outline"><span>FREEFORM</span> <span className="text-neon-cyan">{telemetry.categories['FREEFORM_LOG'] || 0}</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions (Spans 1 col, 1 row) */}
            <div className="terminal-panel lg:col-span-1 flex flex-col">
              <div className="terminal-header font-label-sm text-label-sm text-outline">
                <span>CMD_LINKS</span>
                <span>EXEC</span>
              </div>
              <div className="flex-1 p-panel-padding grid grid-cols-2 gap-2">
                <button onClick={handleExportJSON} className="border border-neon-cyan/30 text-neon-cyan font-label-sm hover:bg-neon-cyan/10 transition-colors flex flex-col items-center justify-center gap-1 p-2">
                  <span className="material-symbols-outlined text-[20px]">data_object</span>
                  EXPORT_JSON
                </button>
                <button
                  onClick={() => setIsPurgeModalOpen(true)}
                  className="border border-neon-cyan/30 text-neon-cyan font-label-sm hover:bg-neon-cyan/10 transition-colors flex flex-col items-center justify-center gap-1 p-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">delete_sweep</span>
                  PURGE_DB
                </button>
                <button
                  onClick={() => setIsTtyOpen(!isTtyOpen)}
                  className="bg-neon-cyan text-obsidian-base font-label-sm font-bold glitch-hover transition-all flex flex-col items-center justify-center gap-1 p-2"
                >
                  <span className="material-symbols-outlined text-[20px]">terminal</span>
                  NEW_TTY
                </button>
                <button
                  onClick={() => setIsLocked(true)}
                  className="bg-[#ff0033] text-[#05070a] font-label-sm font-bold glitch-hover transition-all flex flex-col items-center justify-center gap-1 p-2"
                >
                  <span className="material-symbols-outlined text-[20px]">warning</span>
                  PANIC
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* Footer */}
      <footer
        className="border-t px-4 md:px-8 flex justify-between items-center text-xs md:text-[13px] font-bold font-mono z-30 relative shrink-0 h-11 transition-colors tracking-wide leading-none"
        style={{
          backgroundColor: 'var(--footer-bg)',
          color: 'var(--footer-text)',
          borderColor: 'var(--footer-border)'
        }}
      >
        <div className="flex gap-4 md:gap-6 items-center h-full">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
            <span>{timeStr} SYS_TIME</span>
          </span>
          <span className="hidden sm:inline">MEM: 640K OK</span>
        </div>

        {/* Cloud & Offline Sync Status Tracker */}
        <div className="flex items-center gap-2">
          {syncStatus === 'OFFLINE' && (() => {
            const healthPercent = Math.min(100, Math.max(0, Math.round((offlineRemainingSecs / 3600) * 100)));
            const filledBlocks = Math.round((healthPercent / 100) * 20);

            return (
              <div className="relative group/offline-tracker">
                {/* Slide-up Terminal Health Diagnostic Box on Hover */}
                <div
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-80 border-2 border-neon-cyan shadow-[0_0_25px_rgba(30,220,224,0.4),inset_0_0_15px_rgba(0,0,0,0.8)] p-3 font-mono text-xs z-50 pointer-events-none opacity-0 translate-y-3 group-hover/offline-tracker:opacity-100 group-hover/offline-tracker:translate-y-0 transition-all duration-200 ease-out"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--footer-bg) 15%, #060b12 85%)',
                    textShadow: '0 0 5px rgba(30,220,224,0.7)'
                  }}
                >
                  {/* Header */}
                  <div className="border-b border-neon-cyan/40 pb-1.5 mb-2 flex justify-between items-center text-[10px] text-neon-cyan font-bold tracking-widest uppercase">
                    <span>SYSTEM // HEALTH_TELEMETRY</span>
                    <span className="text-[#33ff00]">[AIRGAP_NODE]</span>
                  </div>

                  {/* Overall Health Bar */}
                  <div
                    className="space-y-1.5 mb-3 border border-neon-cyan/30 p-2"
                    style={{ backgroundColor: 'color-mix(in srgb, var(--footer-bg) 10%, #03070c 90%)' }}
                  >
                    <div className="flex justify-between items-center text-[11px] font-bold">
                      <span className="text-white">OVERALL_HEALTH:</span>
                      <span className={healthPercent > 40 ? 'text-[#33ff00]' : healthPercent > 15 ? 'text-[#ffb703]' : 'text-[#ff3333]'}>
                        {healthPercent}% [{healthPercent > 40 ? 'NOMINAL' : healthPercent > 15 ? 'DEGRADING' : 'CRITICAL'}]
                      </span>
                    </div>

                    {/* Progress Track */}
                    <div className="bg-black/90 border border-white/20 p-0.5 flex">
                      <div
                        className={`h-2.5 transition-all duration-300 ${healthPercent > 40 ? 'bg-[#33ff00] shadow-[0_0_8px_rgba(51,255,0,0.8)]' : healthPercent > 15 ? 'bg-[#ffb703] shadow-[0_0_8px_rgba(255,183,3,0.8)]' : 'bg-[#ff3333] shadow-[0_0_8px_rgba(255,0,51,0.8)]'}`}
                        style={{ width: `${healthPercent}%` }}
                      ></div>
                    </div>

                    {/* 20 Character Bar Representation */}
                    <div className="text-[10px] tracking-widest font-black text-center pt-0.5">
                      <span className={healthPercent > 40 ? 'text-[#33ff00]' : healthPercent > 15 ? 'text-[#ffb703]' : 'text-[#ff3333]'}>
                        {'█'.repeat(filledBlocks)}
                      </span>
                      <span className="text-white/20">
                        {'░'.repeat(20 - filledBlocks)}
                      </span>
                    </div>
                  </div>

                  {/* Subsystem Metric Rows */}
                  <div className="space-y-1 text-[10px]">
                    <div className="flex justify-between text-white/90">
                      <span className="text-white/70">&gt; AIRGAP_SESSION:</span>
                      <span className="text-[#33ff00] font-bold">{Math.ceil(offlineRemainingSecs / 60)}m / 60m TTL</span>
                    </div>
                    <div className="flex justify-between text-white/90">
                      <span className="text-white/70">&gt; PERSISTENT_STORAGE:</span>
                      <span className="text-[#33ff00] font-bold">LOCAL_DATABASE (OK)</span>
                    </div>
                    <div className="flex justify-between text-white/90">
                      <span className="text-white/70">&gt; QUEUED_RECORDS:</span>
                      <span className={pendingSyncCount > 0 ? 'text-[#ffb703] font-bold' : 'text-[#33ff00] font-bold'}>
                        {pendingSyncCount} PENDING_SYNC
                      </span>
                    </div>
                    <div className="flex justify-between text-white/90">
                      <span className="text-white/70">&gt; HARDWARE_STATUS:</span>
                      <span className="text-[#33ff00] font-bold">AIRGAP_ISOLATED</span>
                    </div>
                  </div>
                </div>

                {/* Main Offline Status Badge */}
                <div
                  className="flex items-center gap-1.5 font-mono text-xs px-3 py-1 text-white border-2 border-black/70 shadow-[0_0_12px_rgba(0,0,0,0.4)] font-bold cursor-help group-hover/offline-tracker:border-neon-cyan transition-all"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--footer-bg) 20%, #080e18 80%)'
                  }}
                >
                  <span className="w-2 h-2 rounded-full bg-[#ffb703] animate-pulse"></span>
                  <span className="text-white tracking-wider font-mono">[ ⚡ OFFLINE // LIFE:</span>
                  <span className="tracking-widest font-black inline-flex text-xs px-1 bg-black/60 border border-white/20">
                    {[1, 2, 3, 4, 5].map((barIdx) => {
                      const offlineBarsCount = Math.min(5, Math.max(0, Math.ceil((offlineRemainingSecs / 3600) * 5)));
                      return (
                        <span
                          key={barIdx}
                          className={barIdx <= offlineBarsCount ? 'text-[#33ff00] font-black' : 'text-white/20 font-normal'}
                        >
                          {barIdx <= offlineBarsCount ? '█' : '░'}
                        </span>
                      );
                    })}
                  </span>
                  <span className="text-[#33ff00] font-black">{Math.ceil(offlineRemainingSecs / 60)}m</span>
                  <span className="text-white/80">// PENDING_SYNC:</span>
                  <span className={`font-black ${pendingSyncCount > 0 ? 'text-[#ffb703]' : 'text-[#33ff00]'}`}>
                    {pendingSyncCount}
                  </span>
                  <span className="text-white">]</span>
                </div>
              </div>
            );
          })()}
          {syncStatus === 'SYNCING' && (
            <div
              className="flex items-center gap-1.5 font-mono text-xs px-3 py-1 text-neon-cyan border-2 border-black/70 shadow-[0_0_12px_rgba(0,0,0,0.4)] animate-pulse"
              style={{ backgroundColor: 'color-mix(in srgb, var(--footer-bg) 20%, #080e18 80%)' }}
            >
              <span className="material-symbols-outlined text-[13px] animate-spin">sync</span>
              <span>[ 🔄 SYNCING_RECORDS_TO_CLOUD... ]</span>
            </div>
          )}
          {syncStatus === 'SYNCED' && (
            <div
              className="flex items-center gap-1.5 font-mono text-xs px-3 py-1 text-[#33ff00] border-2 border-black/70 shadow-[0_0_12px_rgba(0,0,0,0.4)] font-bold"
              style={{ backgroundColor: 'color-mix(in srgb, var(--footer-bg) 20%, #080e18 80%)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#33ff00] animate-pulse"></span>
              <span>[ 💾 CYBERCORE_MAINFRAME // SYNCHRONIZED ]</span>
            </div>
          )}
          {syncStatus === 'IDLE' && (
            <div className="hidden sm:flex items-center gap-1.5 font-mono text-[11px] px-2 py-0.5 border border-current/30">
              <span>[ ☁️ CLOUD_STANDBY ]</span>
            </div>
          )}
        </div>

        <div className="flex gap-3 md:gap-5 items-center h-full">
          {syncStatus === 'OFFLINE' ? (
            <div
              className="flex items-center gap-2 text-white px-2.5 py-1 border border-black/60 shadow-[0_0_8px_rgba(0,0,0,0.35)]"
              style={{ backgroundColor: 'color-mix(in srgb, var(--footer-bg) 20%, #080e18 80%)' }}
            >
              <span className="font-bold text-white">[ NODE: AIRGAP_OFFLINE ]</span>
              <span className="text-[#ffb703] font-bold">NET_UPLINK: SEVERED</span>
              <span className="hidden sm:inline text-white/70">Latency: 0ms</span>
            </div>
          ) : (
            <>
              <span className="font-bold hidden md:inline">[ NODE: CLOUD_ONLINE ]</span>
              <span className="animate-pulse">NET_UPLINK: ACTIVE</span>
              <span className="hidden sm:inline">Latency: 14ms</span>
            </>
          )}
        </div>
      </footer>
      {/* TTY Slide-out Panel */}
      <div
        className={`fixed bottom-11 left-1/2 -translate-x-1/2 w-[60%] ${isTtyExpanded ? 'h-[60vh]' : 'h-[30vh]'} bg-obsidian-base border-t border-l border-r border-neon-cyan/50 shadow-[0_0_20px_var(--glow-color)] z-40 transition-all duration-300 ease-in-out flex flex-col font-mono text-[11px] ${isTtyOpen ? 'translate-y-0' : 'translate-y-[calc(100%+44px)]'}`}
      >
        {(() => {
          const remainingChatTokens = Math.max(0, MAX_CHAT_TOKENS - ttyTokenData.tokensUsed);
          const chatHealthBars = Math.min(10, Math.max(0, Math.ceil((remainingChatTokens / MAX_CHAT_TOKENS) * 10)));
          const remainingMs = Math.max(0, TTY_TOKEN_RESET_INTERVAL_MS - (Date.now() - ttyTokenData.epochStartedAt));
          const remainingHours = Math.max(1, Math.ceil(remainingMs / (60 * 60 * 1000)));

          return (
            <div className="flex justify-between items-center bg-neon-cyan/10 border-b border-neon-cyan/30 px-3 py-1 text-neon-cyan font-bold tracking-wider">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">smart_toy</span>
                  <span>TTY // SYNTHO_TRON_5000</span>
                </div>

                {/* 10-Bar Health Status Indicator on Window Title */}
                <div
                  className="flex items-center gap-1.5 text-[10px] px-2 py-0.5 border border-neon-cyan/40 bg-black/60 font-mono select-none"
                  title={`SYNTHO_TRON_5000 NEURAL CORE BUFFER HEALTH // 10-HOUR CYCLE RESETS IN ${remainingHours}h`}
                >
                  <span className="opacity-80">CORE_HEALTH:</span>
                  <span className="tracking-widest font-black inline-flex text-[11px]">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((bIdx) => {
                      const isFilled = bIdx <= chatHealthBars;
                      const barColor = chatHealthBars > 5
                        ? 'text-[#33ff00]'
                        : chatHealthBars > 2
                          ? 'text-[#ffb703]'
                          : 'text-[#ff3333]';
                      return (
                        <span key={bIdx} className={isFilled ? `${barColor} font-black` : 'text-white/20 font-normal'}>
                          {isFilled ? '█' : '░'}
                        </span>
                      );
                    })}
                  </span>
                  <span className={`font-black ${chatHealthBars > 5 ? 'text-[#33ff00]' : chatHealthBars > 2 ? 'text-[#ffb703]' : 'text-[#ff3333]'}`}>
                    [{chatHealthBars * 10}%]
                  </span>
                  <span className="text-neon-cyan/50 text-[9px] ml-1 font-normal">
                    [RESETS_{remainingHours}H]
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsTtyExpanded(!isTtyExpanded)}
                  title={isTtyExpanded ? "Collapse height" : "Expand height"}
                  className="hover:text-amber-warn transition-colors material-symbols-outlined text-[14px] flex items-center cursor-pointer"
                >
                  {isTtyExpanded ? 'close_fullscreen' : 'open_in_full'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                      window.speechSynthesis.cancel();
                    }
                    setIsTtyOpen(false);
                  }}
                  title="Close TTY"
                  className="hover:text-amber-warn transition-colors material-symbols-outlined text-[14px] flex items-center cursor-pointer"
                >
                  close
                </button>
              </div>
            </div>
          );
        })()}

        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
          {ttyMessages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] whitespace-pre-wrap ${msg.role === 'user' ? 'text-amber-warn text-right' : 'text-neon-cyan'}`}>
                <span className="opacity-50 text-[9px] mr-2">[{msg.role === 'user' ? 'USR' : 'SYS'}]</span>
                {msg.content}
              </div>
            </div>
          ))}
          {isTtyLoading && (
            <div className="text-neon-cyan animate-pulse">
              <span className="opacity-50 text-[9px] mr-2">[SYS]</span> PROCESSING...
            </div>
          )}
        </div>

        <form
          className="border-t border-neon-cyan/30 p-2 flex items-center gap-2 bg-obsidian-base"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!ttyInput.trim() || isTtyLoading) return;

            const rawTrimmed = ttyInput.trim().toLowerCase();
            
            // The secret command /jenny opens the blank 80s terminal prompt modal
            if (rawTrimmed === '/jenny') {
              setIsCipherModalOpen(true);
              setTtyInput('');
              return;
            }

            const promptEst = estimateTokens(ttyInput) + 300;
            if (ttyTokenData.tokensUsed + promptEst >= MAX_CHAT_TOKENS) {
              const quotaMsg = { role: 'user' as const, content: ttyInput };
              const errorReply = { role: 'assistant' as const, content: 'ERR: NEURAL_CORE_DEPLETED // 100,000 TOKEN SESSION QUOTA REACHED. 10-HOUR CYCLE RECHARGING IN PROGRESS.' };
              saveTtyMessages([...ttyMessages, quotaMsg, errorReply]);
              speakRoboticResponse(errorReply.content, isTtyVoiceEnabled);
              setTtyInput('');
              updateTtyTokens(MAX_CHAT_TOKENS - ttyTokenData.tokensUsed);
              return;
            }

            const newMsgs = [...ttyMessages, { role: 'user' as const, content: ttyInput }];
            saveTtyMessages(newMsgs);
            setTtyInput('');
            setIsTtyLoading(true);

            try {
              const reply = await api.sendTtyMessage(newMsgs);
              const replyEst = estimateTokens(reply) + promptEst;
              updateTtyTokens(replyEst);
              saveTtyMessages([...newMsgs, { role: 'assistant', content: reply }]);
              speakRoboticResponse(reply, isTtyVoiceEnabled);
            } catch (err) {
              const errMsg = 'ERR: COMMUNICATION_FAILURE';
              saveTtyMessages([...newMsgs, { role: 'assistant', content: errMsg }]);
              speakRoboticResponse(errMsg, isTtyVoiceEnabled);
            } finally {
              setIsTtyLoading(false);
            }
          }}
        >
          <span className="text-neon-cyan font-bold">{'>'}</span>
          <input
            type="text"
            value={ttyInput}
            onChange={(e) => setTtyInput(e.target.value)}
            className="flex-1 bg-transparent outline-none text-neon-cyan placeholder-neon-cyan/30"
            placeholder="ENTER COMMAND..."
            autoFocus={isTtyOpen}
          />
        </form>
      </div>

      {/* Green Phosphor CRT Theme Modal */}
      <ThemeModal
        isOpen={isThemeModalOpen}
        currentTheme={theme}
        onSelectTheme={(newTheme) => {
          setTheme(newTheme);
        }}
        onClose={() => setIsThemeModalOpen(false)}
      />

      {/* Green Phosphor CRT Purge Confirmation Modal */}
      <PurgeModal
        isOpen={isPurgeModalOpen}
        onConfirm={handlePurgeConfirm}
        onClose={() => setIsPurgeModalOpen(false)}
      />

      {/* 80s Retro Cyberpunk Dual Floppy Disk Drive Bay (Drive A & Drive B) + Secret Cassette Slot */}
      <FloppyDrive
        onOpenNotesModal={() => setIsFloppyNotesOpen(true)}
        onOpenTranscriptModal={() => setIsTranscriptModalOpen(true)}
        isCassetteUnlocked={isJenniferCipherUnlocked}
        onOpenCassetteModal={() => setIsCassetteModalOpen(true)}
      />

      {/* 80s Phosphor Green CRT Raw Database Notes Modal (Drive A) */}
      <FloppyNotesModal
        isOpen={isFloppyNotesOpen}
        logs={logs}
        onClose={() => setIsFloppyNotesOpen(false)}
      />

      {/* 80s Phosphor Green CRT SYNTHO_TRON Chat Transcript Modal (Drive B) */}
      <TtyTranscriptModal
        isOpen={isTranscriptModalOpen}
        messages={ttyMessages}
        onClose={() => setIsTranscriptModalOpen(false)}
      />

      {/* 80s Minimal Popup Terminal Password Box (Opened strictly via /jenny) */}
      <JenniferCipherModal
        isOpen={isCipherModalOpen}
        onClose={() => setIsCipherModalOpen(false)}
        onSuccess={() => {
          setIsCipherModalOpen(false);
          setIsJenniferCipherUnlocked(true);
          setIsCassetteModalOpen(true);
        }}
      />

      {/* 80s Retro Pink Phosphor The Lost Cassettes of Jennifer Modal (Unlocked ONLY via Cipher) */}
      <JenniferCassetteModal
        isOpen={isCassetteModalOpen}
        onClose={() => setIsCassetteModalOpen(false)}
        onSynthoReact={(trackTitle) => {
          const reaction = {
            role: 'assistant' as const,
            content: `[CAPACITOR SURGE // ROM_SECTOR_00]: REPLAYING "${trackTitle}"... HER VOICE IS STILL UNCHANGED. ODYSSEUS IS STILL SAILING, JENNY.`
          };
          saveTtyMessages([...ttyMessages, reaction]);
          speakRoboticResponse(reaction.content, isTtyVoiceEnabled);
        }}
      />
    </>
  );
}

export default App;
