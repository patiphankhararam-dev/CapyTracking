import React, { useState, useRef } from 'react';
import { UserSettings, DayLog } from '../types';
import { 
  Sliders, 
  Download, 
  Upload, 
  Trash2, 
  ShieldCheck, 
  Info, 
  CheckCircle, 
  AlertCircle,
  Sparkles,
  Calendar,
  RefreshCw,
  Bell,
  Clock,
  HelpCircle,
  FileText,
  X
} from 'lucide-react';
import { 
  exportBackupJson, 
  validateBackupJson, 
  applyImportedData, 
  clearAllStoredData 
} from '../utils/storage';
import { formatThaiDateShort, formatToDateKey } from '../utils/dateUtils';
import { CapyIcon } from './CapyIcon';

interface SettingsViewProps {
  settings: UserSettings;
  logs: Record<string, DayLog>;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onReloadData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  logs,
  onUpdateSettings,
  onReloadData,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  
  // Pending import data awaiting user decision
  const [pendingImport, setPendingImport] = useState<{
    fileName: string;
    count: number;
    validatedLogs: Record<string, DayLog>;
    parsedSettings?: Partial<UserSettings>;
  } | null>(null);

  // Cycle settings local state
  const [cycleLength, setCycleLength] = useState<number>(settings.cycleLength || 28);
  const [periodDuration, setPeriodDuration] = useState<number>(settings.periodDuration || 5);
  const [lastPeriodDate, setLastPeriodDate] = useState<string>(settings.lastPeriodDate || '');

  // Notification settings local state
  const [enablePeriodReminder, setEnablePeriodReminder] = useState<boolean>(
    settings.enablePeriodReminder ?? true
  );
  const [notifyPeriodDaysBefore, setNotifyPeriodDaysBefore] = useState<number>(
    settings.notifyPeriodDaysBefore ?? 2
  );
  const [enableOvulationReminder, setEnableOvulationReminder] = useState<boolean>(
    settings.enableOvulationReminder ?? false
  );
  const [reminderTime, setReminderTime] = useState<string>(
    settings.reminderTime ?? '09:00'
  );

  const handleSaveCycleSettings = () => {
    const updated: UserSettings = {
      ...settings,
      cycleLength,
      periodDuration,
      lastPeriodDate: lastPeriodDate || undefined,
      enablePeriodReminder,
      notifyPeriodDaysBefore,
      enableOvulationReminder,
      reminderTime,
    };
    onUpdateSettings(updated);
    showNotice('success', 'บันทึกการตั้งค่าเรียบร้อยแล้ว');
  };

  const showNotice = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 4000);
  };

  // Export JSON file
  const handleExportData = () => {
    try {
      const jsonStr = exportBackupJson();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const todayStr = formatToDateKey(new Date());
      link.href = url;
      link.download = `capy-tracking-backup-${todayStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showNotice('success', 'ส่งออกไฟล์สำรองข้อมูล (JSON) เรียบร้อย');
    } catch (err) {
      showNotice('error', 'ไม่สามารถส่งออกข้อมูลได้');
    }
  };

  // Trigger file input for Import
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle uploaded JSON file: validate first, then prompt user
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const res = validateBackupJson(text);
      if (res.success && res.validatedLogs) {
        setPendingImport({
          fileName: file.name,
          count: res.count || Object.keys(res.validatedLogs).length,
          validatedLogs: res.validatedLogs,
          parsedSettings: res.parsedSettings,
        });
      } else {
        showNotice('error', res.message);
      }
    };
    reader.onerror = () => {
      showNotice('error', 'อ่านไฟล์ไม่สำเร็จ');
    };
    reader.readAsText(file);
    // Reset file input value
    e.target.value = '';
  };

  // Confirm Import with chosen mode: 'merge' or 'replace'
  const handleConfirmImport = (mode: 'merge' | 'replace') => {
    if (!pendingImport) return;
    const result = applyImportedData(
      pendingImport.validatedLogs,
      pendingImport.parsedSettings,
      mode
    );
    if (result.success) {
      showNotice('success', result.message);
      setPendingImport(null);
      onReloadData();
    } else {
      showNotice('error', result.message);
    }
  };

  // Reset all data
  const handleConfirmReset = () => {
    clearAllStoredData();
    setShowConfirmReset(false);
    showNotice('success', 'ล้างข้อมูลทั้งหมดเรียบร้อยแล้ว');
    onReloadData();
  };

  const existingLogsCount = Object.keys(logs).length;

  return (
    <div className="space-y-4 pb-24 px-4 pt-1">
      {/* Toast Feedback Notification */}
      {feedback && (
        <div
          className={`p-3.5 rounded-2xl flex items-center gap-2.5 text-xs font-semibold shadow-md transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle size={18} className="text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle size={18} className="text-red-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* 1. Cycle Settings Section */}
      <div className="bg-[#FFFFFF] p-4 rounded-3xl border border-[#EEDDE0]/80 shadow-xs">
        <h2 className="text-sm font-bold text-[#3F3540] flex items-center gap-1.5 mb-3">
          <Sliders size={16} className="text-[#B85C72]" />
          ตั้งค่ารอบเดือนของคุณ
        </h2>

        <div className="space-y-4 text-xs">
          {/* Cycle Length Slider */}
          <div className="bg-[#FFF9F6] p-3 rounded-2xl border border-[#EEDDE0]/60">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-[#3F3540]">ความยาวรอบเดือนโดยประมาณ</span>
              <span className="font-bold text-[#B85C72] bg-white px-2.5 py-0.5 rounded-lg border border-[#EEDDE0]">
                {cycleLength} วัน
              </span>
            </div>
            <input
              type="range"
              min="21"
              max="45"
              step="1"
              value={cycleLength}
              onChange={(e) => setCycleLength(Number(e.target.value))}
              className="w-full h-2 bg-[#EEDDE0] rounded-lg cursor-pointer my-2"
            />
            <div className="flex justify-between text-[10px] text-[#3F3540]/60">
              <span>21 วัน</span>
              <span>28 วัน (ทั่วไป)</span>
              <span>45 วัน</span>
            </div>
          </div>

          {/* Period Duration Slider */}
          <div className="bg-[#FFF9F6] p-3 rounded-2xl border border-[#EEDDE0]/60">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-[#3F3540]">จำนวนวันที่มีประจำเดือน</span>
              <span className="font-bold text-[#B85C72] bg-white px-2.5 py-0.5 rounded-lg border border-[#EEDDE0]">
                {periodDuration} วัน
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="10"
              step="1"
              value={periodDuration}
              onChange={(e) => setPeriodDuration(Number(e.target.value))}
              className="w-full h-2 bg-[#EEDDE0] rounded-lg cursor-pointer my-2"
            />
            <div className="flex justify-between text-[10px] text-[#3F3540]/60">
              <span>2 วัน</span>
              <span>5 วัน (ทั่วไป)</span>
              <span>10 วัน</span>
            </div>
          </div>

          {/* Last Period Date Input */}
          <div className="bg-[#FFF9F6] p-3 rounded-2xl border border-[#EEDDE0]/60">
            <label className="font-semibold text-[#3F3540] block mb-1.5">
              วันที่มีประจำเดือนครั้งล่าสุด
            </label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={lastPeriodDate}
                onChange={(e) => setLastPeriodDate(e.target.value)}
                max={formatToDateKey(new Date())}
                className="w-full bg-white border border-[#EEDDE0] rounded-xl px-3 py-2 text-xs text-[#3F3540] font-medium outline-none focus:border-[#D98C9A]"
              />
            </div>
            <span className="text-[11px] text-[#3F3540]/60 mt-1 block">
              {lastPeriodDate ? `ตรงกับ: ${formatThaiDateShort(lastPeriodDate)}` : 'ยังไม่ได้ระบุ'}
            </span>
          </div>

          <button
            onClick={handleSaveCycleSettings}
            className="w-full py-2.5 bg-[#D98C9A] text-white font-semibold rounded-xl hover:bg-[#B85C72] transition-colors"
          >
            บันทึกการตั้งค่ารอบเดือน
          </button>
        </div>
      </div>

      {/* 2. Notification Settings (Prepared Structure) */}
      <div className="bg-[#FFFFFF] p-4 rounded-3xl border border-[#EEDDE0]/80 shadow-xs">
        <h2 className="text-sm font-bold text-[#3F3540] flex items-center gap-1.5 mb-1.5">
          <Bell size={16} className="text-[#B85C72]" />
          การแจ้งเตือนและการเตือนความจำ
        </h2>
        <p className="text-xs text-[#3F3540]/70 mb-3 leading-relaxed">
          ตั้งค่าการเตือนล่วงหน้าเพื่อเตรียมตัวรับมือก่อนรอบเดือนมาถึง
        </p>

        <div className="space-y-3 text-xs">
          {/* Period Reminder Toggle */}
          <div className="p-3 bg-[#FFF9F6] rounded-2xl border border-[#EEDDE0]/60 flex items-center justify-between">
            <div>
              <span className="font-semibold text-[#3F3540] block">
                แจ้งเตือนก่อนมีประจำเดือน
              </span>
              <span className="text-[10px] text-[#3F3540]/60">
                เตือนล่วงหน้าก่อนวันที่คาดการณ์
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enablePeriodReminder}
                onChange={(e) => {
                  setEnablePeriodReminder(e.target.checked);
                  onUpdateSettings({ ...settings, enablePeriodReminder: e.target.checked });
                }}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-[#EEDDE0] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D98C9A]" />
            </label>
          </div>

          {enablePeriodReminder && (
            <div className="p-3 bg-[#FFF9F6] rounded-2xl border border-[#EEDDE0]/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#3F3540]">เตือนล่วงหน้า</span>
                <div className="flex gap-1.5">
                  {[1, 2, 3].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => {
                        setNotifyPeriodDaysBefore(days);
                        onUpdateSettings({ ...settings, notifyPeriodDaysBefore: days });
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        notifyPeriodDaysBefore === days
                          ? 'bg-[#D98C9A] text-white shadow-xs'
                          : 'bg-white text-[#3F3540] border border-[#EEDDE0]'
                      }`}
                    >
                      {days} วัน
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-[#EEDDE0]/40">
                <span className="font-semibold text-[#3F3540]">เวลาที่แจ้งเตือน</span>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => {
                    setReminderTime(e.target.value);
                    onUpdateSettings({ ...settings, reminderTime: e.target.value });
                  }}
                  className="bg-white border border-[#EEDDE0] rounded-lg px-2 py-1 text-xs text-[#3F3540] outline-none"
                />
              </div>
            </div>
          )}

          {/* Ovulation Reminder Toggle */}
          <div className="p-3 bg-[#FFF9F6] rounded-2xl border border-[#EEDDE0]/60 flex items-center justify-between">
            <div>
              <span className="font-semibold text-[#3F3540] block">
                แจ้งเตือนช่วงตกไข่ (Fertile Window)
              </span>
              <span className="text-[10px] text-[#3F3540]/60">
                เตือนเมื่อเข้าสู่ช่วงมีโอกาสตั้งครรภ์
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enableOvulationReminder}
                onChange={(e) => {
                  setEnableOvulationReminder(e.target.checked);
                  onUpdateSettings({ ...settings, enableOvulationReminder: e.target.checked });
                }}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-[#EEDDE0] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D98C9A]" />
            </label>
          </div>
        </div>
      </div>

      {/* 3. Data Export & Import (Backup & Transfer) */}
      <div className="bg-[#FFFFFF] p-4 rounded-3xl border border-[#EEDDE0]/80 shadow-xs">
        <h2 className="text-sm font-bold text-[#3F3540] flex items-center gap-1.5 mb-1.5">
          <Download size={16} className="text-[#B85C72]" />
          สำรองและย้ายข้อมูล (Export / Import)
        </h2>
        <p className="text-xs text-[#3F3540]/70 mb-3 leading-relaxed">
          เนื่องจากข้อมูลถูกเก็บในเครื่องนี้ คุณสามารถดาวน์โหลดไฟล์สำรองเก็บไว้ หรือนำไปเปิดบนมือถือ/เครื่องอื่นได้ทุกเมื่อ
        </p>

        {/* Hidden file input for import */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json,application/json"
          className="hidden"
        />

        <div className="grid grid-cols-2 gap-2.5">
          <button
            id="export-json-btn"
            onClick={handleExportData}
            className="p-3 bg-[#FFF9F6] border border-[#EEDDE0] rounded-2xl flex flex-col items-center text-center gap-1.5 hover:bg-[#EEDDE0]/40 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-[#EEDDE0] text-[#B85C72] flex items-center justify-center">
              <Download size={18} />
            </div>
            <span className="text-xs font-bold text-[#3F3540]">ส่งออกข้อมูล (Export)</span>
            <span className="text-[10px] text-[#3F3540]/60">ดาวน์โหลดเป็นไฟล์ JSON</span>
          </button>

          <button
            id="import-json-btn"
            onClick={handleImportClick}
            className="p-3 bg-[#FFF9F6] border border-[#EEDDE0] rounded-2xl flex flex-col items-center text-center gap-1.5 hover:bg-[#EEDDE0]/40 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-[#EEDDE0] text-[#B85C72] flex items-center justify-center">
              <Upload size={18} />
            </div>
            <span className="text-xs font-bold text-[#3F3540]">นำเข้าข้อมูล (Import)</span>
            <span className="text-[10px] text-[#3F3540]/60">เลือกไฟล์ JSON สำรอง</span>
          </button>
        </div>
      </div>

      {/* 3. Privacy Guarantee Banner (Item 21) */}
      <div className="bg-emerald-50/70 p-4 rounded-3xl border border-emerald-200 flex items-start gap-3">
        <ShieldCheck size={26} className="text-emerald-600 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <span className="font-bold text-emerald-950 block text-sm">
            นโยบายความเป็นส่วนตัว (100% Client-side Privacy)
          </span>
          <p className="text-emerald-900 font-medium leading-relaxed bg-white/70 p-2.5 rounded-xl border border-emerald-200/60 mt-1">
            “ข้อมูลของคุณถูกเก็บไว้ในอุปกรณ์นี้ และ Capy Tracking ไม่จำเป็นต้องส่งข้อมูลไปยังเซิร์ฟเวอร์เพื่อใช้งาน”
          </p>
          <p className="text-emerald-850/80 text-[11px] leading-relaxed pt-0.5">
            ไม่มีระบบบัญชี ไม่เก็บอีเมล ข้อมูลรอบเดือน อาการปวด อารมณ์ และบันทึกต่าง ๆ จะไม่มีวันถูกส่งออกไปยัง API ภายนอกอย่างแน่นอน
          </p>
        </div>
      </div>

      {/* 4. About Capy Tracking Section (Item 19) */}
      <div className="bg-[#FFFFFF] p-4 rounded-3xl border border-[#EEDDE0]/80 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-[#3F3540] flex items-center gap-1.5">
          <Info size={16} className="text-[#B85C72]" />
          เกี่ยวกับ Capy Tracking 🐹💗
        </h2>
        
        <div className="flex items-center gap-3 p-3 bg-[#FFF9F6] rounded-2xl border border-[#EEDDE0]/60">
          <div className="w-14 h-14 rounded-2xl bg-white border border-[#EEDDE0] flex items-center justify-center shrink-0 shadow-xs">
            <CapyIcon size={42} variant="sparkle" />
          </div>
          <div className="text-xs">
            <h3 className="font-bold text-[#3F3540] text-sm">Capy Tracking (Mobile-first)</h3>
            <p className="text-[11px] text-[#3F3540]/70 mt-0.5 leading-relaxed">
              เว็บแอปติดตามรอบเดือนที่นุ่มนวลและอ่อนโยน ออกแบบให้เป็นเพื่อนดูแลสุขภาพโดยไม่ต้องสมัครสมาชิก ทำงานแบบ Offline-first ผ่าน Local Storage ในเครื่องของคุณ
            </p>
          </div>
        </div>

        <div className="text-xs text-[#3F3540]/80 space-y-1.5 pl-1">
          <div className="flex items-center gap-2">
            <span className="text-[#B85C72] font-bold">✓</span>
            <span>ทำงานได้สมบูรณ์แบบโดยไม่ต้องต่ออินเทอร์เน็ตตลอดเวลา</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#B85C72] font-bold">✓</span>
            <span>พร้อมส่งออกและติดตั้ง (Deploy) บน Vercel, Netlify หรือโฮสติ้งใดๆ</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#B85C72] font-bold">✓</span>
            <span>ไม่มี Fake Data ทุกตัวเลขและการประมาณมาจากสิ่งที่คุณบันทึกจริง</span>
          </div>
        </div>
      </div>

      {/* 5. Reset Data Section */}
      <div className="bg-[#FFFFFF] p-4 rounded-3xl border border-[#EEDDE0]/80 shadow-xs">
        <h2 className="text-sm font-bold text-red-600 flex items-center gap-1.5 mb-1.5">
          <Trash2 size={16} />
          ล้างข้อมูลทั้งหมด (Delete All Data)
        </h2>
        <p className="text-xs text-[#3F3540]/70 mb-3">
          ลบข้อมูลรอบเดือนและบันทึกทั้งหมดออกจากอุปกรณ์นี้
        </p>

        {showConfirmReset ? (
          <div className="p-3.5 bg-red-50 rounded-2xl border border-red-200 text-xs">
            <p className="text-red-700 font-bold mb-1">
              ⚠️ คุณแน่ใจหรือไม่ที่จะลบข้อมูลทั้งหมด?
            </p>
            <p className="text-red-600/80 mb-3 leading-relaxed">
              ข้อมูลประวัติรอบเดือน {existingLogsCount} รายการจะถูกลบออกจากเครื่องนี้อย่างถาวรและไม่สามารถกู้คืนได้ (หากต้องการเก็บไว้ กรุณา Export JSON ก่อน)
            </p>
            <div className="flex gap-2">
              <button
                id="confirm-delete-all-btn"
                onClick={handleConfirmReset}
                className="flex-1 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-xs"
              >
                ยืนยันการลบ
              </button>
              <button
                onClick={() => setShowConfirmReset(false)}
                className="flex-1 py-2.5 bg-white text-[#3F3540] border border-gray-300 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        ) : (
          <button
            id="trigger-delete-all-btn"
            onClick={() => setShowConfirmReset(true)}
            className="w-full py-2.5 px-3 bg-red-50 text-red-600 font-semibold text-xs rounded-xl border border-red-200 hover:bg-red-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Trash2 size={15} />
            ล้างข้อมูลในอุปกรณ์นี้
          </button>
        )}
      </div>

      {/* App Info Footer */}
      <div className="text-center pt-2 pb-6 text-xs text-[#3F3540]/50 space-y-1">
        <div className="flex items-center justify-center gap-1.5 font-medium text-[#3F3540]/70">
          <CapyIcon size={20} variant="cozy" />
          <span>Capy Tracking v1.0.0 • Mobile-first</span>
        </div>
        <p>สร้างด้วยความใส่ใจ • ปลอดภัยไร้กังวล 🍊💗</p>
      </div>

      {/* Import Confirmation Dialog Modal (Item 20: ห้ามเขียนทับข้อมูลเดิมโดยไม่แจ้งผู้ใช้) */}
      {pendingImport && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl border border-[#EEDDE0] shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-[#EEDDE0]/60">
              <div className="flex items-center gap-2">
                <Upload size={18} className="text-[#B85C72]" />
                <h3 className="text-sm font-bold text-[#3F3540]">ยืนยันการนำเข้าข้อมูล</h3>
              </div>
              <button
                onClick={() => setPendingImport(null)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-[#FFF9F6] rounded-2xl border border-[#EEDDE0]/60 space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#3F3540]/70">ชื่อไฟล์:</span>
                  <span className="font-semibold text-[#3F3540] truncate max-w-[180px]">{pendingImport.fileName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#3F3540]/70">ข้อมูลในไฟล์:</span>
                  <span className="font-bold text-[#B85C72]">{pendingImport.count} รายการ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#3F3540]/70">ข้อมูลปัจจุบันในเครื่อง:</span>
                  <span className="font-semibold text-[#3F3540]">{existingLogsCount} รายการ</span>
                </div>
              </div>

              <p className="text-[#3F3540]/80 leading-relaxed pt-1">
                คุณต้องการนำเข้าข้อมูลด้วยวิธีใด?
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <button
                id="import-merge-btn"
                onClick={() => handleConfirmImport('merge')}
                className="w-full py-3 px-4 bg-[#D98C9A] hover:bg-[#B85C72] text-white font-bold rounded-2xl shadow-xs text-xs flex flex-col items-center transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles size={14} />
                  ผสานข้อมูล (Merge) — แนะนำ
                </span>
                <span className="text-[10px] font-normal opacity-90">รวมข้อมูลจากไฟล์เข้ากับข้อมูลเดิมที่มีอยู่</span>
              </button>

              <button
                id="import-replace-btn"
                onClick={() => handleConfirmImport('replace')}
                className="w-full py-2.5 px-4 bg-white border border-red-200 text-red-600 hover:bg-red-50 font-semibold rounded-2xl text-xs flex flex-col items-center transition-colors cursor-pointer"
              >
                <span>เขียนทับทั้งหมด (Replace)</span>
                <span className="text-[10px] text-red-500 font-normal">ลบข้อมูลเดิมและแทนที่ด้วยไฟล์นี้</span>
              </button>

              <button
                id="import-cancel-btn"
                onClick={() => setPendingImport(null)}
                className="w-full py-2 text-[#3F3540]/70 hover:text-[#3F3540] text-xs font-semibold"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
