import { DayLog, UserSettings } from '../types';
import { addDays, formatToDateKey } from './dateUtils';

const STORAGE_KEYS = {
  LOGS: 'capy_period_logs_v1',
  SETTINGS: 'capy_period_settings_v1',
};

export const DEFAULT_SETTINGS: UserSettings = {
  cycleLength: 28,
  periodDuration: 5,
  hasCompletedOnboarding: false,
};

export function getStoredLogs(): Record<string, DayLog> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (!raw) {
      return {};
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load logs from localStorage', err);
    return {};
  }
}

export function saveStoredLogs(logs: Record<string, DayLog>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  } catch (err) {
    console.error('Failed to save logs to localStorage', err);
  }
}

export function getStoredSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      return DEFAULT_SETTINGS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load settings from localStorage', err);
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings to localStorage', err);
  }
}

export interface BackupExportData {
  version: number;
  appName: string;
  exportedAt: string;
  settings: UserSettings;
  logs: Record<string, DayLog>;
}

export function exportBackupJson(): string {
  const settings = getStoredSettings();
  const logs = getStoredLogs();
  const data: BackupExportData = {
    version: 1,
    appName: 'Capy Tracking',
    exportedAt: new Date().toISOString(),
    settings,
    logs,
  };
  return JSON.stringify(data, null, 2);
}

export function validateBackupJson(jsonString: string): {
  success: boolean;
  message: string;
  count?: number;
  validatedLogs?: Record<string, DayLog>;
  parsedSettings?: Partial<UserSettings>;
} {
  try {
    const parsed = JSON.parse(jsonString) as Partial<BackupExportData>;
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, message: 'ไฟล์ข้อมูลไม่ถูกต้องตามรูปแบบ JSON' };
    }
    if (!parsed.logs || typeof parsed.logs !== 'object' || Array.isArray(parsed.logs)) {
      return { success: false, message: 'ไม่พบข้อมูลบันทึกรอบเดือน (logs) ในไฟล์ หรือรูปแบบไม่ถูกต้อง' };
    }

    // Validate log entries to prevent corrupted data
    const validatedLogs: Record<string, DayLog> = {};
    let validCount = 0;

    for (const [key, log] of Object.entries(parsed.logs)) {
      if (!log || typeof log !== 'object') continue;
      const dateStr = (log as DayLog).date || key;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) continue;

      const flow = ['none', 'light', 'medium', 'heavy'].includes((log as DayLog).flow)
        ? (log as DayLog).flow
        : 'none';
      const pain = typeof (log as DayLog).pain === 'number' ? Math.max(0, Math.min(10, (log as DayLog).pain)) : 0;
      const energy = typeof (log as DayLog).energy === 'number' ? Math.max(0, Math.min(10, (log as DayLog).energy)) : 5;
      const isPeriodDay = Boolean((log as DayLog).isPeriodDay || (flow && flow !== 'none'));
      const moods = Array.isArray((log as DayLog).moods) ? (log as DayLog).moods : [];
      const notes = typeof (log as DayLog).notes === 'string' ? (log as DayLog).notes : undefined;

      validatedLogs[dateStr] = {
        date: dateStr,
        isPeriodDay,
        flow,
        pain,
        energy,
        moods,
        notes,
        updatedAt: (log as DayLog).updatedAt || new Date().toISOString(),
      };
      validCount++;
    }

    if (validCount === 0 && Object.keys(parsed.logs).length > 0) {
      return { success: false, message: 'ข้อมูลในไฟล์ไม่ตรงกับโครงสร้างของระบบ Capy Tracking' };
    }

    return {
      success: true,
      message: `ตรวจสอบไฟล์สำเร็จ พบข้อมูล ${validCount} รายการ`,
      count: validCount,
      validatedLogs,
      parsedSettings: parsed.settings,
    };
  } catch (err) {
    return {
      success: false,
      message: `ไม่สามารถอ่านไฟล์ได้: ${err instanceof Error ? err.message : 'รูปแบบไฟล์ไม่ถูกต้อง'}`,
    };
  }
}

export function applyImportedData(
  validatedLogs: Record<string, DayLog>,
  settingsToApply?: Partial<UserSettings>,
  mode: 'merge' | 'replace' = 'merge'
): { success: boolean; message: string; count: number } {
  try {
    const currentLogs = getStoredLogs();
    const finalLogs = mode === 'replace' ? validatedLogs : { ...currentLogs, ...validatedLogs };
    saveStoredLogs(finalLogs);

    if (settingsToApply && typeof settingsToApply === 'object') {
      const currentSettings = getStoredSettings();
      saveStoredSettings({
        ...currentSettings,
        cycleLength: typeof settingsToApply.cycleLength === 'number' ? settingsToApply.cycleLength : currentSettings.cycleLength,
        periodDuration: typeof settingsToApply.periodDuration === 'number' ? settingsToApply.periodDuration : currentSettings.periodDuration,
        lastPeriodDate: settingsToApply.lastPeriodDate || currentSettings.lastPeriodDate,
        hasCompletedOnboarding: true,
      });
    }

    const count = Object.keys(validatedLogs).length;
    return {
      success: true,
      message: mode === 'replace' 
        ? `เขียนทับข้อมูลด้วยไฟล์สำรองเรียบร้อย (${count} รายการ)` 
        : `ผสานข้อมูลจากไฟล์สำรองเรียบร้อย (${count} รายการ)`,
      count,
    };
  } catch (err) {
    return {
      success: false,
      message: `เกิดข้อผิดพลาดในการบันทึกข้อมูล: ${err instanceof Error ? err.message : 'ไม่ทราบสาเหตุ'}`,
      count: 0,
    };
  }
}

export function importBackupJson(jsonString: string): { success: boolean; message: string; count?: number } {
  const validation = validateBackupJson(jsonString);
  if (!validation.success || !validation.validatedLogs) {
    return { success: false, message: validation.message };
  }
  return applyImportedData(validation.validatedLogs, validation.parsedSettings, 'merge');
}

export function clearAllStoredData(): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify({}));
    const emptySettings: UserSettings = {
      cycleLength: 28,
      periodDuration: 5,
      hasCompletedOnboarding: false,
    };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(emptySettings));
  } catch (err) {
    console.error('Failed to clear storage', err);
  }
}
