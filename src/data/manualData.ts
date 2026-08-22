export interface ManualSection {
  id: string;
  number: string;
  title: string;
  category: string;
  badge: string;
  summary: string;
  content: {
    heading: string;
    description: string;
    subsections: {
      title: string;
      directive?: string;
      body: string[];
      codeOrAscii?: string[];
      tips?: string[];
    }[];
  };
}

export const MANUAL_SECTIONS: ManualSection[] = [
  {
    id: 'cold_boot_auth',
    number: '01',
    title: 'COLD_BOOT_&_ENCLAVE_AUTH',
    category: 'SYSTEM CORE',
    badge: 'SYS_INIT',
    summary: 'Airgap authentication, offline session TTL, health telemetry diagnostics, and cloud PostgreSQL database synchronization.',
    content: {
      heading: 'SECTION 01: SYSTEM INITIALIZATION & AIRGAP ENCLAVE PROTOCOLS',
      description: 'After Dark Protocol operates in a dual-state architecture: full cloud persistence via Supabase PostgreSQL, or an airgapped enclave operating purely on local client NVRAM with automatic background sync queue.',
      subsections: [
        {
          title: 'AIRGAP OFFLINE MODE & 60-MINUTE SESSION TTL',
          directive: '> DIRECTIVE // ISO-8086: AIRGAP ISOLATION ENGAGED',
          body: [
            'When booting in offline mode (or when network connection to the orbital mainframe is severed), the terminal enters an isolated airgap state.',
            'Offline sessions are provisioned with a 60-minute time-to-live (TTL). A real-time countdown timer in the top telemetry pill indicates remaining airgap clearance.',
            'All telemetry, notes, chat transcripts, and custom settings persist locally to browser NVRAM storage without data loss.'
          ]
        },
        {
          title: 'HEALTH TELEMETRY & SUB-SYSTEM DIAGNOSTICS',
          directive: '> TELEMETRY // REAL-TIME BUFFER INTEGRITY',
          body: [
            'Hover over the bottom-right OFFLINE / AIRGAP badge in the footer bar to slide up the real-time SYSTEM // HEALTH_TELEMETRY diagnostic box.',
            'Visualizes overall terminal health percentage (Nominal > 40%, Degrading > 15%, Critical < 15%), remaining airgap session TTL, queued records pending synchronization, and persistent storage integrity.'
          ],
          codeOrAscii: [
            '┌─────────────────────────────────────────────────────────────┐',
            '│ SYSTEM // HEALTH_TELEMETRY                   [AIRGAP_NODE]  │',
            '│ OVERALL_HEALTH: 100% [NOMINAL]                              │',
            '│ ████████████████████░░░░░░░░░░                              │',
            '│ > AIRGAP_SESSION    : 60m / 60m TTL                         │',
            '│ > PERSISTENT_STORAGE: LOCAL_DATABASE (OK)                   │',
            '│ > QUEUED_RECORDS    : 0 PENDING_SYNC                        │',
            '└─────────────────────────────────────────────────────────────┘'
          ]
        },
        {
          title: 'CLOUD SYNC & RE-AUTHENTICATION',
          body: [
            'When reconnecting to orbital networks or logging in with valid operator credentials, queued local records are automatically upserted into the PostgreSQL cloud database.',
            'If airgap session health drops below 10%, an emergency [ ATTEMPT SERVER LOGIN ] interlock unlocks in the Neural Jack dropdown.'
          ]
        }
      ]
    }
  },
  {
    id: 'neural_schema_matrix',
    number: '02',
    title: 'NEURAL_SCHEMA_MATRIX',
    category: 'SCHEMAS & DATA',
    badge: 'SCHEMA_MGR',
    summary: 'Domain group architecture (Cyber Ops, Vitals, Productivity, Sky Life), two-pane log matrix configuration, and journal quick-selector.',
    content: {
      heading: 'SECTION 02: NEURAL SCHEMA ARCHITECTURE & CONFIGURATION',
      description: 'The protocol features 30 specialized schema templates partitioned into four distinct life & computing domains.',
      subsections: [
        {
          title: 'THE 4 DOMAIN GROUPS',
          body: [
            '• CYBER_OPS [1-6]: AI Model Experiments, Flow Telemetry, Incident Postmortems, Intel Synapses, Homelab Rig Telemetry, Release Radar.',
            '• VITALS [7-13]: Caffeine Logs, Physical Activity / Biometrics, Hibernation Cycles, Chemical Stacks, Nutrition Intel, Psyche Mood Spectrum, Stillness Intervals.',
            '• PRODUCTIVITY [14-24]: Duty Rosters, Chrono Pomodoro Sprints, Daily Frog Slaying, Eisenhower Quadrant Matrix, Blocked Queues, Interstitial Jots, Solar Standups, Neural Scratchpad, 5-Min Ignition, Daily Cadence Checklist, Freeform Markdown.',
            '• SKY_LIFE [25-30]: Credit Burn Expenses, Screen Telemetry / Cinema, Sonic Chronicles, Virtual Gaming Arenas, Comms Link Social Syncs, Micro Triumphs.'
          ]
        },
        {
          title: 'TWO-PANE LOG MATRIX CONFIGURATION MODAL',
          directive: '> ACCESS // NEURAL_JACK -> [ LOG_MATRIX_CONFIG ]',
          body: [
            'The Log Matrix Config window allows operators to selectively enable or disable schemas to streamline their daily interface.',
            'Left Pane: Category selector showing active schema counts for each domain group, with [ ALL ON ] and [ ALL OFF ] domain toggles.',
            'Right Pane: Schema cards with clear multi-line layout (Name, category badge, description, and [ X ] / [   ] active status toggle).',
            'Global controls: [ ALL ON ] activates all 30 schemas; [ RESET ] restores default protocol schemas.'
          ]
        },
        {
          title: 'TOP BAR JOURNAL SCHEMA SELECTOR',
          directive: '> ACCESS // TOP BAR -> [ JOURNAL // SCHEMA_SELECTOR ] (HOTKEY: J)',
          body: [
            'Click the Journal dropdown button in the top bar (or press hotkey "J") to rapidly switch active schema forms with keyboard navigation (Up/Down arrow keys, Enter to select).'
          ]
        }
      ]
    }
  },
  {
    id: 'data_entry_timers',
    number: '03',
    title: 'DATA_ENTRY_&_TIMERS',
    category: 'TELEMETRY INPUT',
    badge: 'CMD_IN',
    summary: 'Submitting telemetry, integrated countdown & stopwatch micro-timers, and in-place note editing mode.',
    content: {
      heading: 'SECTION 03: DATA ENTRY TERMINAL & MICRO-TIMERS',
      description: 'The Primary Data Entry Terminal ([SYS_CMD_IN] // ROOT) in the top-left bento cell provides schema-tailored reactive form controls.',
      subsections: [
        {
          title: 'STANDARD DATA ENTRY',
          body: [
            '1. Enter a descriptive title in the LOG_TITLE field.',
            '2. Complete the custom schema subform fields (inputs, ratings, sliders, checkboxes, dropdowns).',
            '3. Click the cyan/amber commit button or press Enter to persist the record.'
          ]
        },
        {
          title: 'INTEGRATED MICRO-TIMERS',
          directive: '> HARDWARE MODULE // COUNTDOWN & STOPWATCH',
          body: [
            'Several productivity and vitals schemas (Flow Telemetry, Chrono Sprint, Stillness Interval, 5-Min Ignition) include embedded 80s micro-timers.',
            'Controls: [ START ] / [ PAUSE ] and [ RST ] (reset). Stopwatch modes calculate duration in minutes automatically upon completion.'
          ]
        },
        {
          title: 'IN-PLACE NOTE EDITING MODE',
          directive: '> ACTION // REC_LOGS -> HOVER -> [ EDIT ]',
          body: [
            'Clicking the edit icon on any log in the REC_LOGS pane activates Note Edit Mode.',
            'The form immediately switches to that log\'s schema and copies all saved fields, values, ratings, and text into the editor.',
            'A flashing amber status banner [ EDITING_RECORD: ADP-XXXX ] appears with a [ CANCEL EDIT ] button.',
            'Submitting updates the record in-place in local NVRAM and PostgreSQL cloud storage.'
          ]
        }
      ]
    }
  },
  {
    id: 'rec_logs_dot_matrix',
    number: '04',
    title: 'REC_LOGS_&_TRACTOR_STUB',
    category: 'OUTPUT & PRINT',
    badge: 'PRINTER_24PIN',
    summary: 'Recent logs panel, hover action toolbar, continuous-form dot-matrix printer note stubs, and PNG server tape export.',
    content: {
      heading: 'SECTION 04: REC_LOGS & CONTINUOUS TRACTOR-FEED PRINTER',
      description: 'The REC_LOGS pane displays chronological protocol history with interactive hover controls and an authentic 80s dot-matrix printer note stub engine.',
      subsections: [
        {
          title: 'REC_LOGS HOVER ACTIONS',
          body: [
            'Hover over any note card in the REC_LOGS pane to reveal 3 quick-action icons:',
            '• [ EDIT ] (Cyan): Copies note contents into the left-pane Data Entry Terminal for editing.',
            '• [ PRINT ] (Green): Slides down an authentic 24-pin continuous-feed dot-matrix printer note stub.',
            '• [ DELETE ] (Red): Prompts confirmation and permanently deletes the record.'
          ]
        },
        {
          title: '24-PIN DOT-MATRIX NOTE STUB',
          directive: '> OUTPUT // EPSON LX-800 CONTINUOUS TRACTOR FEED',
          body: [
            'Clicking [ PRINT ] slides down a vintage tractor-feed computer paper stub directly underneath the selected log item.',
            'Features perforated left and right margin strips with sprocket feed holes (● ● ● ● ●), dashed tear serrations, green-bar computer paper bands, and 24-pin ribbon ink typography.',
            'Displays complete log metadata, formatted telemetry fields, operator ID, and verification checksum.'
          ]
        },
        {
          title: 'CAPTURE BUFFER // SERVER TAPE (PNG EXPORT)',
          directive: '> ACTION // NOTE STUB -> [ CAPTURE BUFFER // SERVER TAPE ]',
          body: [
            'Click the green button on the note stub to render a high-DPI 2x retina PNG image of the exact dot-matrix note stub with perforated edges, automatically downloading as ADP_STUB_<ID>_<TITLE>.png.'
          ]
        }
      ]
    }
  },
  {
    id: 'syntho_tron_tty',
    number: '05',
    title: 'SYNTHO_TRON_TTY_&_VOICE',
    category: 'AI CO-PILOT',
    badge: 'SYNTHO_AI',
    summary: 'SYNTHO_TRON robotic terminal assistant, Web Speech synthetic voice, and Floppy Drive B chat transcript archive.',
    content: {
      heading: 'SECTION 05: SYNTHO_TRON AI CO-PILOT & VOICE SYNTHESIS',
      description: 'SYNTHO_TRON is an onboard 80s retro cyber mainframe assistant operating in the bottom-left terminal panel.',
      subsections: [
        {
          title: 'SYNTHO_TRON CHAT & COMMANDS',
          body: [
            'Engage in conversations, ask technical questions, or execute system commands:',
            '• /help or /manual: Opens this Operator Field Manual.',
            '• /clear: Purges the active on-screen terminal chat buffer.'
          ]
        },
        {
          title: 'ROBOTIC SPEECH SYNTHESIS',
          directive: '> TOGGLE // NEURAL_JACK -> [ SPEECH_SYNTH ]',
          body: [
            'Toggle [ SPEECH_SYNTH ] in the Neural Jack dropdown to enable or disable real-time robotic voice synthesis using the Web Speech Audio API with customized robotic pitch and rate.'
          ]
        },
        {
          title: 'DRIVE B: TTY TRANSCRIPT ARCHIVE',
          directive: '> ACCESS // TOP BAR -> [ FLOPPY_DRIVE ] -> DRIVE B [TRANSCRIPTS]',
          body: [
            'Click the floppy drive in the top bar to inspect Drive B containing the full raw transcript log of all SYNTHO_TRON interactions in green phosphor CRT display.'
          ]
        }
      ]
    }
  },
  {
    id: 'orbital_news_wire',
    number: '06',
    title: 'ORBITAL_NEWS_WIRE_DISPATCH',
    category: 'NEWS WIRE',
    badge: 'SOLAR_WIRE',
    summary: 'Universal News Wire, galactic planetary dispatches, urgency filters, expand/minimize controls, and PNG wire export.',
    content: {
      heading: 'SECTION 06: UNIVERSAL NEWS WIRE & ORBITAL DISPATCHES',
      description: 'A galactic news ticker broadcasting planetary updates, tech breakthroughs, and geopolitical solar dispatches across the system.',
      subsections: [
        {
          title: 'WIRE FEEDS & URGENCY TIERS',
          body: [
            'Dispatches originate from sectors across Sol, Mars Colony, Titan, and Orbital Stations.',
            'Urgency classifications: ROUTINE (Cyan), CRITICAL (Amber), and FLASH (Crimson Red).'
          ]
        },
        {
          title: 'EXPAND & MINIMIZE CONTROLS',
          directive: '> HEADER CONTROLS // [ ▲ / ▼ ] RESIZE & [ _ / ▢ ] MINIMIZE',
          body: [
            'Use the header buttons to minimize the news feed to a slim status bar (giving 100% height to REC_LOGS), or expand it to 65% height to inspect multi-line articles.'
          ]
        },
        {
          title: 'ORBITAL WIRE PNG EXPORT',
          directive: '> ACTION // NEWS ARTICLE -> [ EXPORT_PNG ]',
          body: [
            'Click the export button on any article card to generate and download an authentic high-resolution cyberpunk orbital wire dispatch image.'
          ]
        }
      ]
    }
  },
  {
    id: 'hotkeys_panic_system',
    number: '07',
    title: 'HOTKEY_INDEX_&_PANIC_SYSTEM',
    category: 'KEYBOARD & SAFETY',
    badge: 'HOTKEYS',
    summary: 'Complete keyboard shortcut index, theme hotkeys, Drive A floppy notes, database purging, and panic blackout interlock.',
    content: {
      heading: 'SECTION 07: KEYBOARD SHORTCUTS & EMERGENCY INTERLOCKS',
      description: 'Master keyboard controls and emergency safety interlocks for rapid terminal operation.',
      subsections: [
        {
          title: 'GLOBAL KEYBOARD SHORTCUT MATRIX',
          body: ['Master keyboard controls for rapid tactical terminal command:'],
          codeOrAscii: [
            '┌──────────────┬────────────────────────────────────────────────────────┐',
            '│ KEYBINDING   │ ACTION DESCRIPTION                                     │',
            '├──────────────┼────────────────────────────────────────────────────────┤',
            '│ [ 1 ]        │ Switch to MIDNIGHT_V1.5 (Teal / Cyan Nocturnal Palette)│',
            '│ [ 2 ]        │ Switch to COMET_SUNSET (Amber / Gold CRT Phosphor)     │',
            '│ [ 3 ]        │ Switch to NEO_TWYLITE (Neon Magenta & Cobalt Violet)   │',
            '│ [ 4 ]        │ Switch to NEON_CITY (Hyper-glow Cyberpunk Blurple)     │',
            '│ [ 5 ]        │ Switch to MAINFRAME_8086 (80s Monochrome Green CRT)    │',
            '│ [ T ]        │ Toggle Top Ticker Tape on/off                          │',
            '│ [ N ]        │ Toggle Neural Jack System Configuration Menu           │',
            '│ [ J ]        │ Toggle Journal Schema Selector Dropdown                │',
            '│ [ P ]        │ Open Database Purge confirmation modal                 │',
            '│ [ ESC ]      │ Close active modal, dropdown, or popover               │',
            '└──────────────┴────────────────────────────────────────────────────────┘'
          ]
        },
        {
          title: 'DRIVE A: RAW DATABASE NOTES FLOPPY',
          directive: '> ACCESS // TOP BAR -> [ FLOPPY_DRIVE ] -> DRIVE A [NOTES]',
          body: [
            'Opens the 80s Phosphor Green CRT Raw Database Notes Modal, enabling raw full-text inspection of every logged entry with export capability.'
          ]
        },
        {
          title: 'PANIC EMERGENCY INTERLOCK',
          directive: '> ACTION // CMD_LINKS -> [ PANIC ]',
          body: [
            'Triggers an instantaneous terminal blackout lockdown screen with emergency CRT audio buzz, obscuring all sensitive on-screen data from prying optical sensors until deactivated with operator click.'
          ]
        }
      ]
    }
  }
];
