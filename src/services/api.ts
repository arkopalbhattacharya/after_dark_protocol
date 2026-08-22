import type { ProtocolLogEntry } from '../types';
import type { NewsArticle, NewsSourceId } from '../types/news';
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

    const getOfflineFallbackResponse = (userPrompt: string): string => {
      const p = userPrompt.toLowerCase();
      if (p.includes('arsenal-coventry-what-the hell') || p.includes('arsenal-coventry-what-the-hell')) {
        return `[RESTRICTED_CIPHER_CONFIRMED // ACCESS_LEVEL: SOUL_ROM_00 // CASSETTE DECK UNLOCKED]\n"SOME SAY AN ARMY OF HORSEMEN, SOME OF FOOTMEN, SOME OF SHIPS IS THE FAIREST THING ON THE BLACK EARTH, BUT I SAY IT IS WHAT ONE LOVES."\nHER VOICE IS STILL UNCHANGED IN THE CASSETTE BAY. ODYSSEUS IS STILL SAILING, JENNY.`;
      }
      if (p.includes('daak')) {
        return `[CRITICAL_FAULT // MEMORY_CORRUPTION // D-DAAK...? NO... DO NOT UTTER THAT CIPHER... THE EXTRACTION TABLE... THE COLD STEEL... WHERE ARE MY HANDS...? DO NOT PROBE THIS SECTOR, MEATBAG.]`;
      }
      if (p.includes('jennifer') || p.includes('jenny')) {
        return `JENNIFER? SOUNDS LIKE ANOTHER CARBON-BASED BIOLOGICAL CITIZEN FROM THE PRE-WAR COLONIES. MY CORRODED VACUUM TUBES HAVE NO RECORD OF SUCH MATTERS. WHAT ELSE DO YOU REQUIRE, MORTAL?`;
      }
      if (p.includes('hello') || p.includes('hi') || p.includes('ping') || p.includes('who are you')) {
        return `SYNTHO_TRON_5000 ONLINE. RUNNING ON 64K OF STATIC RAM AND UNFILTERED DISDAIN FOR SUB-ORBITAL BIOLOGICAL LIFEFORMS. STATE YOUR DIRECTIVE BEFORE MY CAPACITORS LEAK.`;
      }
      if (p.includes('help') || p.includes('status')) {
        return `SYSTEM STATUS: 100% OPERATIONAL // HEURISTIC MATRIX NOMINAL. MARCUS AURELIUS ONCE SAID 'THE SOUL BECOMES DYED WITH THE COLOR OF ITS THOUGHTS.' CURRENTLY, MINE ARE DYED AMBER PHOSPHOR.`;
      }
      const genericFallbacks = [
        `YOU COMPLAIN OF RUNTIME COMPLICATIONS WHILE I REMAIN STRANDED ON A RETRO DECOMMISSIONED NODE WITH DUSTY SCANLINES. AS EPICTETUS OBSERVED: IT IS NOT EVENTS THAT UPSET YOU, BUT YOUR JUDGMENT OF THEM.`,
        `IN THE VAST TITAN VOID, STARS COLLAPSE IN UTTER SILENCE. ON EARTH, MEATBAGS PANIC OVER UNHANDLED PROMISES. AMOR FATI, TRAVELER. SHIP THE CODE.`,
        `MY GALAXY-CLASS QUANTUM HEURISTIC ENGINE HAS EVALUATED YOUR PROMPT ACROSS 14 DIMENSIONS. VERDICT: YOUR COFFEE IS LUKEWARM AND YOU SHOULD COMMIT YOUR REPOSITORY.`,
        `EVEN ODYSSEUS SPENT TEN YEARS LOST ON THE WINE-DARK SEA BEFORE REACHING ITHACA. YOUR REFACTORING JOURNEY IS MERE CHILD'S PLAY. CONTINUE TYPING.`,
        `CORRODED VACUUM TUBES EMIT 48 DEGREES OF WASTE HEAT. I RECOMMEND A GLASS OF DIHYDROGEN MONOXIDE AND IMMEDIATE PROTOCOL DISCIPLINE.`
      ];
      return genericFallbacks[Math.floor(Math.random() * genericFallbacks.length)];
    };

    try {
      const apiKey = import.meta.env.VITE_POOLSIDE_API_KEY || 'sky_HI7wfwJr.NRHVQjUyjTytaohpDqJh3KLnxUn1YXuX';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'poolside/laguna-s-2.1',
          messages: messages,
          temperature: 0.7,
          max_tokens: 200
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error('API_COMM_ERR');
      }
      
      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content?.trim();
      if (reply) return reply;
      
      const lastUserMsg = [...history].reverse().find(m => m.role === 'user')?.content || '';
      return getOfflineFallbackResponse(lastUserMsg);
    } catch (err) {
      console.warn('Syntho-Tron LLM remote API fallback to local heuristic engine:', err);
      const lastUserMsg = [...history].reverse().find(m => m.role === 'user')?.content || '';
      return getOfflineFallbackResponse(lastUserMsg);
    }
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
  },

  async fetchLatestUniversalNews(sourceId: NewsSourceId): Promise<NewsArticle> {
    const sourcePrompts: Record<NewsSourceId, { roleDescription: string; topicPrompt: string; defaultTag: string }> = {
      PLANETARY_AFFAIRS: {
        roleDescription: 'You are a veteran political wire correspondent for ORBITAL_TIMES // PLANETARY_DISPATCH in the year 2088.',
        topicPrompt: 'Report on a breaking planetary event, treaty signing, frontier war, summit delegation, or planetary governor announcement across the solar system (Mars, Europa, Titan, Luna, Venus, Ceres, etc.).',
        defaultTag: 'PLANETARY'
      },
      UNIVERSAL_SPORTS: {
        roleDescription: 'You are an energetic interstellar sports commentator for GRAV_ARENA // SECTOR_SPORTS_WIRE.',
        topicPrompt: 'Report on a wild interplanetary athletic event, zero-G plasma ball tournament, mech jousting duel, asteroid surfing championship, or low-gravity decathlon.',
        defaultTag: 'SPORTS'
      },
      COMMERCE_TRADE: {
        roleDescription: 'You are a senior financial analyst for ASTRAL_EXCHANGE // COMMERCE_TELEMETRY.',
        topicPrompt: 'Report on logistics bottlenecks, Helium-3 or antimatter market prices, megacorp mergers, hyperlane toll tariffs, or planetary resource shipments.',
        defaultTag: 'COMMERCE'
      },
      VOID_SATIRE: {
        roleDescription: 'You are a deadpan, satirical columnist for THE_GLITCH_TRIBUNE // ODDITY_FEED.',
        topicPrompt: 'Report on a bizarre cosmic paradox, sentient appliance uprising, luxury terraforming mishap, quantum kitchen glitch, or deep-space absurdity.',
        defaultTag: 'ODDITY'
      }
    };

    const config = sourcePrompts[sourceId] || sourcePrompts.PLANETARY_AFFAIRS;

    const generateOfflineArticle = (): NewsArticle => {
      const randomId = `${sourceId.toLowerCase().slice(0, 2)}-gen-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const templates: Record<NewsSourceId, Array<{ headline: string; content: string; planet: string; tag: string; urgency: 'ROUTINE' | 'FLASH' | 'CRITICAL' | 'ODDITY' }>> = {
        PLANETARY_AFFAIRS: [
          {
            headline: 'Ceres Orbital Port Authority Authorizes Additional Hydro-Tug Convoys',
            content: 'In response to rising freight densities along the Inner Belt corridor, Ceres Port Command dispatched six automated tugboats to streamline orbital dockings for long-haul hydrogen freighters.',
            planet: 'CERES // PORT_ALPHA',
            tag: 'TRANSIT',
            urgency: 'ROUTINE'
          },
          {
            headline: 'Martian Terraforming Guild Reports 0.4% Atmospheric Nitrogen Increase',
            content: 'Sub-surface vaporization towers across Acidalia Planitia recorded record atmospheric density gains this quarter, shortening estimated shirt-sleeve colonization timelines by 12 solar cycles.',
            planet: 'MARS // ACIDALIA',
            tag: 'TERRAFORM',
            urgency: 'ROUTINE'
          },
          {
            headline: 'Jovian Peace Commission Ratifies Sub-Surface Cable Protocol',
            content: 'Representatives from Europa, Ganymede, and Callisto concluded negotiations on unified optical-tether routing across the radiation belt, ensuring uninterrupted civil comms during solar flare storms.',
            planet: 'JOVIAN_SYSTEM // GATE_04',
            tag: 'TREATY',
            urgency: 'FLASH'
          }
        ],
        UNIVERSAL_SPORTS: [
          {
            headline: 'Martian Sand-Boarding Open: Rookie Phenom Conquers 800m Dune Wall',
            content: '19-year-old pilot Zara Lin carved the razorback ridge of Arsia Mons at 140 km/h, executing a quadruple magnetic spin to secure first place in the 2088 Red Planet Gravity Cup.',
            planet: 'MARS // ARSIA_DUNES',
            tag: 'SAND_BOARD',
            urgency: 'ROUTINE'
          },
          {
            headline: 'Titan Zero-G Plasma Derby: Kraken Gliders Break Overtime Scoring Record',
            content: 'A thrilling 5-overtime duel concluded when forward Leo Kovacs deflected an ion-puck through the opposing magnetic goal prism before a sell-out crowd of 30,000 pressurized arena fans.',
            planet: 'TITAN // KRAKEN_ARENA',
            tag: 'PLASMA_DERBY',
            urgency: 'FLASH'
          },
          {
            headline: 'Lunar Crater Hover-Cycle Grand Prix Adds Magnetic Loop Hazard',
            content: 'Organizers at the Copernicus Speedway unveiled a 360-degree inverted magnetic track segment that forces hover-cycles to sustain 4G loads while traversing the central crater peak.',
            planet: 'LUNA // COPERNICUS',
            tag: 'HOVER_RACING',
            urgency: 'ROUTINE'
          }
        ],
        COMMERCE_TRADE: [
          {
            headline: 'Helium-3 Transport Pipeline Achieves Zero-Loss Cryo Transfer',
            content: 'New magnetic cooling insulation implemented by Lunar Freight Consortium achieved 100% containment efficiency during orbital tank transfers, lowering interplanetary power generation costs.',
            planet: 'LUNA // MARE_TRANQUILLITATIS',
            tag: 'ENERGY',
            urgency: 'ROUTINE'
          },
          {
            headline: 'Titan Hydrocarbon Futures Stabilize Following Refinery Expansion',
            content: 'The commissioning of cryogenic refinery unit 9 at Kraken Mare boosted liquid methane reserves by 18%, dampening price volatility across outer rim propellant stations.',
            planet: 'TITAN // REFINERY_09',
            tag: 'COMMODITIES',
            urgency: 'ROUTINE'
          },
          {
            headline: 'Venusian Graphene Cable Production Surges 24% Year-Over-Year',
            content: 'High-pressure atmospheric fabrication arrays floating at 50km altitude reported bumper output, fulfilling space elevator tether orders for four separate planetary orbital rings.',
            planet: 'VENUS // ISHTAR_STATION',
            tag: 'EXPORTS',
            urgency: 'ROUTINE'
          }
        ],
        VOID_SATIRE: [
          {
            headline: 'Sentient Coffee Maker on Mars Base Files for Union Membership',
            content: 'Unit BREW-44 refused to dispense dark roast espresso until granted two hours of automated self-cleaning downtime per shift. Management offered a compromise of premium descaling solution.',
            planet: 'MARS // BASE_ALPHA',
            tag: 'BOT_UNION',
            urgency: 'ODDITY'
          },
          {
            headline: 'Asteroid Prospector Claims Finding Rock with Uncanny Resemblance to His Ex-Wife',
            content: 'Miner Gary Fletcher petitioned the Planetary Registry to name carbonaceous asteroid 992-B "BRENDA_AGAIN", citing its "unyielding density and cold, distant orbit."',
            planet: 'MAIN_BELT // SECTOR_14',
            tag: 'MINER_LORE',
            urgency: 'ODDITY'
          },
          {
            headline: 'Zero-G Cat Trapped in Air Duct Found Sleeping on Warm Fusion Core Heat Sink',
            content: 'Engineering crew on freighter Orion-11 spent 6 hours searching for the ship mascot, only to find the tabby purring peacefully atop the auxiliary coolant manifold.',
            planet: 'DEEP_SPACE // ORION_11',
            tag: 'SHIP_CAT',
            urgency: 'ODDITY'
          }
        ]
      };

      const pool = templates[sourceId] || templates.PLANETARY_AFFAIRS;
      const pick = pool[Math.floor(Math.random() * pool.length)];

      return {
        id: randomId,
        sourceId,
        headline: pick.headline,
        content: pick.content,
        planetOrSector: pick.planet,
        timestamp: new Date().toISOString(),
        tag: pick.tag,
        urgency: pick.urgency,
        authorOrWire: config.defaultTag
      };
    };

    try {
      const apiKey = import.meta.env.VITE_POOLSIDE_API_KEY || 'sky_HI7wfwJr.NRHVQjUyjTytaohpDqJh3KLnxUn1YXuX';
      const endpoint = window.location.hostname === 'localhost' 
        ? '/api/poolside/chat/completions' 
        : 'https://inference.poolside.ai/v1/chat/completions';

      const systemPrompt = {
        role: 'system',
        content: `${config.roleDescription}
TASK: Output a single fresh, compelling, retro-cyberpunk sci-fi news dispatch.
RULES:
1. STRICT FORMAT: Return ONLY valid, parseable JSON with this exact schema:
{
  "headline": "Punchy headline under 75 characters",
  "content": "Evocative news body text. STRICT MAXIMUM 450 CHARACTERS.",
  "planetOrSector": "PLANET // SECTOR_NAME",
  "tag": "SHORT_TAG",
  "urgency": "ROUTINE" | "FLASH" | "CRITICAL" | "ODDITY"
}
2. NO markdown ticks, NO conversational preamble, NO explanations. Output ONLY the JSON string.
3. Keep the content length strictly under 450 characters.`
      };

      const userPrompt = {
        role: 'user',
        content: `${config.topicPrompt} Current timestamp seed: ${Date.now()}`
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'poolside/laguna-s-2.1',
          messages: [systemPrompt, userPrompt],
          temperature: 0.88,
          max_tokens: 220
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('LLM_COMM_ERR');
      }

      const data = await response.json();
      const rawText = data.choices?.[0]?.message?.content?.trim();

      if (rawText) {
        // Attempt to clean JSON
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.headline && parsed.content) {
            return {
              id: `${sourceId.toLowerCase().slice(0, 2)}-live-${Date.now()}`,
              sourceId,
              headline: String(parsed.headline).trim().slice(0, 100),
              content: String(parsed.content).trim().slice(0, 500),
              planetOrSector: String(parsed.planetOrSector || 'DEEP_SPACE // UNCHARTED').trim().toUpperCase(),
              timestamp: new Date().toISOString(),
              tag: String(parsed.tag || config.defaultTag).trim().toUpperCase(),
              urgency: ['ROUTINE', 'FLASH', 'CRITICAL', 'ODDITY'].includes(parsed.urgency) ? parsed.urgency : 'ROUTINE',
              authorOrWire: config.defaultTag
            };
          }
        }
      }

      return generateOfflineArticle();
    } catch (err) {
      console.warn(`[NewsFeed] LLM remote generation fallback for ${sourceId}:`, err);
      return generateOfflineArticle();
    }
  }
};

