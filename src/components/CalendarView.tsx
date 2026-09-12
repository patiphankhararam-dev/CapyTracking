import React, { useState } from 'react';
import { CyclePrediction, DayLog } from '../types';
import {
  THAI_DAYS,
  THAI_MONTHS_FULL,
  addDays,
  diffDays,
  formatThaiDateFriendly,
  formatThaiDateShort,
  formatToDateKey,
  getPhaseForDate,
  getTodayKey,
  parseDateKey,
} from '../utils/dateUtils';
import {
  ChevronLeft,
  ChevronRight,
  Droplet,
  Edit3,
  Calendar as CalendarIcon,
  Sparkles,
  Smile,
  Activity,
  Zap,
} from 'lucide-react';

interface CalendarViewProps {
  logs: Record<string, DayLog>;
  prediction: CyclePrediction;
  onOpenLogForDate: (date: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  logs,
  prediction,
  onOpenLogForDate,
}) => {
  const todayKey = getTodayKey();
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(() => new Date());
  const [selectedDateKey, setSelectedDateKey] = useState<string>(todayKey);

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth(); // 0 - 11

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  const handleJumpToday = () => {
    const t = new Date();
    setCurrentMonthDate(new Date(t.getFullYear(), t.getMonth(), 1));
    setSelectedDateKey(todayKey);
  };

  // Generate calendar days
  const firstDayOfMonth = new Date(year, month, 1);
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Days array
  const calendarCells: { dateKey: string; dayNum: number; isCurrentMonth: boolean }[] = [];

  // Previous month trailing days
  const prevMonthDaysCount = new Date(year, month, 0).getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const dayNum = prevMonthDaysCount - i;
    const d = new Date(year, month - 1, dayNum);
    calendarCells.push({
      dateKey: formatToDateKey(d),
      dayNum,
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month, d);
    calendarCells.push({
      dateKey: formatToDateKey(dateObj),
      dayNum: d,
      isCurrentMonth: true,
    });
  }

  // Next month trailing days to complete grid (multiples of 7)
  const remainingCells = (7 - (calendarCells.length % 7)) % 7;
  for (let d = 1; d <= remainingCells; d++) {
    const dateObj = new Date(year, month + 1, d);
    calendarCells.push({
      dateKey: formatToDateKey(dateObj),
      dayNum: d,
      isCurrentMonth: false,
    });
  }

  // Selected date's log details
  const selectedLog = logs[selectedDateKey];

  // Check if a date is in predicted period range
  const isPredictedPeriodDay = (key: string): boolean => {
    if (!prediction.hasData || !prediction.predictedNextPeriodDate) return false;
    const nextStart = parseDateKey(prediction.predictedNextPeriodDate);
    const target = parseDateKey(key);
    const diff = diffDays(target, nextStart);
    const duration = prediction.averagePeriodDuration || 5;
    return diff >= 0 && diff < duration;
  };

  // Check if a date is fertile/ovulation
  const isFertileDay = (key: string): boolean => {
    if (!prediction.hasData || !prediction.fertileWindowStart || !prediction.fertileWindowEnd) return false;
    return key >= prediction.fertileWindowStart && key <= prediction.fertileWindowEnd;
  };

  const isOvulationDay = (key: string): boolean => {
    if (!prediction.hasData || !prediction.ovulationDate) return false;
    return key === prediction.ovulationDate;
  };

  return (
    <div className="space-y-4 pb-24 px-4 pt-1">
      {/* 1. Month Navigation Header */}
      <div className="bg-[#FFFFFF] p-4 rounded-3xl border border-[#EEDDE0]/80 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-bold text-[#3F3540]">
              {THAI_MONTHS_FULL[month]} {year + 543}
            </h2>
            <span className="text-xs text-[#3F3540]/60">ประวัติและการคาดการณ์</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleJumpToday}
              className="px-2.5 py-1 text-xs font-semibold bg-[#FFF9F6] border border-[#EEDDE0] text-[#B85C72] rounded-xl hover:bg-[#EEDDE0]/50 transition-colors"
            >
              วันนี้
            </button>
            <button
              onClick={handlePrevMonth}
              className="p-1.5 text-[#3F3540]/70 hover:text-[#3F3540] hover:bg-[#FFF9F6] rounded-xl transition-colors"
              aria-label="เดือนก่อนหน้า"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 text-[#3F3540]/70 hover:text-[#3F3540] hover:bg-[#FFF9F6] rounded-xl transition-colors"
              aria-label="เดือนถัดไป"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 text-center mb-1">
          {THAI_DAYS.map((dayName, idx) => (
            <div
              key={dayName}
              className={`text-xs font-medium py-1 ${
                idx === 0 ? 'text-[#B85C72]' : 'text-[#3F3540]/60'
              }`}
            >
              {dayName}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarCells.map((cell) => {
            const log = logs[cell.dateKey];
            const hasPeriod = log?.isPeriodDay || (log?.flow && log.flow !== 'none');
            const isPredicted = isPredictedPeriodDay(cell.dateKey);
            const isOvulation = isOvulationDay(cell.dateKey);
            const isFertile = isFertileDay(cell.dateKey);
            const isToday = cell.dateKey === todayKey;
            const isSelected = cell.dateKey === selectedDateKey;
            const hasAnyLog = Boolean(log);

            return (
              <button
                key={cell.dateKey}
                onClick={() => setSelectedDateKey(cell.dateKey)}
                className={`relative aspect-square flex flex-col items-center justify-between p-1 rounded-2xl transition-all ${
                  !cell.isCurrentMonth ? 'opacity-35' : ''
                } ${
                  isSelected
                    ? 'ring-2 ring-[#B85C72] ring-offset-1 bg-[#FFF9F6]'
                    : 'hover:bg-[#FFF9F6]/80'
                }`}
              >
                {/* Day number */}
                <span
                  className={`text-xs font-semibold ${
                    isToday
                      ? 'w-5 h-5 flex items-center justify-center rounded-full bg-[#3F3540] text-white'
                      : hasPeriod
                      ? 'text-[#B85C72] font-bold'
                      : 'text-[#3F3540]'
                  }`}
                >
                  {cell.dayNum}
                </span>

                {/* Period / Prediction Indicator Badge */}
                <div className="flex items-center justify-center my-auto">
                  {hasPeriod ? (
                    <div
                      className="w-6 h-6 rounded-full bg-[#D98C9A] text-white flex items-center justify-center shadow-xs"
                      title="มีประจำเดือน"
                    >
                      <Droplet size={11} fill="white" />
                    </div>
                  ) : isPredicted ? (
                    <div
                      className="w-6 h-6 rounded-full border-2 border-dashed border-[#D98C9A] bg-[#FFF9F6] text-[#D98C9A] flex items-center justify-center"
                      title="คาดการณ์ว่าจะมีประจำเดือน"
                    >
                      <Droplet size={10} />
                    </div>
                  ) : isOvulation ? (
                    <div
                      className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center"
                      title="วันตกไข่"
                    >
                      <Sparkles size={11} />
                    </div>
                  ) : isFertile ? (
                    <div
                      className="w-1.5 h-1.5 rounded-full bg-amber-400"
                      title="ช่วงโอกาสตั้งครรภ์สูง"
                    />
                  ) : null}
                </div>

                {/* Log dot indicator */}
                <div className="h-1 flex items-center justify-center">
                  {hasAnyLog && !hasPeriod && (
                    <div className="w-1 h-1 rounded-full bg-[#B85C72]" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-3 border-t border-[#EEDDE0]/60 space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-3.5 text-[11px] text-[#3F3540]/80">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#D98C9A]" />
              <span>มีประจำเดือน</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full border-2 border-dashed border-[#D98C9A]" />
              <span>คาดการณ์</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-200" />
              <span>ช่วงตกไข่</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B85C72]" />
              <span>มีบันทึก</span>
            </div>
          </div>

          <div className="text-[10px] text-[#3F3540]/60 text-center flex items-center justify-center gap-2 pt-1 border-t border-[#EEDDE0]/30">
            <span>Cycle Phases:</span>
            <span className="text-[#D98C9A] font-semibold">Menstrual</span>
            <span>•</span>
            <span className="text-[#3B82F6] font-semibold">Follicular</span>
            <span>•</span>
            <span className="text-[#F59E0B] font-semibold">Ovulation</span>
            <span>•</span>
            <span className="text-[#9333EA] font-semibold">Luteal</span>
          </div>
        </div>
      </div>

      {/* 2. Selected Day Detail & Quick Edit (Daily Log) */}
      <div className="bg-[#FFFFFF] p-4 rounded-3xl border border-[#EEDDE0]/80 shadow-xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#FFF9F6]">
          <div>
            <div className="flex items-center gap-1.5">
              <CalendarIcon size={16} className="text-[#B85C72]" />
              <h3 className="text-sm font-bold text-[#3F3540]">
                {formatThaiDateFriendly(selectedDateKey)}
              </h3>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-[#3F3540]/60">
                {formatThaiDateShort(selectedDateKey)}
              </span>
              {(() => {
                const phaseInfo = getPhaseForDate(selectedDateKey, prediction, logs);
                if (!phaseInfo.phase) return null;
                return (
                  <span 
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                    style={{ backgroundColor: `${phaseInfo.color}18`, color: phaseInfo.color }}
                  >
                    {phaseInfo.label}
                  </span>
                );
              })()}
            </div>
          </div>

          <button
            id="edit-daily-log-btn"
            onClick={() => onOpenLogForDate(selectedDateKey)}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#FFF9F6] border border-[#EEDDE0] text-[#B85C72] text-xs font-semibold rounded-xl hover:bg-[#EEDDE0]/50 transition-colors"
          >
            <Edit3 size={14} />
            <span>{selectedLog ? 'แก้ไขข้อมูล' : 'บันทึกของวันนี้'}</span>
          </button>
        </div>

        {selectedLog ? (
          <div className="space-y-3 text-xs">
            {/* Flow & Period status */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FFF9F6] border border-[#EEDDE0]/50">
              <div className="flex items-center gap-2">
                <Droplet
                  size={16}
                  className={
                    selectedLog.isPeriodDay || selectedLog.flow !== 'none'
                      ? 'fill-[#D98C9A] text-[#D98C9A]'
                      : 'text-[#3F3540]/40'
                  }
                />
                <span className="font-semibold text-[#3F3540]">
                  {selectedLog.isPeriodDay || selectedLog.flow !== 'none'
                    ? 'มีประจำเดือน'
                    : 'ไม่มีประจำเดือน'}
                </span>
              </div>
              <span className="font-medium text-[#B85C72] bg-white px-2 py-0.5 rounded-lg border border-[#EEDDE0]">
                Flow:{' '}
                {selectedLog.flow === 'none'
                  ? 'ไม่มี'
                  : selectedLog.flow === 'light'
                  ? 'น้อย'
                  : selectedLog.flow === 'medium'
                  ? 'ปานกลาง'
                  : 'มาก'}
              </span>
            </div>

            {/* Pain & Energy metrics */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-[#FFF9F6] border border-[#EEDDE0]/50 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Activity size={15} className="text-[#B85C72]" />
                  <span className="text-[#3F3540]/75">ระดับความปวด</span>
                </div>
                <span className="font-bold text-[#3F3540]">
                  {selectedLog.pain} / 10
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#FFF9F6] border border-[#EEDDE0]/50 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Zap size={15} className="text-[#D98C9A]" />
                  <span className="text-[#3F3540]/75">ระดับพลังงาน</span>
                </div>
                <span className="font-bold text-[#3F3540]">
                  {selectedLog.energy} / 10
                </span>
              </div>
            </div>

            {/* Moods */}
            {selectedLog.moods && selectedLog.moods.length > 0 && (
              <div>
                <span className="text-[11px] font-semibold text-[#3F3540]/70 mb-1 block">
                  อารมณ์ที่บันทึกไว้:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedLog.moods.map((m) => (
                    <span
                      key={m}
                      className="px-2.5 py-1 rounded-lg bg-[#EEDDE0]/70 text-[#B85C72] font-medium text-[11px]"
                    >
                      {m === 'calm'
                        ? '😌 สบายใจ'
                        : m === 'happy'
                        ? '🥰 มีความสุข'
                        : m === 'energetic'
                        ? '✨ สดชื่น'
                        : m === 'tired'
                        ? '🥱 เหนื่อยล้า'
                        : m === 'sensitive'
                        ? '🥺 อ่อนไหว'
                        : m === 'crampy'
                        ? '😣 ปวดเกร็ง'
                        : m === 'irritable'
                        ? '😤 หงุดหงิด'
                        : m === 'anxious'
                        ? '💭 กังวล'
                        : m === 'sleepy'
                        ? '😴 ง่วงนอน'
                        : m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Note */}
            {selectedLog.notes && (
              <div className="p-2.5 bg-[#FFF9F6] rounded-xl text-xs text-[#3F3540]/80 italic">
                "{selectedLog.notes}"
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-5 text-xs text-[#3F3540]/60">
            <p>ยังไม่มีการบันทึกข้อมูลสำหรับวันนี้</p>
            <button
              onClick={() => onOpenLogForDate(selectedDateKey)}
              className="mt-2 text-[#B85C72] font-semibold hover:underline"
            >
              + แตะตรงนี้เพื่อเพิ่มบันทึก
            </button>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="text-center px-4 py-1">
        <p className="text-[11px] text-[#3F3540]/60 italic">
          ℹ️ การคาดการณ์รอบเดือนและช่วงตกไข่เป็นการประเมินโดยประมาณ ไม่ใช่การรับประกันทางการแพทย์
        </p>
      </div>
    </div>
  );
};
