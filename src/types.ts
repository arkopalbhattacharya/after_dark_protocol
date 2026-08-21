export type CategoryType = 'AI_EXPERIMENT' | 'CAFFEINE_LOG' | 'ACTIVITY_LOG' | 'FREEFORM_LOG' | 'DUTY_ROSTER';

export type ThemeName = 'MIDNIGHT_V1.5' | 'MORNING_MIST_V1.0' | 'COMET_SUNSET_V1.0' | 'NEO_TWYLITE_V1.0';

export interface ProtocolLogEntry {
  id: string;
  timestamp: string;
  category: CategoryType;
  title: string;
  payload: any;
}

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
  isPaid?: boolean; // false = Free, true = Paid
  paymentType?: 'SUBSCRIPTION' | 'ONE_TIME';
  costDetails?: string;
  verdict?: 'KEEP' | 'CAN_IT';
  trialNotes?: string;
}

export interface CaffeineLogPayload {
  beanOrigin: string;
  brewMethod: string;
  liked: boolean;
  flavorProfile: string;
}

export type ActivitySubType = 'WALK_RUN' | 'STAIRS' | 'WEIGHT' | 'CORE';

export interface ActivityLogPayload {
  activitySubType?: ActivitySubType;
  // Shared / Common
  durationMinutes?: number;
  avgHeartRate?: number;
  activeKcals?: number;
  
  // Walk / Run specific
  walkCompleted?: boolean;
  routeLocation?: string;
  postMoodState?: 'Drained' | 'Centered' | 'Recharged' | 'Euphoric' | string;
  vo2Max?: number;
  
  // Stairs specific
  stairsClimbed?: number;
  
  // Weight specific (Body composition)
  bodyWeightKg?: number;
  muscleRatePercent?: number;
  bodyFatPercent?: number;
}

export interface FreeformLogPayload {
  rawContent: string;
}

export interface DutyRosterPayload {
  taskDescription: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'STANDBY' | string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | string;
  assignedOfficer?: string;
  deadlineEst?: string;
}
