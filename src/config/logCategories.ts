import type { CategoryType, CategoryGroup } from '../types';

export interface CategoryMeta {
  id: CategoryType;
  group: CategoryGroup;
  label: string;
  badge: string;
  icon: string;
  codename: string;
  description: string;
  accentColor: string; // Tailwind color class or hex token
  defaultTitle: string;
}

export interface CategoryGroupMeta {
  id: CategoryGroup;
  label: string;
  icon: string;
  codename: string;
  description: string;
  badgeColor: string;
}

export const CATEGORY_GROUPS: CategoryGroupMeta[] = [
  {
    id: 'CYBER_OPS',
    label: 'CYBER_OPS',
    icon: 'terminal',
    codename: 'GROUP_01 // SYSTEM_KERNEL',
    description: 'Engineering, deep-work telemetry, anomalies, homelab and code releases',
    badgeColor: 'border-neon-cyan text-neon-cyan bg-neon-cyan/10'
  },
  {
    id: 'VITALS',
    label: 'VITALS',
    icon: 'vital_signs',
    codename: 'GROUP_02 // BIO_MAINTENANCE',
    description: 'Physical biometrics, caffeine, sleep debt, nutrition and mental resonance',
    badgeColor: 'border-[#33ff00] text-[#33ff00] bg-[#33ff00]/10'
  },
  {
    id: 'PRODUCTIVITY',
    label: 'PRODUCTIVITY',
    icon: 'bolt',
    codename: 'GROUP_03 // EXECUTION_CADENCE',
    description: 'Timebox sprints, daily frogs, standups, Eisenhower matrix and micro-checklists',
    badgeColor: 'border-[#ffb703] text-[#ffb703] bg-[#ffb703]/10'
  },
  {
    id: 'SKY_LIFE',
    label: 'SKY_LIFE',
    icon: 'satellite_alt',
    codename: 'GROUP_04 // ORBITAL_CULTURE',
    description: 'Daily credit burn, cinema, audio chronicles, gaming and social orbits',
    badgeColor: 'border-[#df9ffb] text-[#df9ffb] bg-[#df9ffb]/10'
  }
];

export const ALL_LOG_CATEGORIES: CategoryMeta[] = [
  // ==========================================
  // 1. CYBER_OPS
  // ==========================================
  {
    id: 'AI_EXPERIMENT',
    group: 'CYBER_OPS',
    label: 'AI_LAB',
    badge: '[AI_LAB_EXP]',
    icon: 'science',
    codename: 'EXP_LOG // MOD_01',
    description: 'AI/ML model experimentation, loss metrics, and AI product evaluations',
    accentColor: 'text-neon-cyan',
    defaultTitle: 'AI Experiment run'
  },
  {
    id: 'FLOW_TELEMETRY',
    group: 'CYBER_OPS',
    label: 'FLOW_STATE',
    badge: '[DEEP_WORK_BURST]',
    icon: 'psychology',
    codename: 'FLOW_LOG // MOD_02',
    description: 'Uninterrupted deep-work coding sessions & focus depth',
    accentColor: 'text-neon-cyan',
    defaultTitle: 'Deep Work Sprint'
  },
  {
    id: 'INCIDENT_POSTMORTEM',
    group: 'CYBER_OPS',
    label: 'POSTMORTEM',
    badge: '[ANOMALY_REPORT]',
    icon: 'bug_report',
    codename: 'BUG_LOG // MOD_03',
    description: 'Incident autopsy, tough bug fixes, memory leaks & patches',
    accentColor: 'text-[#ff4d6d]',
    defaultTitle: 'Anomaly incident fix'
  },
  {
    id: 'INTEL_SYNAPSE',
    group: 'CYBER_OPS',
    label: 'INTEL_SYNAPSE',
    badge: '[RESEARCH_ARCHIVE]',
    icon: 'menu_book',
    codename: 'INTEL_LOG // MOD_04',
    description: 'Whitepapers, technical documentation and mental models',
    accentColor: 'text-neon-cyan',
    defaultTitle: 'Research digest'
  },
  {
    id: 'HOMELAB_RIG',
    group: 'CYBER_OPS',
    label: 'HOMELAB_RIG',
    badge: '[HARDWARE_TELEMETRY]',
    icon: 'dns',
    codename: 'NODE_LOG // MOD_05',
    description: 'GPU thermals, homelab server maintenance & Docker nodes',
    accentColor: 'text-neon-cyan',
    defaultTitle: 'Homelab node telemetry'
  },
  {
    id: 'RELEASE_RADAR',
    group: 'CYBER_OPS',
    label: 'RELEASE_RADAR',
    badge: '[DEPLOYMENT_LOG]',
    icon: 'rocket_launch',
    codename: 'SHIP_LOG // MOD_06',
    description: 'Version tags, git commit hashes & production deployment logs',
    accentColor: 'text-neon-cyan',
    defaultTitle: 'Deployment release'
  },

  // ==========================================
  // 2. VITALS
  // ==========================================
  {
    id: 'CAFFEINE_LOG',
    group: 'VITALS',
    label: 'CAFFEINE',
    badge: '[STIM_INTEL]',
    icon: 'coffee',
    codename: 'CAFE_LOG // MOD_07',
    description: 'Coffee bean origin, brew methods, flavor profiles and ratings',
    accentColor: 'text-[#ffb703]',
    defaultTitle: 'Caffeine brew'
  },
  {
    id: 'ACTIVITY_LOG',
    group: 'VITALS',
    label: 'BIOMETRICS',
    badge: '[BIO_METRICS]',
    icon: 'directions_run',
    codename: 'ACT_LOG // MOD_08',
    description: 'Runs, stairs climbing, VO2 max, heart rate and body composition',
    accentColor: 'text-[#33ff00]',
    defaultTitle: 'Physical activity'
  },
  {
    id: 'HIBERNATION_LOG',
    group: 'VITALS',
    label: 'HIBERNATION',
    badge: '[SLEEP_TELEMETRY]',
    icon: 'bedtime',
    codename: 'SLEEP_LOG // MOD_09',
    description: 'Sleep schedule, sleep debt hours, morning clarity and dream fragments',
    accentColor: 'text-[#80ed99]',
    defaultTitle: 'Sleep cycle log'
  },
  {
    id: 'CHEM_STACK',
    group: 'VITALS',
    label: 'CHEM_STACK',
    badge: '[BIO_FUEL_INTEL]',
    icon: 'medication',
    codename: 'CHEM_LOG // MOD_10',
    description: 'Nootropics, supplements, hydration stacks and energy deltas',
    accentColor: 'text-[#33ff00]',
    defaultTitle: 'Supplement intake'
  },
  {
    id: 'RATION_INTEL',
    group: 'VITALS',
    label: 'RATION_GRID',
    badge: '[NUTRITION_GRID]',
    icon: 'restaurant',
    codename: 'FOOD_LOG // MOD_11',
    description: 'Meal tracking, clean fuel ratings and intermittent fasting windows',
    accentColor: 'text-[#33ff00]',
    defaultTitle: 'Meal intake'
  },
  {
    id: 'MOOD_SPECTRUM',
    group: 'VITALS',
    label: 'MOOD_SPECTRUM',
    badge: '[PSYCHE_RESONANCE]',
    icon: 'mood',
    codename: 'MOOD_LOG // MOD_12',
    description: 'Daily emotional check-in, stress levels, triggers and gratitude',
    accentColor: 'text-[#57cc99]',
    defaultTitle: 'Daily psyche check'
  },
  {
    id: 'STILLNESS_INTERVAL',
    group: 'VITALS',
    label: 'STILLNESS',
    badge: '[ZEN_PAUSE]',
    icon: 'self_improvement',
    codename: 'ZEN_LOG // MOD_13',
    description: 'Meditation, box breathing, nature walks and mental decluttering',
    accentColor: 'text-[#80ed99]',
    defaultTitle: 'Stillness session'
  },

  // ==========================================
  // 3. PRODUCTIVITY
  // ==========================================
  {
    id: 'DUTY_ROSTER',
    group: 'PRODUCTIVITY',
    label: 'DUTY_ROSTER',
    badge: '[DUTY_ROSTER]',
    icon: 'task_alt',
    codename: 'DUTY_LOG // MOD_14',
    description: 'Assigned protocol missions, deadlines, priorities and statuses',
    accentColor: 'text-[#ffb703]',
    defaultTitle: 'Duty task'
  },
  {
    id: 'CHRONO_SPRINT',
    group: 'PRODUCTIVITY',
    label: 'CHRONO_SPRINT',
    badge: '[TIMEBOX_SPRINT]',
    icon: 'timer',
    codename: 'POMO_LOG // MOD_15',
    description: '25m/50m Pomodoro sprint with live distraction counters & task checklist',
    accentColor: 'text-[#ffb703]',
    defaultTitle: 'Pomodoro focus sprint'
  },
  {
    id: 'DAILY_FROG',
    group: 'PRODUCTIVITY',
    label: 'DAILY_FROG',
    badge: '[PRIORITY_ZERO]',
    icon: 'crisis_alert',
    codename: 'FROG_LOG // MOD_16',
    description: 'Eliminate the single hardest high-friction task of the day',
    accentColor: 'text-[#ff9e00]',
    defaultTitle: 'Eat that frog task'
  },
  {
    id: 'QUADRANT_MATRIX',
    group: 'PRODUCTIVITY',
    label: 'QUADRANT',
    badge: '[EISENHOWER_ROUTER]',
    icon: 'grid_view',
    codename: 'QUAD_LOG // MOD_17',
    description: 'Eisenhower priority router: Urgent vs Important sorting',
    accentColor: 'text-[#ffb703]',
    defaultTitle: 'Eisenhower matrix item'
  },
  {
    id: 'BLOCKED_QUEUE',
    group: 'PRODUCTIVITY',
    label: 'BLOCKED_QUEUE',
    badge: '[WAITING_ON_PINGS]',
    icon: 'hourglass_empty',
    codename: 'WAIT_LOG // MOD_18',
    description: 'External dependency tracker with automated follow-up ping dates',
    accentColor: 'text-[#ffb703]',
    defaultTitle: 'Blocked dependency'
  },
  {
    id: 'INTERSTITIAL_JOT',
    group: 'PRODUCTIVITY',
    label: 'TRANSITION_JOT',
    badge: '[TRANSITION_NOTE]',
    icon: 'fast_forward',
    codename: 'JOT_LOG // MOD_19',
    description: '1-line note between task switches to eliminate switching latency',
    accentColor: 'text-[#ffb703]',
    defaultTitle: 'Task transition note'
  },
  {
    id: 'DAWN_DUSK_STANDUP',
    group: 'PRODUCTIVITY',
    label: 'SOLAR_STANDUP',
    badge: '[SOLAR_STANDUP]',
    icon: 'wb_twilight',
    codename: 'SUN_LOG // MOD_20',
    description: 'Morning intentions & evening debrief daily standup bookends',
    accentColor: 'text-[#ffb703]',
    defaultTitle: 'Solar cycle standup'
  },
  {
    id: 'NEURAL_SCRATCHPAD',
    group: 'PRODUCTIVITY',
    label: 'SCRATCHPAD',
    badge: '[BRAIN_DUMP]',
    icon: 'draw',
    codename: 'DUMP_LOG // MOD_21',
    description: 'Rapid brain dump inbox for fleeting thoughts, sparks and errands',
    accentColor: 'text-[#ffb703]',
    defaultTitle: 'Neural scratchpad thought'
  },
  {
    id: 'FIVE_MINUTE_IGNITION',
    group: 'PRODUCTIVITY',
    label: '5MIN_IGNITION',
    badge: '[FRICTION_BREAKER]',
    icon: 'local_fire_department',
    codename: 'IGNITE_LOG // MOD_22',
    description: '5-minute anti-procrastination starter timer to catch momentum',
    accentColor: 'text-[#ff5400]',
    defaultTitle: '5-minute ignition start'
  },
  {
    id: 'DAILY_CADENCE_CHECKLIST',
    group: 'PRODUCTIVITY',
    label: 'CADENCE_LIST',
    badge: '[ROUTINE_CADENCE]',
    icon: 'checklist',
    codename: 'CADENCE_LOG // MOD_23',
    description: 'Non-negotiable daily maintenance checklist rituals & completion percentage',
    accentColor: 'text-[#ffb703]',
    defaultTitle: 'Daily cadence routine'
  },
  {
    id: 'FREEFORM_LOG',
    group: 'PRODUCTIVITY',
    label: 'FREEFORM',
    badge: '[FREEFORM_NOTE]',
    icon: 'edit_document',
    codename: 'FREE_LOG // MOD_24',
    description: 'Unconstrained markdown notes and terminal scratch logs',
    accentColor: 'text-[#ffb703]',
    defaultTitle: 'Freeform protocol note'
  },

  // ==========================================
  // 4. SKY_LIFE
  // ==========================================
  {
    id: 'CREDIT_BURN',
    group: 'SKY_LIFE',
    label: 'CREDIT_BURN',
    badge: '[DAILY_EXPENSE]',
    icon: 'payments',
    codename: 'BURN_LOG // MOD_25',
    description: 'Daily expenses, merchant radar, budget burn and impulse checks',
    accentColor: 'text-[#df9ffb]',
    defaultTitle: 'Credit expense'
  },
  {
    id: 'SCREEN_TELEMETRY',
    group: 'SKY_LIFE',
    label: 'CINEMA_LOG',
    badge: '[CINEMA_CHRONICLE]',
    icon: 'movie',
    codename: 'CINE_LOG // MOD_26',
    description: 'Movies, anime series, TV documentaries and reviews',
    accentColor: 'text-[#df9ffb]',
    defaultTitle: 'Screen telemetry'
  },
  {
    id: 'SONIC_CHRONICLE',
    group: 'SKY_LIFE',
    label: 'SONIC_LOG',
    badge: '[AUDIO_DISPATCH]',
    icon: 'headphones',
    codename: 'AUDIO_LOG // MOD_27',
    description: 'Albums on repeat, podcast insights, music genres and ratings',
    accentColor: 'text-[#df9ffb]',
    defaultTitle: 'Sonic chronicle'
  },
  {
    id: 'VIRTUAL_ARENA',
    group: 'SKY_LIFE',
    label: 'GAMING_LOG',
    badge: '[GAMING_STATION]',
    icon: 'sports_esports',
    codename: 'GAME_LOG // MOD_28',
    description: 'Gaming sessions, platform telemetry, wins and achievements',
    accentColor: 'text-[#df9ffb]',
    defaultTitle: 'Virtual arena session'
  },
  {
    id: 'COMMS_LINK',
    group: 'SKY_LIFE',
    label: 'COMMS_LINK',
    badge: '[SOCIAL_ORBIT]',
    icon: 'forum',
    codename: 'COMMS_LOG // MOD_29',
    description: 'Social check-ins, friends, family conversations and follow-up dates',
    accentColor: 'text-[#df9ffb]',
    defaultTitle: 'Comms link catchup'
  },
  {
    id: 'MICRO_TRIUMPHS',
    group: 'SKY_LIFE',
    label: 'MICRO_WINS',
    badge: '[SMALL_WINS]',
    icon: 'military_tech',
    codename: 'WIN_LOG // MOD_30',
    description: 'Daily small wins, discipline milestones and habit victories',
    accentColor: 'text-[#ffd166]',
    defaultTitle: 'Micro triumph'
  }
];

export const DEFAULT_ENABLED_CATEGORIES: CategoryType[] = ALL_LOG_CATEGORIES.map(c => c.id);

export function getCategoryMeta(id: CategoryType): CategoryMeta {
  const found = ALL_LOG_CATEGORIES.find(c => c.id === id);
  if (found) return found;
  return ALL_LOG_CATEGORIES[0];
}

export function getGroupMeta(group: CategoryGroup): CategoryGroupMeta {
  const found = CATEGORY_GROUPS.find(g => g.id === group);
  if (found) return found;
  return CATEGORY_GROUPS[0];
}
