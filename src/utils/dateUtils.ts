import { 
  CyclePhase, 
  CyclePrediction, 
  DayLog, 
  DetailedCycleRecord, 
  FlowLevel, 
  MoodType, 
  MyPatternData, 
  UserSettings 
} from '../types';

export const THAI_MONTHS = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
];

export const THAI_MONTHS_FULL = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

export const THAI_DAYS = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];

export function formatToDateKey(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function getTodayKey(): string {
  return formatToDateKey(new Date());
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function diffDays(dateA: Date, dateB: Date): number {
  const a = new Date(dateA.getFullYear(), dateA.getMonth(), dateA.getDate());
  const b = new Date(dateB.getFullYear(), dateB.getMonth(), dateB.getDate());
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((a.getTime() - b.getTime()) / msPerDay);
}

export function formatThaiDateShort(dateKey: string | null): string {
  if (!dateKey) return '-';
  const d = parseDateKey(dateKey);
  const day = d.getDate();
  const month = THAI_MONTHS[d.getMonth()];
  const year = d.getFullYear() + 543; // Thai BE year
  return `${day} ${month} ${year}`;
}

export function formatThaiDateFriendly(dateKey: string | null): string {
  if (!dateKey) return '-';
  const today = getTodayKey();
  if (dateKey === today) return 'วันนี้';
  
  const d = parseDateKey(dateKey);
  const t = parseDateKey(today);
  const diff = diffDays(d, t);
  if (diff === 1) return 'พรุ่งนี้';
  if (diff === -1) return 'เมื่อวานนี้';

  const day = d.getDate();
  const month = THAI_MONTHS_FULL[d.getMonth()];
  return `${day} ${month}`;
}

/**
 * Identify period start dates from logs.
 * A period start is defined as a day with isPeriodDay=true that is either:
 * - The very first period log
 * - Or preceded by 2+ non-period days
 */
export function extractPeriodCycles(logs: Record<string, DayLog>): { startDate: string; duration: number }[] {
  const periodKeys = Object.keys(logs)
    .filter(k => logs[k].isPeriodDay || (logs[k].flow && logs[k].flow !== 'none'))
    .sort();

  if (periodKeys.length === 0) return [];

  const cycles: { startDate: string; duration: number }[] = [];
  let currentStart = periodKeys[0];
  let currentCount = 1;
  let lastDate = parseDateKey(periodKeys[0]);

  for (let i = 1; i < periodKeys.length; i++) {
    const nextDate = parseDateKey(periodKeys[i]);
    const gap = diffDays(nextDate, lastDate);

    if (gap <= 2) {
      // Continuous period or 1-day break
      currentCount += gap;
      lastDate = nextDate;
    } else {
      // New cycle
      cycles.push({ startDate: currentStart, duration: Math.max(1, currentCount) });
      currentStart = periodKeys[i];
      currentCount = 1;
      lastDate = nextDate;
    }
  }

  cycles.push({ startDate: currentStart, duration: Math.max(1, currentCount) });
  return cycles;
}

/**
 * Compute predictions, average metrics and current phase
 */
export function calculateCyclePrediction(
  logs: Record<string, DayLog>,
  settings: UserSettings
): CyclePrediction {
  const today = new Date();
  const todayKey = formatToDateKey(today);
  const loggedCycles = extractPeriodCycles(logs);

  let lastPeriodStart: string | null = settings.lastPeriodDate || null;
  let isCalculatedFromRealData = false;
  let hasEnoughCyclesForPattern = false;
  let realAvgCycleLength: number | null = null;
  let realAvgDuration: number | null = null;

  if (loggedCycles.length > 0) {
    const latestLogged = loggedCycles[loggedCycles.length - 1];
    lastPeriodStart = latestLogged.startDate;
    isCalculatedFromRealData = true;

    // Actual duration
    if (loggedCycles.length >= 1 && loggedCycles[0].duration > 1) {
      const totalDuration = loggedCycles.reduce((sum, c) => sum + c.duration, 0);
      realAvgDuration = Math.round(totalDuration / loggedCycles.length);
    }

    // Actual cycle lengths between starts (needs at least 2 distinct cycles)
    if (loggedCycles.length > 1) {
      const cycleLengths: number[] = [];
      for (let i = 1; i < loggedCycles.length; i++) {
        const d1 = parseDateKey(loggedCycles[i - 1].startDate);
        const d2 = parseDateKey(loggedCycles[i].startDate);
        const length = diffDays(d2, d1);
        if (length >= 18 && length <= 50) {
          cycleLengths.push(length);
        }
      }
      if (cycleLengths.length > 0) {
        realAvgCycleLength = Math.round(
          cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length
        );
        hasEnoughCyclesForPattern = true;
      }
    }
  }

  // Strict Rule: Never show fake or guessed prediction if user has not recorded a period date yet
  if (!lastPeriodStart) {
    return {
      hasData: false,
      currentCycleDay: null,
      daysUntilNextPeriod: null,
      currentPhase: null,
      phaseLabel: 'ยังไม่มีข้อมูลรอบเดือน',
      phaseDescription: 'บอกวันแรกที่ประจำเดือนมาครั้งล่าสุดให้น้องคาปิ เพื่อเริ่มคำนวณรอบเดือนนะ 🐹💗',
      lastPeriodStartDate: null,
      predictedNextPeriodDate: null,
      ovulationDate: null,
      fertileWindowStart: null,
      fertileWindowEnd: null,
      averageCycleLength: null,
      averagePeriodDuration: null,
      isCurrentlyPeriod: false,
      isCalculatedFromRealData: false,
      hasEnoughCyclesForPattern: false,
    };
  }

  // User has recorded their last period date: calculate predictions from their real starting point
  const cycleLengthForCalc = realAvgCycleLength || settings.cycleLength || 28;
  const durationForCalc = realAvgDuration || settings.periodDuration || 5;

  const lastStartDate = parseDateKey(lastPeriodStart);
  const daysSinceStart = diffDays(today, lastStartDate);

  // Normal cycle day: 1-indexed
  const currentCycleDay =
    daysSinceStart >= 0 ? (daysSinceStart % cycleLengthForCalc) + 1 : 1;

  // Next period date prediction from user's starting point
  let nextDateObj = addDays(lastStartDate, cycleLengthForCalc);
  while (diffDays(nextDateObj, today) < 0) {
    nextDateObj = addDays(nextDateObj, cycleLengthForCalc);
  }
  const predictedNextPeriodDate = formatToDateKey(nextDateObj);
  const daysUntilNextPeriod = Math.max(0, diffDays(nextDateObj, today));

  // Ovulation estimate (~14 days before predicted next period)
  const ovulationDateObj = addDays(nextDateObj, -14);
  const ovulationDate = formatToDateKey(ovulationDateObj);
  const fertileWindowStart = formatToDateKey(addDays(ovulationDateObj, -4));
  const fertileWindowEnd = formatToDateKey(addDays(ovulationDateObj, 1));

  // Determine current phase
  let currentPhase: CyclePhase = 'follicular';
  let phaseLabel = 'ระยะฟอลลิคูลาร์ (Follicular)';
  let phaseDescription = 'พลังงานเริ่มกลับมา ผิวพรรณสดใส ร่างกายกำลังเตรียมพร้อม';

  // Check if today is logged as period
  const todayLog = logs[todayKey];
  const isPeriodDayToday = Boolean(
    todayLog?.isPeriodDay || (todayLog?.flow && todayLog.flow !== 'none')
  );

  const isCurrentlyPeriod =
    isPeriodDayToday || (daysSinceStart >= 0 && daysSinceStart < durationForCalc);

  if (isCurrentlyPeriod) {
    currentPhase = 'menstrual';
    phaseLabel = 'ช่วงมีประจำเดือน (Menstrual)';
    phaseDescription = 'พักผ่อนให้เพียงพอ ดื่มน้ำอุ่น และผ่อนคลายกับน้องคาปิบาร่า 🐹💗';
  } else if (
    todayKey >= (fertileWindowStart || '') &&
    todayKey <= (fertileWindowEnd || '')
  ) {
    currentPhase = 'ovulation';
    phaseLabel = 'ช่วงตกไข่ (Fertile & Ovulation)';
    phaseDescription = 'โอกาสตั้งครรภ์สูง ฮอร์โมนและอารมณ์มีความมั่นใจ';
  } else if (currentCycleDay > cycleLengthForCalc - 14) {
    currentPhase = 'luteal';
    phaseLabel = 'ระยะลูเทียล (Luteal Phase / PMS)';
    phaseDescription = 'อาจมีอาการก่อนมีประจำเดือน ให้เวลากับตัวเองและอย่าลืมดื่มน้ำ';
  }

  return {
    hasData: true,
    currentCycleDay,
    daysUntilNextPeriod,
    currentPhase,
    phaseLabel,
    phaseDescription,
    lastPeriodStartDate: lastPeriodStart,
    predictedNextPeriodDate,
    ovulationDate,
    fertileWindowStart,
    fertileWindowEnd,
    averageCycleLength: realAvgCycleLength,
    averagePeriodDuration: realAvgDuration,
    isCurrentlyPeriod,
    isCalculatedFromRealData,
    hasEnoughCyclesForPattern,
  };
}

/**
 * Determine the cycle phase for any specific date
 */
export function getPhaseForDate(
  dateKey: string,
  prediction: CyclePrediction,
  logs: Record<string, DayLog>
): { phase: CyclePhase | null; label: string; color: string } {
  const log = logs[dateKey];
  if (log?.isPeriodDay || (log?.flow && log.flow !== 'none')) {
    return { phase: 'menstrual', label: 'Menstrual (มีประจำเดือน)', color: '#D98C9A' };
  }

  if (!prediction.hasData || !prediction.lastPeriodStartDate) {
    return { phase: null, label: 'ยังไม่มีข้อมูล', color: 'transparent' };
  }

  if (prediction.fertileWindowStart && prediction.fertileWindowEnd) {
    if (dateKey >= prediction.fertileWindowStart && dateKey <= prediction.fertileWindowEnd) {
      if (dateKey === prediction.ovulationDate) {
        return { phase: 'ovulation', label: 'Ovulation (วันตกไข่)', color: '#F59E0B' };
      }
      return { phase: 'ovulation', label: 'Fertile Window (ช่วงตกไข่)', color: '#FBBF24' };
    }
  }

  const cycleLength = prediction.averageCycleLength || 28;
  const periodDuration = prediction.averagePeriodDuration || 5;

  const diff = diffDays(parseDateKey(dateKey), parseDateKey(prediction.lastPeriodStartDate));
  const cycleDay = (diff % cycleLength) + 1;
  if (cycleDay > 0 && cycleDay <= periodDuration) {
    return { phase: 'menstrual', label: 'Menstrual (ประจำเดือน)', color: '#D98C9A' };
  }
  if (cycleDay > cycleLength - 14) {
    return { phase: 'luteal', label: 'Luteal (ช่วงก่อนมีประจำเดือน/PMS)', color: '#9333EA' };
  }

  return { phase: 'follicular', label: 'Follicular (ระยะฟอลลิคูลาร์)', color: '#3B82F6' };
}

/**
 * Calculate per-cycle detailed historical statistics
 */
export function calculateDetailedCycles(
  logs: Record<string, DayLog>,
  settings: UserSettings
): DetailedCycleRecord[] {
  const loggedCycles = extractPeriodCycles(logs);
  if (loggedCycles.length === 0) return [];

  const results: DetailedCycleRecord[] = [];

  for (let i = 0; i < loggedCycles.length; i++) {
    const cycle = loggedCycles[i];
    const startDate = cycle.startDate;
    const nextCycle = loggedCycles[i + 1];
    const endDate = nextCycle ? nextCycle.startDate : undefined;
    const cycleLength = nextCycle
      ? diffDays(parseDateKey(nextCycle.startDate), parseDateKey(startDate))
      : undefined;

    // Filter logs that fall within this cycle
    const cycleLogKeys = Object.keys(logs).filter((key) => {
      if (key < startDate) return false;
      if (endDate && key >= endDate) return false;
      return true;
    });

    const cycleLogs = cycleLogKeys.map((k) => logs[k]);
    const loggedDaysCount = cycleLogs.length;

    // Average pain
    const painTotal = cycleLogs.reduce((sum, l) => sum + (l.pain || 0), 0);
    const avgPain = loggedDaysCount > 0 ? Number((painTotal / loggedDaysCount).toFixed(1)) : 0;

    // Average energy
    const energyTotal = cycleLogs.reduce((sum, l) => sum + (l.energy || 0), 0);
    const avgEnergy = loggedDaysCount > 0 ? Number((energyTotal / loggedDaysCount).toFixed(1)) : 0;

    // Dominant flow
    const flowCounts: Record<FlowLevel, number> = { none: 0, light: 0, medium: 0, heavy: 0 };
    cycleLogs.forEach((l) => {
      if (l.flow) flowCounts[l.flow] = (flowCounts[l.flow] || 0) + 1;
    });
    // Ignore 'none' when determining top flow during period
    const nonNoneFlows: FlowLevel[] = ['heavy', 'medium', 'light'];
    let dominantFlow: FlowLevel = 'none';
    let maxFlowCount = 0;
    for (const f of nonNoneFlows) {
      if (flowCounts[f] > maxFlowCount) {
        maxFlowCount = flowCounts[f];
        dominantFlow = f;
      }
    }

    // Dominant mood
    const moodCounts: Record<string, number> = {};
    cycleLogs.forEach((l) => {
      (l.moods || []).forEach((m) => {
        moodCounts[m] = (moodCounts[m] || 0) + 1;
      });
    });
    let dominantMood: MoodType | undefined = undefined;
    let maxMoodCount = 0;
    Object.entries(moodCounts).forEach(([m, count]) => {
      if (count > maxMoodCount) {
        maxMoodCount = count;
        dominantMood = m as MoodType;
      }
    });

    results.push({
      cycleNumber: i + 1,
      startDate,
      endDate,
      cycleLength,
      periodDuration: cycle.duration,
      avgPain,
      avgEnergy,
      dominantFlow,
      dominantMood,
      loggedDaysCount,
    });
  }

  // Reverse so newest cycle is on top
  return results.reverse();
}

/**
 * Analyze user's personal pattern (My Pattern) strictly from logged records
 */
export function analyzeMyPattern(
  logs: Record<string, DayLog>,
  prediction: CyclePrediction
): MyPatternData {
  const allLogs = Object.values(logs);
  const hasEnoughData = allLogs.length >= 3;

  if (!hasEnoughData) {
    return {
      avgCycleLength: prediction.averageCycleLength,
      avgPeriodDuration: prediction.averagePeriodDuration,
      highestPainPhase: null,
      highestPainPhaseAvg: 0,
      lowestEnergyPhase: null,
      lowestEnergyPhaseAvg: 0,
      dominantFlow: null,
      dominantMood: null,
      symptomDaysCount: 0,
      hasEnoughData: false,
    };
  }

  // Aggregate pain and energy by cycle phase
  const phasePainSums: Record<CyclePhase, { sum: number; count: number }> = {
    menstrual: { sum: 0, count: 0 },
    follicular: { sum: 0, count: 0 },
    ovulation: { sum: 0, count: 0 },
    luteal: { sum: 0, count: 0 },
  };

  const phaseEnergySums: Record<CyclePhase, { sum: number; count: number }> = {
    menstrual: { sum: 0, count: 0 },
    follicular: { sum: 0, count: 0 },
    ovulation: { sum: 0, count: 0 },
    luteal: { sum: 0, count: 0 },
  };

  const flowCounts: Record<FlowLevel, number> = { none: 0, light: 0, medium: 0, heavy: 0 };
  const moodCounts: Record<string, number> = {};
  let symptomDaysCount = 0;

  allLogs.forEach((l) => {
    const { phase } = getPhaseForDate(l.date, prediction, logs);

    // Pain
    if (phase && typeof l.pain === 'number') {
      phasePainSums[phase].sum += l.pain;
      phasePainSums[phase].count += 1;
    }

    // Energy
    if (phase && typeof l.energy === 'number') {
      phaseEnergySums[phase].sum += l.energy;
      phaseEnergySums[phase].count += 1;
    }

    // Flow
    if (l.flow && l.flow !== 'none') {
      flowCounts[l.flow] = (flowCounts[l.flow] || 0) + 1;
    }

    // Moods
    (l.moods || []).forEach((m) => {
      moodCounts[m] = (moodCounts[m] || 0) + 1;
    });

    // Check if day has symptoms
    if ((l.pain && l.pain > 0) || (l.moods && l.moods.length > 0) || (l.flow && l.flow !== 'none')) {
      symptomDaysCount++;
    }
  });

  // Find phase with highest average pain
  let highestPainPhase: CyclePhase | null = null;
  let highestPainPhaseAvg = -1;
  (Object.keys(phasePainSums) as CyclePhase[]).forEach((p) => {
    const item = phasePainSums[p];
    if (item.count > 0) {
      const avg = item.sum / item.count;
      if (avg > highestPainPhaseAvg) {
        highestPainPhaseAvg = avg;
        highestPainPhase = p;
      }
    }
  });

  // Find phase with lowest average energy
  let lowestEnergyPhase: CyclePhase | null = null;
  let lowestEnergyPhaseAvg = 999;
  (Object.keys(phaseEnergySums) as CyclePhase[]).forEach((p) => {
    const item = phaseEnergySums[p];
    if (item.count > 0) {
      const avg = item.sum / item.count;
      if (avg < lowestEnergyPhaseAvg) {
        lowestEnergyPhaseAvg = avg;
        lowestEnergyPhase = p;
      }
    }
  });

  // Find dominant flow (excluding 'none')
  let dominantFlow: FlowLevel | null = null;
  let maxFlowCount = 0;
  (['heavy', 'medium', 'light'] as FlowLevel[]).forEach((f) => {
    if (flowCounts[f] > maxFlowCount) {
      maxFlowCount = flowCounts[f];
      dominantFlow = f;
    }
  });

  // Find dominant mood
  let dominantMood: MoodType | null = null;
  let maxMoodCount = 0;
  Object.entries(moodCounts).forEach(([m, count]) => {
    if (count > maxMoodCount) {
      maxMoodCount = count;
      dominantMood = m as MoodType;
    }
  });

  return {
    avgCycleLength: prediction.averageCycleLength,
    avgPeriodDuration: prediction.averagePeriodDuration,
    highestPainPhase,
    highestPainPhaseAvg: highestPainPhaseAvg >= 0 ? Number(highestPainPhaseAvg.toFixed(1)) : 0,
    lowestEnergyPhase,
    lowestEnergyPhaseAvg: lowestEnergyPhaseAvg <= 10 ? Number(lowestEnergyPhaseAvg.toFixed(1)) : 0,
    dominantFlow,
    dominantMood,
    symptomDaysCount,
    hasEnoughData: true,
  };
}

