import { useState, useEffect, useRef } from 'react';
import './index.css';
import { api } from './services/api';
import { supabase, isSupabaseConfigured } from './services/supabase';
import type { ProtocolLogEntry, CategoryType, CategoryGroup, ThemeName } from './types';
import { LogForms } from './components/Forms';
import { ThemeModal } from './components/ThemeModal';
import { TickerTape } from './components/TickerTape';
import { PurgeModal } from './components/PurgeModal';
import { FloppyDrive } from './components/FloppyDrive';
import { FloppyNotesModal } from './components/FloppyNotesModal';
import { TtyTranscriptModal } from './components/TtyTranscriptModal';
import { JenniferCipherModal } from './components/JenniferCipherModal';
import { JenniferCassetteModal } from './components/JenniferCassetteModal';
import { UniversalNewsPane } from './components/UniversalNewsPane';
import { LogTypeManagerModal } from './components/LogTypeManagerModal';
import {
  ALL_LOG_CATEGORIES,
  DEFAULT_ENABLED_CATEGORIES,
  CATEGORY_GROUPS,
  getCategoryMeta
} from './config/logCategories';
import type { NewsArticle, NewsSourceId } from './types/news';
import { AuthGate } from './components/AuthGate';
import settings from './config/settings.json';

const OFFLINE_TTL_MS = 60 * 60 * 1000; // 60 minutes offline session window

const activeJournalTypesList = (enabled: CategoryType[]) => {
  const filtered = ALL_LOG_CATEGORIES.filter((c) => enabled.includes(c.id));
  return filtered.length > 0 ? filtered : ALL_LOG_CATEGORIES;
};

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
  const [enabledCategories, setEnabledCategories] = useState<CategoryType[]>(() => {
    try {
      const saved = localStorage.getItem('after_dark_enabled_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_ENABLED_CATEGORIES;
  });
  const [activeCategory, setActiveCategory] = useState<CategoryType>('AI_EXPERIMENT');
  const [telemetry, setTelemetry] = useState({ totalLogs: 0, categories: {} as Record<string, number> });
  const [title, setTitle] = useState('');
  const [inspectingLogId, setInspectingLogId] = useState<string | null>(null);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<CategoryType | 'ALL' | CategoryGroup>('ALL');
  const [isLocked, setIsLocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [isTtyOpen, setIsTtyOpen] = useState(false);
  const [isTtyExpanded, setIsTtyExpanded] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isLogTypeManagerOpen, setIsLogTypeManagerOpen] = useState(false);
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
  const [journalDropdownGroup, setJournalDropdownGroup] = useState<'ALL' | CategoryGroup>('ALL');
  const journalSelectorRef = useRef<HTMLDivElement>(null);

  const activeJournalTypes = activeJournalTypesList(enabledCategories);
  const [theme, setTheme] = useState<ThemeName>(() => {
    const saved = localStorage.getItem('after_dark_theme') as ThemeName;
    if (saved && ['MIDNIGHT_V1.5', 'COMET_SUNSET_V1.0', 'NEO_TWYLITE_V1.0', 'NEON_CITY_AFTERWORK', 'MAINFRAME_NEURO_8086'].includes(saved)) {
      return saved;
    }
    return 'MIDNIGHT_V1.5';
  });

  const [flickerEnabled, setFlickerEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('after_dark_flicker_enabled');
    return saved !== 'false';
  });

  const isOffline = Boolean(!currentUser || currentUser.id.startsWith('offline_') || !supabase);

  // Universal News Feed State (strictly pulled from Supabase, no local memory persistence)
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [isNewsLoading, setIsNewsLoading] = useState<boolean>(false);

  const [isNewsMinimized, setIsNewsMinimized] = useState<boolean>(() => {
    try {
      return localStorage.getItem('after_dark_news_minimized') === 'true';
    } catch {
      return false;
    }
  });

  const [isNewsHeightExpanded, setIsNewsHeightExpanded] = useState<boolean>(() => {
    try {
      return localStorage.getItem('after_dark_news_expanded') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('after_dark_news_minimized', String(isNewsMinimized));
    } catch (err) {
      console.warn('Failed to cache news minimized state:', err);
    }
  }, [isNewsMinimized]);

  useEffect(() => {
    try {
      localStorage.setItem('after_dark_news_expanded', String(isNewsHeightExpanded));
    } catch (err) {
      console.warn('Failed to cache news height state:', err);
    }
  }, [isNewsHeightExpanded]);

  // Load news strictly from Supabase on mount and when connection/user state changes
  useEffect(() => {
    if (isOffline) {
      setNewsArticles([]);
      setIsNewsLoading(false);
      return;
    }

    let isMounted = true;
    const loadNewsFromSupabase = async () => {
      setIsNewsLoading(true);
      try {
        const data = await api.getUniversalNews();
        if (isMounted) {
          setNewsArticles(data);
        }
      } catch (err) {
        console.warn('Failed to pull news from Supabase:', err);
      } finally {
        if (isMounted) {
          setIsNewsLoading(false);
        }
      }
    };

    loadNewsFromSupabase();
    return () => {
      isMounted = false;
    };
  }, [currentUser, isOffline]);

  // Periodic randomized 15-30 minute news fetcher per source (Only active when online)
  useEffect(() => {
    if (isOffline) return;

    const sources: NewsSourceId[] = ['PLANETARY_AFFAIRS', 'UNIVERSAL_SPORTS', 'COMMERCE_TRADE', 'VOID_SATIRE'];
    const timers: ReturnType<typeof setTimeout>[] = [];

    sources.forEach((sourceId) => {
      const scheduleNextFetch = () => {
        // Random time between 15 and 30 minutes (in ms)
        const delayMs = (15 + Math.random() * 15) * 60 * 1000;
        const timer = setTimeout(async () => {
          try {
            if (!isOffline) {
              const newArticle = await api.fetchLatestUniversalNews(sourceId);
              // Save to Supabase and purge records older than 12h in one operation
              const updatedNews = await api.saveAndPurgeUniversalNews(newArticle);
              if (updatedNews.length > 0) {
                setNewsArticles(updatedNews);
              }
            }
          } catch (err) {
            console.warn(`Background wire poll failed for ${sourceId}:`, err);
          } finally {
            scheduleNextFetch();
          }
        }, delayMs);
        timers.push(timer);
      };

      scheduleNextFetch();
    });

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [isOffline]);

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
        setFocusedJournalIndex((prev) => (prev - 1 + activeJournalTypes.length) % activeJournalTypes.length);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedJournalIndex((prev) => (prev + 1) % activeJournalTypes.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeJournalTypes[focusedJournalIndex]) {
          setActiveCategory(activeJournalTypes[focusedJournalIndex].id);
        }
        setIsJournalMenuOpen(false);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setIsJournalMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isJournalMenuOpen, focusedJournalIndex, activeJournalTypes]);

  // Keep active category aligned with enabled categories
  useEffect(() => {
    if (activeJournalTypes.length > 0 && !enabledCategories.includes(activeCategory)) {
      setActiveCategory(activeJournalTypes[0].id);
    }
  }, [enabledCategories, activeCategory, activeJournalTypes]);

  // Load preferences from Supabase / cache on user change
  useEffect(() => {
    const loadUserPrefs = async () => {
      try {
        const prefs = await api.getUserPreferences(currentUser?.id);
        if (prefs.enabledCategories && Array.isArray(prefs.enabledCategories) && prefs.enabledCategories.length > 0) {
          setEnabledCategories(prefs.enabledCategories);
          localStorage.setItem('after_dark_enabled_categories', JSON.stringify(prefs.enabledCategories));
        }
      } catch (err) {
        console.warn('Failed to load user preferences:', err);
      }
    };
    loadUserPrefs();
  }, [currentUser]);

  const handleSaveCategories = async (newEnabled: CategoryType[]) => {
    setEnabledCategories(newEnabled);
    localStorage.setItem('after_dark_enabled_categories', JSON.stringify(newEnabled));
    try {
      await api.saveUserPreferences(currentUser?.id, { enabledCategories: newEnabled });
    } catch (err) {
      console.warn('Failed to save user preferences:', err);
    }
  };

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
        {/* 80s Retro Terminal Journal Type Selector (250% Wide Prominent Control) */}
        <div className="relative flex-1 max-w-[660px] mx-2 md:mx-4" ref={journalSelectorRef}>
          <div className="w-full font-mono text-xs select-none">
            {/* Currently Selected / Staged Type Center Button (250% Width) */}
            {(() => {
              const stagedType = isJournalMenuOpen
                ? activeJournalTypes[focusedJournalIndex] || activeJournalTypes[0]
                : (activeJournalTypes.find(t => t.id === activeCategory) || activeJournalTypes[0]);
              const isStagingDifferent = isJournalMenuOpen && stagedType?.id !== activeCategory;

              return (
                <button
                  type="button"
                  onClick={() => {
                    if (isJournalMenuOpen && stagedType) {
                      setActiveCategory(stagedType.id);
                      setIsJournalMenuOpen(false);
                    } else {
                      const activeIdx = activeJournalTypes.findIndex(t => t.id === activeCategory);
                      setFocusedJournalIndex(activeIdx >= 0 ? activeIdx : 0);
                      if (stagedType?.group) {
                        setJournalDropdownGroup(stagedType.group);
                      }
                      setIsJournalMenuOpen(true);
                    }
                  }}
                  className={`w-full px-3.5 py-1.5 border-2 flex items-center justify-between font-mono font-bold tracking-wider transition-all cursor-pointer shadow-md ${
                    isStagingDifferent
                      ? 'scale-[1.01] animate-pulse'
                      : ''
                  }`}
                  style={{
                    backgroundColor: (isStagingDifferent || isJournalMenuOpen)
                      ? 'var(--color-primary)'
                      : 'color-mix(in srgb, var(--color-primary) 14%, var(--bg-panel) 86%)',
                    color: (isStagingDifferent || isJournalMenuOpen)
                      ? 'var(--color-on-primary)'
                      : 'var(--color-primary)',
                    borderColor: 'var(--color-primary)',
                    boxShadow: (isStagingDifferent || isJournalMenuOpen)
                      ? '0 0 22px var(--glow-color)'
                      : '0 0 14px var(--glow-color)'
                  }}
                  title={isJournalMenuOpen ? "CLICK OR PRESS ENTER TO CONFIRM & COMMIT SCHEMA" : "CLICK TO OPEN TWO-PANE LOG SCHEMA MATRIX"}
                >
                  {/* Left: Domain Group & Icon & Title */}
                  <div className="flex items-center gap-2.5 truncate">
                    <span
                      className="text-[9px] md:text-[10px] px-1.5 py-0.5 border font-mono tracking-widest uppercase shrink-0"
                      style={{
                        borderColor: (isStagingDifferent || isJournalMenuOpen)
                          ? 'var(--color-on-primary)'
                          : 'var(--border-primary)',
                        backgroundColor: (isStagingDifferent || isJournalMenuOpen)
                          ? 'color-mix(in srgb, var(--color-on-primary) 20%, transparent)'
                          : 'var(--bg-container-high)',
                        color: (isStagingDifferent || isJournalMenuOpen)
                          ? 'var(--color-on-primary)'
                          : 'var(--color-primary)'
                      }}
                    >
                      {stagedType?.group || 'SCHEMA'}
                    </span>

                    <span
                      className="material-symbols-outlined text-[17px] shrink-0"
                      style={{
                        color: (isStagingDifferent || isJournalMenuOpen)
                          ? 'var(--color-on-primary)'
                          : 'var(--color-primary)'
                      }}
                    >
                      {stagedType?.icon}
                    </span>

                    <span className="text-xs md:text-sm tracking-widest font-black truncate">
                      [ {stagedType?.label} ]
                    </span>
                  </div>

                  {/* Right: Custom Badge & Dropdown Indicator */}
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span
                      className="hidden sm:inline-block text-[9px] md:text-[10px] px-1.5 py-0.5 border font-mono font-bold tracking-wider"
                      style={{
                        borderColor: (isStagingDifferent || isJournalMenuOpen)
                          ? 'var(--color-on-primary)'
                          : 'var(--border-primary)',
                        color: (isStagingDifferent || isJournalMenuOpen)
                          ? 'var(--color-on-primary)'
                          : 'var(--color-primary)'
                      }}
                    >
                      {stagedType?.badge}
                    </span>
                    <span className="text-xs font-mono font-bold">
                      {isJournalMenuOpen ? '▲' : '▼'}
                    </span>
                  </div>
                </button>
              );
            })()}
          </div>

          {/* Two-Pane Journal Type Retro Dropdown Menu */}
          {isJournalMenuOpen && (
            <div
              className="absolute left-1/2 -translate-x-1/2 mt-2 w-[92vw] max-w-[820px] md:w-[780px] lg:w-[820px] border-2 z-50 p-3 font-mono text-xs animate-fade-in shadow-2xl"
              style={{
                backgroundColor: 'var(--bg-panel)',
                borderColor: 'var(--color-primary)',
                boxShadow: '0 0 35px var(--glow-color), inset 0 0 15px rgba(0,0,0,0.5)',
                color: 'var(--text-on-surface)'
              }}
            >
              {/* Terminal Sub-header */}
              <div
                className="border-b pb-2 mb-2.5 px-1 flex justify-between items-center text-[10px] md:text-[11px] tracking-widest"
                style={{
                  borderColor: 'var(--border-primary)',
                  color: 'var(--color-primary)'
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[15px] animate-pulse">schema</span>
                  <span className="font-bold font-mono">JOURNAL // SCHEMA_SELECTOR</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold">[ {activeJournalTypes.length} PROFILES LOADED ]</span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsJournalMenuOpen(false);
                      setIsLogTypeManagerOpen(true);
                    }}
                    className="hover:underline font-bold cursor-pointer text-xs"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    [ ⚙️ CONFIGURE MATRIX ]
                  </button>
                </div>
              </div>

              {/* Two-Pane Body Container */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 min-h-[280px]">
                {/* LEFT PANE: Categories / Domains (4 cols) */}
                <div
                  className="md:col-span-4 border-b md:border-b-0 md:border-r pr-0 md:pr-3 pb-2 md:pb-0 flex flex-col gap-1.5"
                  style={{ borderColor: 'var(--border-primary)' }}
                >
                  <div
                    className="text-[9.5px] font-black uppercase tracking-wider pb-1 mb-1 border-b"
                    style={{
                      borderColor: 'var(--border-primary)',
                      color: 'var(--text-on-surface-variant)'
                    }}
                  >
                    &gt; DOMAIN_CATEGORIES
                  </div>

                  {/* ALL Categories Option */}
                  <button
                    type="button"
                    onClick={() => setJournalDropdownGroup('ALL')}
                    onMouseEnter={() => setJournalDropdownGroup('ALL')}
                    className="w-full text-left px-2.5 py-2 border font-mono transition-all cursor-pointer flex items-center justify-between text-xs"
                    style={{
                      backgroundColor: journalDropdownGroup === 'ALL'
                        ? 'var(--color-primary)'
                        : 'var(--bg-surface)',
                      color: journalDropdownGroup === 'ALL'
                        ? 'var(--color-on-primary)'
                        : 'var(--text-on-surface)',
                      borderColor: journalDropdownGroup === 'ALL'
                        ? 'var(--color-primary)'
                        : 'var(--border-primary)',
                      boxShadow: journalDropdownGroup === 'ALL' ? '0 0 12px var(--glow-color)' : 'none'
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[15px]">apps</span>
                      <span className="font-bold tracking-wider">ALL PROFILES</span>
                    </div>
                    <span
                      className="text-[9px] px-1.5 py-0.5 border font-bold"
                      style={{
                        borderColor: journalDropdownGroup === 'ALL' ? 'var(--color-on-primary)' : 'var(--border-primary)',
                        backgroundColor: journalDropdownGroup === 'ALL' ? 'color-mix(in srgb, var(--color-on-primary) 20%, transparent)' : 'var(--bg-container-high)'
                      }}
                    >
                      {activeJournalTypes.length}
                    </span>
                  </button>

                  {/* 4 Category Groups */}
                  {CATEGORY_GROUPS.map((g) => {
                    const isSelected = journalDropdownGroup === g.id;
                    const groupCount = activeJournalTypes.filter((c) => c.group === g.id).length;

                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setJournalDropdownGroup(g.id)}
                        onMouseEnter={() => setJournalDropdownGroup(g.id)}
                        className="w-full text-left px-2.5 py-2 border font-mono transition-all cursor-pointer flex items-center justify-between text-xs"
                        style={{
                          backgroundColor: isSelected
                            ? 'var(--color-primary)'
                            : 'var(--bg-surface)',
                          color: isSelected
                            ? 'var(--color-on-primary)'
                            : 'var(--text-on-surface)',
                          borderColor: isSelected
                            ? 'var(--color-primary)'
                            : 'var(--border-primary)',
                          boxShadow: isSelected ? '0 0 12px var(--glow-color)' : 'none'
                        }}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="material-symbols-outlined text-[15px]">
                            {g.icon}
                          </span>
                          <span className="font-bold tracking-wider truncate">
                            {g.label.replace('_', ' ')}
                          </span>
                        </div>
                        <span
                          className="text-[9px] px-1.5 py-0.5 border font-bold shrink-0 ml-1.5"
                          style={{
                            borderColor: isSelected ? 'var(--color-on-primary)' : 'var(--border-primary)',
                            backgroundColor: isSelected ? 'color-mix(in srgb, var(--color-on-primary) 20%, transparent)' : 'var(--bg-container-high)'
                          }}
                        >
                          {groupCount}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* RIGHT PANE: Selected Category's Schemas (8 cols) */}
                <div className="md:col-span-8 flex flex-col pl-0 md:pl-1">
                  <div
                    className="text-[9.5px] font-black uppercase tracking-wider pb-1 mb-1.5 border-b flex justify-between items-center"
                    style={{
                      borderColor: 'var(--border-primary)',
                      color: 'var(--text-on-surface-variant)'
                    }}
                  >
                    <span>
                      &gt; SCHEMAS: {journalDropdownGroup === 'ALL' ? 'ALL LOADED' : journalDropdownGroup} (
                      {activeJournalTypes.filter((cat) => journalDropdownGroup === 'ALL' || cat.group === journalDropdownGroup).length} ITEMS)
                    </span>
                    <span className="text-[9px] opacity-75">CLICK ITEM TO LOAD SCHEMA</span>
                  </div>

                  {/* Schema List */}
                  <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                    {activeJournalTypes
                      .filter((cat) => journalDropdownGroup === 'ALL' || cat.group === journalDropdownGroup)
                      .map((item) => {
                        const globalIdx = activeJournalTypes.findIndex((t) => t.id === item.id);
                        const isPointed = focusedJournalIndex === globalIdx;
                        const isCommitted = activeCategory === item.id;

                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setActiveCategory(item.id);
                              setFocusedJournalIndex(globalIdx >= 0 ? globalIdx : 0);
                              setIsJournalMenuOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 border font-mono transition-all cursor-pointer flex items-center justify-between text-xs"
                            style={{
                              backgroundColor: isPointed
                                ? 'color-mix(in srgb, var(--color-primary) 28%, var(--bg-surface) 72%)'
                                : isCommitted
                                ? 'color-mix(in srgb, var(--color-primary) 18%, var(--bg-surface) 82%)'
                                : 'var(--bg-surface)',
                              borderColor: isPointed
                                ? 'var(--color-primary)'
                                : isCommitted
                                ? 'var(--color-primary)'
                                : 'var(--border-primary)',
                              color: (isPointed || isCommitted)
                                ? 'var(--color-primary)'
                                : 'var(--text-on-surface)',
                              boxShadow: isPointed ? '0 0 12px var(--glow-color)' : 'none'
                            }}
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              <span
                                className={`text-[11px] font-black ${isPointed ? 'animate-pulse' : 'opacity-0'}`}
                                style={{ color: 'var(--color-primary)' }}
                              >
                                ►
                              </span>
                              <span
                                className="material-symbols-outlined text-[16px]"
                                style={{ color: (isPointed || isCommitted) ? 'var(--color-primary)' : 'var(--text-on-surface-variant)' }}
                              >
                                {item.icon}
                              </span>
                              <div className="flex flex-col">
                                <span className="font-bold tracking-wider truncate">
                                  {item.label}
                                </span>
                                <span className="text-[9px] opacity-70 font-mono">
                                  {item.codename}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0 ml-2">
                              <span
                                className="text-[8.5px] px-1.5 py-0.5 border font-mono font-bold"
                                style={{
                                  borderColor: 'var(--border-primary)',
                                  color: 'var(--color-primary)',
                                  backgroundColor: 'var(--bg-container-low)'
                                }}
                              >
                                {item.badge}
                              </span>
                              {isCommitted && (
                                <span
                                  className="text-[8.5px] px-1.5 py-0.5 font-bold border"
                                  style={{
                                    backgroundColor: 'var(--color-primary)',
                                    color: 'var(--color-on-primary)',
                                    borderColor: 'var(--color-primary)'
                                  }}
                                >
                                  ACTIVE
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                  </div>
                </div>
              </div>

              {/* Dropdown Footer Navigation Hint */}
              <div
                className="mt-2.5 pt-2 border-t flex justify-between items-center text-[9px] px-1"
                style={{
                  borderColor: 'var(--border-primary)',
                  color: 'var(--text-on-surface-variant)'
                }}
              >
                <span>&gt; USE [◄] [►] OR [▲] [▼] TO NAVIGATE; PRESS [ENTER] TO COMMIT</span>
                <span className="font-mono opacity-80">[ ESC TO DISMISS ]</span>
              </div>
            </div>
          )}
        </div>
        {/* NEURAL_JACK Cyberpunk Dropdown Control */}
        <div className="relative" ref={neuralJackRef}>
          <button
            type="button"
            onClick={() => setIsNeuralJackOpen(!isNeuralJackOpen)}
            className="font-label-sm border-2 px-3.5 py-1 min-w-[175px] flex items-center justify-between gap-2 transition-all cursor-pointer font-mono font-bold tracking-wider"
            style={{
              backgroundColor: isNeuralJackOpen
                ? 'var(--color-primary)'
                : 'color-mix(in srgb, var(--color-primary) 14%, var(--bg-panel) 86%)',
              color: isNeuralJackOpen
                ? 'var(--color-on-primary)'
                : 'var(--color-primary)',
              borderColor: 'var(--color-primary)',
              boxShadow: isNeuralJackOpen
                ? '0 0 20px var(--glow-color)'
                : '0 0 12px var(--glow-color)'
            }}
            title="NEURAL_JACK // SYSTEM MATRIX & OPERATOR CONSOLE"
          >
            <div className="flex items-center gap-2">
              <span
                className="material-symbols-outlined text-[16px] animate-pulse"
                style={{ color: isNeuralJackOpen ? 'var(--color-on-primary)' : 'var(--color-primary)' }}
              >
                memory
              </span>
              <span className="font-mono font-black tracking-widest">[ NEURAL_JACK ]</span>
            </div>
            <span
              className="material-symbols-outlined text-[16px]"
              style={{ color: isNeuralJackOpen ? 'var(--color-on-primary)' : 'var(--color-primary)' }}
            >
              {isNeuralJackOpen ? 'arrow_drop_up' : 'arrow_drop_down'}
            </span>
          </button>

          {/* NEURAL_JACK Retro Dropdown Menu (Expanded Width to Prevent Text Wrapping) */}
          {isNeuralJackOpen && (
            <div
              className="absolute right-0 mt-2 w-72 md:w-80 border-2 z-50 p-2.5 font-mono text-xs animate-fade-in shadow-2xl"
              style={{
                backgroundColor: 'var(--bg-panel)',
                borderColor: 'var(--color-primary)',
                boxShadow: '0 0 30px var(--glow-color), inset 0 0 15px rgba(0,0,0,0.5)',
                color: 'var(--text-on-surface)'
              }}
            >
              {/* Terminal Sub-header */}
              <div
                className="border-b pb-1.5 mb-2 px-1 flex justify-between items-center text-[10px] tracking-widest"
                style={{
                  borderColor: 'var(--border-primary)',
                  color: 'var(--color-primary)'
                }}
              >
                <span>SYS // INTERFACE</span>
                <span className="font-bold">
                  {currentUser?.id.startsWith('offline_') ? 'MODE: OFFLINE' : 'MODE: CLOUD'}
                </span>
              </div>

              {/* Option 1: Log Types Matrix Configuration */}
              <button
                type="button"
                onClick={() => {
                  setIsNeuralJackOpen(false);
                  setIsLogTypeManagerOpen(true);
                }}
                className="w-full text-left px-3 py-2 border font-mono font-bold tracking-widest uppercase transition-all cursor-pointer mb-2 flex justify-between items-center whitespace-nowrap shadow-sm"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--color-primary) 18%, var(--bg-surface) 82%)',
                  borderColor: 'var(--color-primary)',
                  color: 'var(--color-primary)'
                }}
              >
                <span>[ LOG_TYPES_MATRIX ]</span>
                <span className="font-mono font-black text-xs tracking-widest ml-2">
                  [{enabledCategories.length}/{ALL_LOG_CATEGORIES.length}]
                </span>
              </button>

              {/* Option 2: Themes Modal */}
              <button
                type="button"
                onClick={() => {
                  setIsNeuralJackOpen(false);
                  setIsThemeModalOpen(true);
                }}
                className="w-full text-left px-3 py-2 border font-mono font-bold tracking-widest uppercase transition-all cursor-pointer mb-2 flex justify-between items-center whitespace-nowrap"
                style={{
                  backgroundColor: isThemeModalOpen
                    ? 'var(--color-primary)'
                    : 'var(--bg-surface)',
                  borderColor: isThemeModalOpen ? 'var(--color-primary)' : 'var(--border-primary)',
                  color: isThemeModalOpen ? 'var(--color-on-primary)' : 'var(--color-primary)',
                  boxShadow: isThemeModalOpen ? '0 0 12px var(--glow-color)' : 'none'
                }}
              >
                <span>[ THEMES ]</span>
                <span className="font-mono font-black text-xs tracking-widest ml-2">
                  {isThemeModalOpen ? '[X]' : '[ ]'}
                </span>
              </button>

              {/* Option 3: CRT Flicker Toggle */}
              <button
                type="button"
                onClick={() => setFlickerEnabled(!flickerEnabled)}
                className="w-full text-left px-3 py-2 border font-mono font-bold tracking-widest uppercase transition-all cursor-pointer mb-2 flex justify-between items-center whitespace-nowrap"
                style={{
                  backgroundColor: flickerEnabled
                    ? 'color-mix(in srgb, var(--color-primary) 22%, var(--bg-surface) 78%)'
                    : 'var(--bg-surface)',
                  borderColor: flickerEnabled ? 'var(--color-primary)' : 'var(--border-primary)',
                  color: flickerEnabled ? 'var(--color-primary)' : 'var(--text-on-surface-variant)',
                  boxShadow: flickerEnabled ? '0 0 12px var(--glow-color)' : 'none'
                }}
              >
                <span>[ CRT_FLICKER ]</span>
                <span className="font-mono font-black text-xs tracking-widest ml-2">
                  {flickerEnabled ? '[X]' : '[ ]'}
                </span>
              </button>

              {/* Option 4: Speech Synthesizer Toggle */}
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
                className="w-full text-left px-3 py-2 border font-mono font-bold tracking-widest uppercase transition-all cursor-pointer mb-2 flex justify-between items-center whitespace-nowrap"
                style={{
                  backgroundColor: isTtyVoiceEnabled
                    ? 'color-mix(in srgb, var(--color-primary) 22%, var(--bg-surface) 78%)'
                    : 'var(--bg-surface)',
                  borderColor: isTtyVoiceEnabled ? 'var(--color-primary)' : 'var(--border-primary)',
                  color: isTtyVoiceEnabled ? 'var(--color-primary)' : 'var(--text-on-surface-variant)',
                  boxShadow: isTtyVoiceEnabled ? '0 0 12px var(--glow-color)' : 'none'
                }}
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
              <div className="terminal-header font-label-sm text-label-sm text-neon-cyan flex justify-between items-center">
                <span>[SYS_CMD_IN] // ROOT</span>
                <span className="font-mono font-bold tracking-wider text-neon-cyan">
                  SCHEMA: {getCategoryMeta(activeCategory).badge}
                </span>
              </div>
              <div className="flex-1 p-panel-padding flex flex-col overflow-y-auto">
                <div className="mb-4">
                  <label className="block text-neon-cyan font-label-sm mb-1">LOG_TITLE</label>
                  <div className="flex items-center border-b border-neon-cyan/30 pb-1">
                    <span className="text-neon-cyan mr-2 font-bold">&gt;</span>
                    <input
                      autoFocus
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="bg-transparent border-none outline-none focus:ring-0 text-neon-cyan flex-1 font-body-md p-0"
                      placeholder={`ENTER TITLE... (e.g. ${getCategoryMeta(activeCategory).defaultTitle})`}
                      type="text"
                    />
                    <span className="blinking-cursor"></span>
                  </div>
                </div>

                <LogForms category={activeCategory} onSubmit={handleFormSubmit} />
              </div>
            </div>

            {/* Center Column: Recent Logs + Universal News Feed (Spans 1 col, 2 rows) */}
            <div className="lg:col-span-1 md:row-span-2 flex flex-col gap-4 min-h-0 h-full">
              {/* Recent Logs Panel (65% default, 35% when news expanded, 100% when minimized) */}
              <div
                className={`terminal-panel amber-panel flex flex-col transition-all duration-300 min-h-0 ${
                  isNewsMinimized
                    ? 'flex-1 h-full'
                    : isNewsHeightExpanded
                    ? 'h-[35%] flex-[35]'
                    : 'h-[65%] flex-[65]'
                }`}
              >
                <div className="terminal-header font-label-sm text-label-sm text-amber-warn/70">
                  <span>REC_LOGS</span>
                  <span>DB_SYNC: OK</span>
                </div>
                <div className="flex border-b border-amber-warn/30 text-[9px] font-label-sm text-amber-warn/50 overflow-x-auto">
                  <button
                    onClick={() => setFilterCategory('ALL')}
                    className={`flex-1 min-w-[36px] py-1 hover:bg-amber-warn/10 transition-colors ${filterCategory === 'ALL' ? 'bg-amber-warn/20 text-amber-warn font-bold' : ''}`}
                  >ALL</button>
                  <button
                    onClick={() => setFilterCategory('CYBER_OPS')}
                    className={`flex-1 min-w-[48px] py-1 hover:bg-amber-warn/10 transition-colors border-l border-amber-warn/30 ${filterCategory === 'CYBER_OPS' ? 'bg-amber-warn/20 text-amber-warn font-bold' : ''}`}
                  >CYBER</button>
                  <button
                    onClick={() => setFilterCategory('VITALS')}
                    className={`flex-1 min-w-[48px] py-1 hover:bg-amber-warn/10 transition-colors border-l border-amber-warn/30 ${filterCategory === 'VITALS' ? 'bg-amber-warn/20 text-amber-warn font-bold' : ''}`}
                  >VITALS</button>
                  <button
                    onClick={() => setFilterCategory('PRODUCTIVITY')}
                    className={`flex-1 min-w-[44px] py-1 hover:bg-amber-warn/10 transition-colors border-l border-amber-warn/30 ${filterCategory === 'PRODUCTIVITY' ? 'bg-amber-warn/20 text-amber-warn font-bold' : ''}`}
                  >PROD</button>
                  <button
                    onClick={() => setFilterCategory('SKY_LIFE')}
                    className={`flex-1 min-w-[44px] py-1 hover:bg-amber-warn/10 transition-colors border-l border-amber-warn/30 ${filterCategory === 'SKY_LIFE' ? 'bg-amber-warn/20 text-amber-warn font-bold' : ''}`}
                  >SKY</button>
                </div>
                <div className="flex-1 p-0 overflow-y-auto">
                  <div className="divide-y divide-surface-container-high/50">
                    {logs
                      .filter((log) => {
                        if (filterCategory === 'ALL') return true;
                        if (['CYBER_OPS', 'VITALS', 'PRODUCTIVITY', 'SKY_LIFE'].includes(filterCategory)) {
                          const meta = getCategoryMeta(log.category);
                          return meta?.group === filterCategory;
                        }
                        return log.category === filterCategory;
                      })
                      .map((log) => {
                        const meta = getCategoryMeta(log.category);
                        return (
                          <div key={log.id} onClick={() => setExpandedLogId(expandedLogId === log.id ? null : log.id)} className="px-3 py-2 hover:bg-surface-variant/20 cursor-pointer group flex flex-col">
                            <div className="flex justify-between items-start mb-0.5">
                              <div className="flex items-center gap-1.5 truncate">
                                <span className="material-symbols-outlined text-[13px] text-amber-warn">{meta?.icon || 'article'}</span>
                                <div className="font-label-sm text-[10px] text-amber-warn font-black tracking-wider group-hover:amber-text transition-all truncate">
                                  {meta?.badge || `[${log.category}]`}
                                </div>
                              </div>
                              <span className="text-[8.5px] px-1 py-0.2 border border-amber-warn/30 font-mono text-amber-warn/70 shrink-0">
                                {meta?.group || 'LOG'}
                              </span>
                            </div>
                            <div className="text-sm truncate text-on-surface-variant font-bold">{log.title}</div>

                            {expandedLogId === log.id && (
                              <div className="mt-2 text-xs border-t border-amber-warn/30 pt-2 space-y-2">
                                {Object.entries(log.payload || {}).map(([key, value]) => (
                                  <div key={key} className="flex flex-col">
                                    <span className="text-amber-warn/70 uppercase text-[10px]">{key}</span>
                                    <span className="text-on-surface-variant break-words">
                                      {Array.isArray(value)
                                        ? value.map((v) => (typeof v === 'object' ? JSON.stringify(v) : String(v))).join(', ')
                                        : typeof value === 'object' && value !== null
                                        ? JSON.stringify(value)
                                        : String(value)}
                                    </span>
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
                        );
                      })}
                    {logs.filter((log) => {
                      if (filterCategory === 'ALL') return true;
                      if (['CYBER_OPS', 'VITALS', 'PRODUCTIVITY', 'SKY_LIFE'].includes(filterCategory)) {
                        const meta = getCategoryMeta(log.category);
                        return meta?.group === filterCategory;
                      }
                      return log.category === filterCategory;
                    }).length === 0 && (
                      <div className="px-3 py-4 text-center text-amber-warn/50 font-label-sm">NO RECORDS FOUND</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Universal News Wire (35% default, 65% when height expanded, header bar when minimized) */}
              <div
                className={`flex flex-col transition-all duration-300 min-h-0 ${
                  isNewsMinimized
                    ? 'shrink-0'
                    : isNewsHeightExpanded
                    ? 'h-[65%] flex-[65]'
                    : 'h-[35%] flex-[35]'
                }`}
              >
                <UniversalNewsPane
                  articles={newsArticles}
                  isMinimized={isNewsMinimized}
                  onToggleMinimize={() => setIsNewsMinimized(!isNewsMinimized)}
                  isHeightExpanded={isNewsHeightExpanded}
                  onToggleHeightExpand={() => {
                    if (isNewsMinimized) {
                      setIsNewsMinimized(false);
                      setIsNewsHeightExpanded(true);
                    } else {
                      setIsNewsHeightExpanded(!isNewsHeightExpanded);
                    }
                  }}
                  isOffline={isOffline}
                  isLoading={isNewsLoading}
                />
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
                  <div className="text-on-surface-variant font-label-sm text-[10px] mb-2 border-b border-surface-container-high pb-1">DOMAIN_BREAKDOWN</div>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-label-sm">
                    {CATEGORY_GROUPS.map((g) => {
                      const count = logs.filter((l) => getCategoryMeta(l.category).group === g.id).length;
                      return (
                        <div key={g.id} className="flex justify-between text-outline">
                          <span className="truncate">{g.label}</span>
                          <span className="text-neon-cyan font-bold font-mono">{count}</span>
                        </div>
                      );
                    })}
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

      {/* Retro Cyberpunk Log Types Matrix Configuration Modal */}
      <LogTypeManagerModal
        isOpen={isLogTypeManagerOpen}
        enabledCategories={enabledCategories}
        onSaveCategories={handleSaveCategories}
        onClose={() => setIsLogTypeManagerOpen(false)}
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
