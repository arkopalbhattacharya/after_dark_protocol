export type CategoryGroup = 'CYBER_OPS' | 'VITALS' | 'PRODUCTIVITY' | 'SKY_LIFE';

export type CategoryType =
  // CYBER_OPS
  | 'AI_EXPERIMENT'
  | 'FLOW_TELEMETRY'
  | 'INCIDENT_POSTMORTEM'
  | 'INTEL_SYNAPSE'
  | 'HOMELAB_RIG'
  | 'RELEASE_RADAR'
  // VITALS
  | 'CAFFEINE_LOG'
  | 'ACTIVITY_LOG'
  | 'HIBERNATION_LOG'
  | 'CHEM_STACK'
  | 'RATION_INTEL'
  | 'MOOD_SPECTRUM'
  | 'STILLNESS_INTERVAL'
  // PRODUCTIVITY
  | 'DUTY_ROSTER'
  | 'CHRONO_SPRINT'
  | 'DAILY_FROG'
  | 'QUADRANT_MATRIX'
  | 'BLOCKED_QUEUE'
  | 'INTERSTITIAL_JOT'
  | 'DAWN_DUSK_STANDUP'
  | 'NEURAL_SCRATCHPAD'
  | 'FIVE_MINUTE_IGNITION'
  | 'DAILY_CADENCE_CHECKLIST'
  | 'FREEFORM_LOG'
  // SKY_LIFE
  | 'CREDIT_BURN'
  | 'SCREEN_TELEMETRY'
  | 'SONIC_CHRONICLE'
  | 'VIRTUAL_ARENA'
  | 'COMMS_LINK'
  | 'MICRO_TRIUMPHS';

export type ThemeName = 'MIDNIGHT_V1.5' | 'COMET_SUNSET_V1.0' | 'NEO_TWYLITE_V1.0' | 'NEON_CITY_AFTERWORK' | 'MAINFRAME_NEURO_8086';

export interface ProtocolLogEntry {
  id: string;
  timestamp: string;
  category: CategoryType;
  title: string;
  payload: any;
}

export interface UserPreferences {
  enabledCategories: CategoryType[];
  theme?: ThemeName;
  crtFlicker?: boolean;
  speechSynth?: boolean;
}

// ==========================================
// 1. CYBER_OPS PAYLOADS
// ==========================================

export type AIExperimentSubType = 'AI_ML_EXPERIMENTATION' | 'AI_PRODUCTS_TRIALS';

export interface AIExperimentPayload {
  subType?: AIExperimentSubType;
  // 1. AI_ML_EXPERIMENTATION fields
  modelStack?: string;
  experimentNotes?: string;
  epochs?: number;
  loss?: number;
  codeSnippet?: string;
  outcomeObservation?: string;

  // 2. AI_PRODUCTS_TRIALS fields
  productName?: string;
  targetDevice?: string;
  positives?: string;
  negatives?: string;
  isPaid?: boolean;
  paymentType?: 'SUBSCRIPTION' | 'ONE_TIME';
  costDetails?: string;
  verdict?: 'KEEP' | 'CAN_IT';
  trialNotes?: string;
}

export interface FlowTelemetryPayload {
  durationMinutes: number;
  targetModule: string;
  flowDepth: 'SURFACE' | 'MODERATE' | 'DEEP_VOID' | 'TRANSCENDENT';
  interruptCount: number;
  soundtrack?: string;
  sessionNotes: string;
}

export interface IncidentPostmortemPayload {
  anomalyName: string;
  severity: 'LOW' | 'HAZARD' | 'SYSTEM_CRITICAL';
  rootCauseType: 'LOGIC_ERROR' | 'MEMORY_LEAK' | 'ASYNC_RACE' | 'CONFIG_DRIFT' | 'DEPENDENCY';
  resolutionSnippet: string;
  timeToFixMinutes: number;
}

export interface IntelSynapsePayload {
  title: string;
  sourceUrl?: string;
  keyTakeaways: string;
  applicability: 'THEORETICAL' | 'IMMEDIATE_USE' | 'FUTURE_PROJECT';
}

export interface HomelabRigPayload {
  nodeId: string;
  thermalsCelsius: number;
  powerDrawWatts?: number;
  storageDelta?: string;
  configChangeNotes: string;
}

export interface ReleaseRadarPayload {
  versionTag: string;
  environment: 'STAGING' | 'PRODUCTION' | 'CLOUD_EDGE';
  gitCommitHash?: string;
  breakingChanges: boolean;
  deploymentOutcome: 'SUCCESS' | 'ROLLED_BACK' | 'DEGRADED';
}

// ==========================================
// 2. VITALS PAYLOADS
// ==========================================

export interface CaffeineLogPayload {
  beanOrigin: string;
  brewMethod: string;
  liked: boolean;
  flavorProfile: string;
}

export type ActivitySubType = 'WALK_RUN' | 'STAIRS' | 'WEIGHT' | 'CORE';

export interface ActivityLogPayload {
  activitySubType?: ActivitySubType;
  durationMinutes?: number;
  avgHeartRate?: number;
  activeKcals?: number;
  walkCompleted?: boolean;
  routeLocation?: string;
  postMoodState?: 'Drained' | 'Centered' | 'Recharged' | 'Euphoric' | string;
  vo2Max?: number;
  stairsClimbed?: number;
  bodyWeightKg?: number;
  muscleRatePercent?: number;
  bodyFatPercent?: number;
}

export interface HibernationLogPayload {
  lightsOutTime: string;
  wakeTime: string;
  sleepQualityScore: number; // 1 to 10
  sleepDebtHours: number;
  dreamFragments?: string;
  morningClarity: 'GROGGY' | 'FUNCTIONAL' | 'HYPER_ALERT';
}

export interface ChemStackPayload {
  intakeType: 'ELECTROLYTES' | 'L_THEANINE' | 'MAGNESIUM' | 'ALPHA_GPC' | 'CREATINE' | 'MATE' | string;
  dosage: string;
  energyDelta: number; // -1 (Drowsy), 0 (Neutral), +1 (Focused), +2 (Overclocked)
  timeAdministered: string;
}

export interface RationIntelPayload {
  mealType: 'FAST_BREAKER' | 'NOON_RATION' | 'EVENING_FUEL' | 'LATE_NIGHT_SNACK';
  fastingWindowHours?: number;
  foodDescription: string;
  cleanlinessRating: 'WHOLE_FOODS' | 'BALANCED' | 'HYPER_PROCESSED_SPLURGE';
  digestiveEnergy: 'LIGHT_ENERGETIC' | 'SATISFIED' | 'HEAVY_SLUGGISH';
}

export interface MoodSpectrumPayload {
  moodScore: number; // 1 to 10
  stressLevel: 'LOW' | 'MODERATE' | 'ELEVATED' | 'PEAK_ANXIETY';
  primaryTrigger: 'WORK' | 'SOCIAL' | 'FATIGUE' | 'SOLITUDE' | 'WEATHER' | 'HEALTH' | string;
  stoicGratitude?: string;
  mindsetNotes: string;
}

export interface StillnessIntervalPayload {
  practiceType: 'BOX_BREATHING' | 'SILENT_ZAZEN' | 'GUIDED_AUDIO' | 'NATURE_WALK';
  durationMinutes: number;
  mentalChatterBefore: 'CHAOTIC' | 'ACTIVE' | 'CALM';
  mentalChatterAfter: 'STILL_VOID' | 'CENTERED' | 'RESTORED';
}

// ==========================================
// 3. PRODUCTIVITY PAYLOADS
// ==========================================

export interface DutyRosterPayload {
  taskDescription: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'STANDBY' | string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | string;
  assignedOfficer?: string;
  deadlineEst?: string;
}

export interface ChronoSprintPayload {
  taskObjective: string;
  durationMinutes: number;
  completedItems: string[];
  distractionPings: number;
  status: 'COMPLETED' | 'EXTENDED' | 'ABORTED';
}

export interface DailyFrogPayload {
  targetChallenge: string;
  resistanceLevel: number; // 1 to 5
  estimatedMinutes: number;
  actualMinutes: number;
  victoryOutcome: 'SLAYED_COMPLETELY' | 'PARTIALLY_CHIPPED' | 'RESCHEDULED';
  reliefScore: number; // 1 to 10
}

export interface QuadrantMatrixPayload {
  taskName: string;
  quadrant: 'Q1_FIRE' | 'Q2_STRATEGY' | 'Q3_NOISE' | 'Q4_WASTE';
  deadline?: string;
  executionStatus: 'PENDING' | 'ACTIVE' | 'ARCHIVED';
}

export interface BlockedQueuePayload {
  taskSubject: string;
  waitingOnPerson: string;
  blockerType: 'CODE_REVIEW' | 'EMAIL_REPLY' | 'PACKAGE_DELIVERY' | 'SIGN_OFF' | string;
  stalledSince: string;
  nextPingDate: string;
}

export interface InterstitialJotPayload {
  justFinished: string;
  nextAction: string;
  energyLevel: 'HIGH' | 'STEADY' | 'DEPLETED';
  transitionFriction: 'SMOOTH' | 'SLUGGISH';
}

export interface DawnDuskStandupPayload {
  cyclePhase: 'DAWN_INTENTIONS' | 'DUSK_DEBRIEF';
  // Dawn
  top3Objectives?: string[];
  potentialHazards?: string;
  // Dusk
  accomplishments?: string[];
  unresolvedRollover?: string[];
  dailyGrade?: 'MISSION_ACCOMPLISHED' | 'ACCEPTABLE' | 'LOST_TO_VOID';
}

export interface NeuralScratchpadPayload {
  rawNote: string;
  autoCategory: 'IDEA_SPARK' | 'ERRAND_TODO' | 'BOOKMARK_LINK' | 'RANDOM_QUESTION';
  isProcessed: boolean;
}

export interface FiveMinuteIgnitionPayload {
  stalledTask: string;
  didMomentumCatch: 'YES_KEPT_GOING' | 'NO_STOPPED_AFTER_5M';
  frictionSource: 'BOREDOM' | 'CONFUSION' | 'PERFECTIONISM' | 'FATIGUE';
}

export interface CadenceChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface DailyCadenceChecklistPayload {
  routineType: 'MORNING_IGNITION' | 'EVENING_SHUTDOWN' | 'WORKSPACE_RESET';
  items: CadenceChecklistItem[];
  completionRate: number; // e.g. 100%
}

export interface FreeformLogPayload {
  rawContent: string;
}

// ==========================================
// 4. SKY_LIFE PAYLOADS
// ==========================================

export interface CreditBurnPayload {
  amount: number;
  currency: string;
  category: 'GROCERIES' | 'DINING_OUT' | 'COMMUTE' | 'TECH_GEAR' | 'ENTERTAINMENT' | 'ESSENTIAL';
  isImpulseBuy: boolean;
  merchantName: string;
  regretIndex: 'MONEY_WELL_SPENT' | 'ACCEPTABLE' | 'AVOIDABLE_WASTE';
}

export interface ScreenTelemetryPayload {
  title: string;
  mediaType: 'CINEMA_FILM' | 'TV_SERIES' | 'ANIME' | 'DOCUMENTARY';
  rating: number; // 1 to 5 stars
  synopsisVerdict: string;
  watchPartyWith?: string;
}

export interface SonicChroniclePayload {
  trackOrAlbum: string;
  genreOrHost: string;
  vibeScore: 'BACKGROUND_FOCUS' | 'NOSTALGIA' | 'HIGH_ENERGY' | 'CHILL';
  favoriteTimestamp?: string;
}

export interface VirtualArenaPayload {
  gameTitle: string;
  platform: 'PC' | 'PS5' | 'XBOX' | 'NINTENDO_SWITCH' | 'MOBILE';
  sessionMinutes: number;
  sessionGoal: string;
  winLossOutcome: 'VICTORY' | 'DEFEAT' | 'PEACEFUL_EXPLORATION';
}

export interface CommsLinkPayload {
  contactName: string;
  interactionType: 'IN_PERSON_MEET' | 'VOICE_CALL' | 'COFFEE' | 'LETTER_MSG';
  conversationSummary: string;
  nextCatchupDate?: string;
}

export interface MicroTriumphsPayload {
  triumphText: string;
  category: 'DISCIPLINE' | 'KINDNESS' | 'HEALTH' | 'ORGANIZATION';
  dopamineLevel: 'SUBTLE' | 'PROUD' | 'CHAMPION';
}
