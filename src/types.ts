export type FlowLevel = 'none' | 'light' | 'medium' | 'heavy';

export type MoodType = 
  | 'happy' 
  | 'calm' 
  | 'energetic' 
  | 'tired' 
  | 'sensitive' 
  | 'crampy' 
  | 'anxious' 
  | 'irritable' 
  | 'sleepy';

export interface DayLog {
  date: string; // YYYY-MM-DD
  isPeriodDay: boolean;
  flow: FlowLevel;
  pain: number; // 0 - 10
  energy: number; // 0 - 10
  moods: MoodType[];
  notes?: string;
  updatedAt: string;
}

export interface UserSettings {
  cycleLength: number; // Default ~28 days
  periodDuration: number; // Default ~5 days
  lastPeriodDate?: string; // YYYY-MM-DD
  hasCompletedOnboarding: boolean;
  userName?: string;
  // Notification settings (prepared structure)
  enablePeriodReminder?: boolean;
  notifyPeriodDaysBefore?: number; // e.g. 2 days before
  enableOvulationReminder?: boolean;
  reminderTime?: string; // e.g. "09:00"
}

export type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';

export interface CyclePrediction {
  hasData: boolean; // True only if user has recorded a lastPeriodDate or logged period day
  currentCycleDay: number | null;
  daysUntilNextPeriod: number | null;
  currentPhase: CyclePhase | null;
  phaseLabel: string;
  phaseDescription: string;
  lastPeriodStartDate: string | null;
  predictedNextPeriodDate: string | null;
  ovulationDate: string | null;
  fertileWindowStart: string | null;
  fertileWindowEnd: string | null;
  averageCycleLength: number | null;
  averagePeriodDuration: number | null;
  isCurrentlyPeriod: boolean;
  isCalculatedFromRealData: boolean; // True if calculated from logged periods
  hasEnoughCyclesForPattern: boolean; // True if >= 2 logged cycles
}

export interface DetailedCycleRecord {
  cycleNumber: number;
  startDate: string;
  endDate?: string;
  cycleLength?: number; // Days to next period start
  periodDuration: number; // Days with flow/period in this cycle
  avgPain: number;
  avgEnergy: number;
  dominantFlow: FlowLevel;
  dominantMood?: MoodType;
  loggedDaysCount: number;
}

export interface MyPatternData {
  avgCycleLength: number | null;
  avgPeriodDuration: number | null;
  highestPainPhase: CyclePhase | null;
  highestPainPhaseAvg: number;
  lowestEnergyPhase: CyclePhase | null;
  lowestEnergyPhaseAvg: number;
  dominantFlow: FlowLevel | null;
  dominantMood: MoodType | null;
  symptomDaysCount: number;
  hasEnoughData: boolean;
}

export type ActiveTab = 'home' | 'calendar' | 'insights' | 'settings';

