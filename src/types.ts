export type CategoryType = 'AI_EXPERIMENT' | 'CAFFEINE_LOG' | 'ACTIVITY_LOG' | 'FREEFORM_LOG' | 'DUTY_ROSTER';

export interface ProtocolLogEntry {
  id: string;
  timestamp: string;
  category: CategoryType;
  title: string;
  payload: any;
}

export interface AIExperimentPayload {
  modelStack: string;
  experimentNotes: string;
  epochs?: number;
  loss?: number;
  codeSnippet?: string;
  outcomeObservation?: string;
}

export interface CaffeineLogPayload {
  beanOrigin: string;
  brewMethod: string;
  liked: boolean;
  flavorProfile: string;
}

export interface ActivityLogPayload {
  walkCompleted: boolean;
  durationMinutes: number;
  postMoodState: 'Drained' | 'Centered' | 'Recharged' | 'Euphoric' | string;
  routeLocation?: string;
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
