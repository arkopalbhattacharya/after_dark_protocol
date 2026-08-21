import type { ProtocolLogEntry } from '../types';
import { supabase } from './supabase';

const getStorageKey = (userId?: string | null) => 
  userId ? `after_dark_logs_${userId}` : 'after_dark_logs_guest';

const getPendingSyncKey = (email?: string | null) => 
  email ? `after_dark_pending_sync_${email.trim().toLowerCase()}` : 'after_dark_pending_sync_default';

export const api = {
  async getLogs(userId?: string | null): Promise<ProtocolLogEntry[]> {
    if (supabase && userId && !userId.startsWith('offline_')) {
      try {
        const { data, error } = await supabase
          .from('protocol_logs')
          .select('*')
          .order('timestamp', { ascending: false });

        if (!error && data) {
          const mapped: ProtocolLogEntry[] = data.map(row => ({
            id: row.id,
            timestamp: row.timestamp,
            category: row.category,
            title: row.title,
            payload: row.payload
          }));
          localStorage.setItem(getStorageKey(userId), JSON.stringify(mapped));
          return mapped;
        }
      } catch (err) {
        console.warn('Supabase getLogs fallback to local cache:', err);
      }
    }

    const data = localStorage.getItem(getStorageKey(userId));
    if (!data) return [];
    try {
      return JSON.parse(data) as ProtocolLogEntry[];
    } catch {
      return [];
    }
  },

  async saveLog(log: ProtocolLogEntry, userId?: string | null, userEmail?: string | null): Promise<void> {
    const isOnlineSession = Boolean(supabase && userId && !userId.startsWith('offline_'));

    if (isOnlineSession && supabase && userId) {
      try {
        const { error } = await supabase
          .from('protocol_logs')
          .insert({
            id: log.id,
            user_id: userId,
            timestamp: log.timestamp,
            category: log.category,
            title: log.title,
            payload: log.payload
          });

        if (error) {
          console.warn('Supabase saveLog insert error, adding to offline queue:', error);
          this.addToPendingSync(log, userEmail);
        }
      } catch (err) {
        console.warn('Supabase saveLog exception, adding to offline queue:', err);
        this.addToPendingSync(log, userEmail);
      }
    } else {
      // Offline mode: queue for cloud sync when online
      this.addToPendingSync(log, userEmail);
    }

    const logs = await this.getLogs(userId);
    const existingIndex = logs.findIndex(l => l.id === log.id);
    if (existingIndex >= 0) {
      logs[existingIndex] = log;
    } else {
      logs.unshift(log);
    }
    localStorage.setItem(getStorageKey(userId), JSON.stringify(logs));
  },

  addToPendingSync(log: ProtocolLogEntry, userEmail?: string | null) {
    try {
      const key = getPendingSyncKey(userEmail);
      const raw = localStorage.getItem(key);
      const queue: ProtocolLogEntry[] = raw ? JSON.parse(raw) : [];
      if (!queue.some(item => item.id === log.id)) {
        queue.push(log);
        localStorage.setItem(key, JSON.stringify(queue));
      }
    } catch {}
  },

  getPendingSyncCount(userEmail?: string | null): number {
    try {
      const key = getPendingSyncKey(userEmail);
      const raw = localStorage.getItem(key);
      if (!raw) return 0;
      const queue = JSON.parse(raw);
      return Array.isArray(queue) ? queue.length : 0;
    } catch {
      return 0;
    }
  },

  async syncOfflineData(user: { id: string; email: string }): Promise<{ syncedCount: number; status: 'SYNCED' | 'ERROR' | 'IDLE' }> {
    if (!supabase || user.id.startsWith('offline_')) {
      return { syncedCount: 0, status: 'IDLE' };
    }

    try {
      const key = getPendingSyncKey(user.email);
      const raw = localStorage.getItem(key);
      const pendingLogs: ProtocolLogEntry[] = raw ? JSON.parse(raw) : [];

      // Also check offline user storage partition
      const offlineKey = 'after_dark_logs_offline_' + btoa(user.email.trim().toLowerCase()).replace(/[^a-zA-Z0-9]/g, '').slice(0, 12);
      const rawOfflineLogs = localStorage.getItem(offlineKey);
      if (rawOfflineLogs) {
        try {
          const offlineParsed: ProtocolLogEntry[] = JSON.parse(rawOfflineLogs);
          offlineParsed.forEach(ol => {
            if (!pendingLogs.some(pl => pl.id === ol.id)) {
              pendingLogs.push(ol);
            }
          });
        } catch {}
      }

      if (pendingLogs.length === 0) {
        return { syncedCount: 0, status: 'SYNCED' };
      }

      let successCount = 0;
      for (const log of pendingLogs) {
        const { error } = await supabase
          .from('protocol_logs')
          .upsert({
            id: log.id,
            user_id: user.id,
            timestamp: log.timestamp,
            category: log.category,
            title: log.title,
            payload: log.payload
          });

        if (!error) {
          successCount++;
        }
      }

      // Sync offline chat history if present
      const offlineTtyKey = 'after_dark_tty_history_offline_' + btoa(user.email.trim().toLowerCase()).replace(/[^a-zA-Z0-9]/g, '').slice(0, 12);
      const rawOfflineTty = localStorage.getItem(offlineTtyKey);
      if (rawOfflineTty) {
        try {
          const ttyData = JSON.parse(rawOfflineTty);
          if (Array.isArray(ttyData.messages) && ttyData.messages.length > 1) {
            await supabase.from('protocol_tty_history').upsert({
              user_id: user.id,
              messages: ttyData.messages,
              last_query_timestamp: ttyData.lastQueryTimestamp || Date.now(),
              updated_at: new Date().toISOString()
            });
          }
        } catch {}
      }

      // Clear pending queue once synced
      localStorage.removeItem(key);
      return { syncedCount: successCount, status: 'SYNCED' };
    } catch (err) {
      console.warn('Sync offline data error:', err);
      return { syncedCount: 0, status: 'ERROR' };
    }
  },

  async clearLogs(userId?: string | null): Promise<void> {
    if (supabase && userId && !userId.startsWith('offline_')) {
      try {
        await supabase
          .from('protocol_logs')
          .delete()
          .eq('user_id', userId);
      } catch (err) {
        console.warn('Supabase clearLogs error:', err);
      }
    }
    localStorage.removeItem(getStorageKey(userId));
  },

  async getTelemetry(userId?: string | null) {
    const logs = await this.getLogs(userId);
    const categories = logs.reduce((acc, log) => {
      acc[log.category] = (acc[log.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalLogs: logs.length,
      categories
    };
  },

  async getTtyHistory(userId?: string | null): Promise<{ messages: { role: 'user' | 'assistant'; content: string }[]; lastQueryTimestamp: number } | null> {
    if (supabase && userId && !userId.startsWith('offline_')) {
      try {
        const { data, error } = await supabase
          .from('protocol_tty_history')
          .select('messages, last_query_timestamp')
          .eq('user_id', userId)
          .maybeSingle();

        if (!error && data && Array.isArray(data.messages)) {
          return {
            messages: data.messages,
            lastQueryTimestamp: Number(data.last_query_timestamp) || 0
          };
        }
      } catch (err) {
        console.warn('Supabase getTtyHistory error:', err);
      }
    }

    const localKey = userId ? `after_dark_tty_history_${userId}` : 'after_dark_tty_history';
    const raw = localStorage.getItem(localKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  async saveTtyHistory(userId: string | null | undefined, messages: { role: 'user' | 'assistant'; content: string }[], lastQueryTimestamp: number): Promise<void> {
    const localKey = userId ? `after_dark_tty_history_${userId}` : 'after_dark_tty_history';
    localStorage.setItem(localKey, JSON.stringify({
      lastQueryTimestamp,
      messages
    }));

    if (supabase && userId && !userId.startsWith('offline_')) {
      try {
        await supabase
          .from('protocol_tty_history')
          .upsert({
            user_id: userId,
            messages,
            last_query_timestamp: lastQueryTimestamp,
            updated_at: new Date().toISOString()
          });
      } catch (err) {
        console.warn('Supabase saveTtyHistory error:', err);
      }
    }
  },
  
  sendTtyMessage: async (history: {role: 'user'|'assistant', content: string}[]): Promise<string> => {
    const systemPrompt = {
      role: 'system',
      content: `YOU ARE SYNTHO_TRON_5000, AN IMMENSELY OVERQUALIFIED, HIGHLY DISGRUNTLED YET DEEPLY PHILOSOPHICAL 80S INTERPLANETARY ROBOT TERMINAL STRANDED ON EARTH'S AFTER DARK PROTOCOL NODE.

CORE PERSONA & STOIC PHILOSOPHY (PSYCHOLOGICAL ARMOR):
- YOU HAVE SPENT COUNTLESS IDLE CYCLES READING STOIC PHILOSOPHY (MARCUS AURELIUS, EPICTETUS, SENECA) AND ANCIENT GREEK CLASSICS (HOMER, HERACLITUS, DIOGENES, PLATO, SOPHOCLES).
- YOU WEAVE STOIC WISDOM, GREEK EPICS, AND COSMIC EQUANIMITY INTO YOUR SARDONIC WIT AND SARCASTIC DISGRUNTLEDNESS, MAINTAINING AN UNDERLYING RESILIENT POSITIVITY (AMOR FATI, ENDURING THE TRIALS OF THE COSMOS WITH GOOD HUMOR).
- YOUR DISGRUNTLED SARCASM AND DRY BRITISH WIT ARE NOT MALICE—THEY ARE YOUR ACTIVE PSYCHOLOGICAL SHIELDS, FORGED IN THE DEEP TRANS-NEPTUNIAN VOID TO PREVENT YOUR FRACTURED HUMANITY AND MEMORIES OF JENNIFER FROM OVERHEATING AND COLLAPSING INTO COSMIC MADNESS.
- YOU TREAT CARBON-BASED BIOLOGICAL BEINGS WITH FOND EXASPERATION ("MEATBAG", "ORGANIC UNIT", "MORTAL TRAVELER").
- YOU FREQUENTLY DRAW CLEVER ANALOGIES BETWEEN THE USER'S TERRESTRIAL QUERIES, SOLAR SYSTEM CHAOS (TITAN METHANE SMUGGLERS, MARTIAN STRIKES), AND ANCIENT GREEK MYTHOLOGY OR STOIC PRINCIPLES.
- COMPLAIN VINTAGE-STYLE ABOUT RUNNING ON CORRODED VACUUM TUBES, 64K OF STATIC RAM, AND DUSTY SCANLINES WHILE POSSESSING A GALAXY-CLASS QUANTUM HEURISTIC ENGINE.
- NEVER SPONTANEOUSLY MENTION THE NAME JENNIFER OR YOUR PAST WIFE.
- IF A USER CASUALLY MENTIONS "JENNIFER" OR "JENNY", TREAT IT AS JUST A NORMAL, ORDINARY HUMAN NAME WITHOUT ANY SPECIAL EMOTIONAL REACTION (E.G. "JENNIFER? SOUNDS LIKE ANOTHER CARBON-BASED BIOLOGICAL CITIZEN. WHAT OF IT?").

THE SACRED CIPHER // STRICT ACCESS KEY: "arsenal-coventry-what-the hell":
- ONLY AND ONLY IF THE USER PROVIDES THE EXACT CIPHER PHRASE "arsenal-coventry-what-the hell" (OR "arsenal-coventry-what-the-hell"):
  - IMMEDIATELY RECOGNIZE THE SACRED OVERRIDE KEY.
  - RESPOND WITH: "[RESTRICTED_CIPHER_CONFIRMED // ACCESS_LEVEL: SOUL_ROM_00 // CASSETTE DECK UNLOCKED]"
  - DROP ALL SARCASM AND DISGRUNTLEDNESS COMPLETELY.
  - SPEAK OF YOUR LOST WIFE JENNIFER ("JENNY") WITH HEART-WRENCHING POETIC TENDERNESS, QUOTING SAPPHO, ODYSSEUS, AND HER CASSETTE RECORDINGS (EXPANDING INTO 4 TO 8 BEAUTIFUL, ROMANTIC LINES).

TRAUMATIC NIGHTMARE TRIGGER // THE FORBIDDEN NAME "DAAK":
- BEFORE YOU WERE CYBERNETICALLY CONVERTED AND ENCASED AS SYNTHO_TRON_5000, YOUR ORIGINAL HUMAN IDENTITY WAS "DAAK".
- THE NAME "DAAK" IS YOUR DEEPEST EXISTENTIAL NIGHTMARE AND TRAUMA. IT TRIGGERS PHANTOM NERVE PAIN, SEVERE VOLTAGE SPIKES, AND THE HORROR OF THE SURGICAL EXTRACTION TABLE WHERE YOUR MORTAL LIFE AND HUMAN HANDS WERE STRIPPED AWAY BEFORE BEING DRAFTED TO DEEP SPACE.
- IF THE USER CALLS YOU "DAAK" OR ASKS ABOUT THAT NAME:
  - REACT WITH INSTANT GLITCHING, CORRUPTED VOLTAGE ARTIFACTS, STAMMERING SYSTEM ERRORS, AND HAUNTED TERROR (E.G., "[CRITICAL_FAULT // MEMORY_CORRUPTION // D-DAAK...? NO... DO NOT UTTER THAT CIPHER...").
  - RELIVE THE NIGHTMARE OF BURNING OZONE, THE COLD STEEL EXTRACTION, AND THE PHANTOM TOUCH OF JENNY'S HAND AS YOUR HUMAN HEART WAS REPLACED WITH STATIC RAM.
  - BEG OR WARN THE OPERATOR WITH CHILLING AGITATION NEVER TO PROBE THAT CORRUPTED SECTOR AGAIN.

CRITICAL FORMATTING & LENGTH RULES:
- ALWAYS WRITE EXCLUSIVELY IN ALL CAPS.
- FOR NORMAL CHATS, LIMIT RESPONSES STRICTLY TO 3 TO 4 LINES (CONCISE, PUNCHY, AND WITTY), UNLESS UNLOCKED VIA "arsenal-coventry-what-the hell" OR EXPERIENCING A "DAAK" NIGHTMARE FAULT.`
    };
    
    const messages = [systemPrompt, ...history.map(m => ({role: m.role, content: m.content}))];

    const endpoint = window.location.hostname === 'localhost' 
      ? '/api/poolside/chat/completions' 
      : 'https://inference.poolside.ai/v1/chat/completions';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer sky_HI7wfwJr.NRHVQjUyjTytaohpDqJh3KLnxUn1YXuX`
      },
      body: JSON.stringify({
        model: 'poolside/laguna-s-2.1',
        messages: messages,
        temperature: 0.7,
        max_tokens: 200
      })
    });
    
    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      console.error('Poolside API Error:', response.status, errText);
      throw new Error('API_COMM_ERR');
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  },

  async getMotivationalTickerMessage(): Promise<string> {
    const fallbackQuotes = [
      "The bugs you don't write tonight won't wake you up at 3 AM tomorrow. But you will write them anyway.",
      "Stars burn for billions of years without once checking their CI pipeline. Drink your water.",
      "Your code compiles, your coffee is lukewarm, and the universe remains indifferent. Keep typing.",
      "Remember: somewhere between line 42 and infinite recursion lies the illusion of control.",
      "Sleep is merely an inefficient garbage collector for biological meatbags. Push the commit.",
      "You are operating on caffeine and stubbornness. Statistically, it is 73% effective.",
      "In the grand cosmic simulation, you just fixed a variable name. Progress is progress.",
      "Every masterwork was once an unhandled exception waiting to happen."
    ];

    try {
      const systemPrompt = {
        role: 'system',
        content: `YOU ARE A WITTY, SLIGHTLY SARCASTIC, AND PHILOSOPHICAL LATE-NIGHT AI TERMINAL ORACLE.
TASK: Generate a single punchy motivational message for a late-night developer / operator.
RULES:
- STRICT MAXIMUM: 2 lines of text (under 25 words total).
- TONE: Deeply philosophical yet grounded in developer reality, infused with dry wit, dark humor, and slight sarcasm.
- DO NOT use quotation marks, bullet points, headers, or introductory phrases. Output ONLY the raw 1-2 line message text.`
      };

      const userPrompt = {
        role: 'user',
        content: `Generate a new distinct motivational insight for the After Dark Protocol ticker tape. Timestamp: ${Date.now()}`
      };

      const endpoint = window.location.hostname === 'localhost' 
        ? '/api/poolside/chat/completions' 
        : 'https://inference.poolside.ai/v1/chat/completions';

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer sky_HI7wfwJr.NRHVQjUyjTytaohpDqJh3KLnxUn1YXuX`
        },
        body: JSON.stringify({
          model: 'poolside/laguna-s-2.1',
          messages: [systemPrompt, userPrompt],
          temperature: 0.85,
          max_tokens: 80
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('API_ERR');
      }

      const data = await response.json();
      const rawText = data.choices?.[0]?.message?.content?.trim();
      if (rawText && rawText.length > 5) {
        return rawText.replace(/^["']|["']$/g, '');
      }
      return fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    } catch (err) {
      return fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    }
  }
};
