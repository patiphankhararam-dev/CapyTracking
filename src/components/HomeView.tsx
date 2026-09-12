import React from 'react';
import { CyclePrediction, DayLog } from '../types';
import { formatThaiDateFriendly, formatThaiDateShort, getTodayKey } from '../utils/dateUtils';
import { CapyIcon } from './CapyIcon';
import { CapyDailyTipCard } from './CapyDailyTipCard';
import { 
  Calendar, 
  Clock, 
  Droplet, 
  Heart, 
  Sparkles, 
  PlusCircle, 
  Activity, 
  Smile, 
  CheckCircle2,
  ChevronRight,
  HelpCircle
} from 'lucide-react';

interface HomeViewProps {
  prediction: CyclePrediction;
  todayLog?: DayLog;
  allLogs?: Record<string, DayLog>;
  onOpenQuickLog: (date?: string) => void;
  onNavigateToCalendar: () => void;
  onRecordFirstPeriod?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  prediction,
  todayLog,
  allLogs,
  onOpenQuickLog,
  onNavigateToCalendar,
  onRecordFirstPeriod,
}) => {
  const todayKey = getTodayKey();

  // Progress in current cycle (0 - 100%) - only calculated if prediction has data
  const cycleLengthVal = prediction.averageCycleLength || 28;
  const currentDayVal = prediction.currentCycleDay || 1;
  const cycleProgress = prediction.hasData
    ? Math.min(100, Math.round((currentDayVal / cycleLengthVal) * 100))
    : 0;

  return (
    <div className="space-y-4 pb-24 px-4 pt-1">
      {/* 1. Hero Cycle Status Card */}
      <div className="bg-gradient-to-b from-[#FFFFFF] to-[#FFF9F6] p-5 rounded-3xl border border-[#EEDDE0]/80 shadow-sm relative overflow-hidden">
        {/* Soft decorative background glow */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#EEDDE0]/40 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />

        {prediction.hasData ? (
          /* REAL USER DATA DASHBOARD HERO */
          <div className="flex flex-col items-center text-center">
            {/* Circular Visual Indicator */}
            <div className="relative w-44 h-44 flex items-center justify-center my-2">
              {/* SVG Ring Progress */}
              <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                {/* Background track */}
                <circle
                  cx="80"
                  cy="80"
                  r="68"
                  stroke="#EEDDE0"
                  strokeWidth="10"
                  fill="none"
                />
                {/* Active stroke */}
                <circle
                  cx="80"
                  cy="80"
                  r="68"
                  stroke={prediction.isCurrentlyPeriod ? '#B85C72' : '#D98C9A'}
                  strokeWidth="10"
                  strokeDasharray={427}
                  strokeDashoffset={427 - (427 * cycleProgress) / 100}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-700 ease-out"
                />
              </svg>

              {/* Inner Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                <span className="text-xs font-semibold text-[#B85C72] bg-[#EEDDE0]/60 px-2.5 py-0.5 rounded-full mb-1">
                  {prediction.isCurrentlyPeriod
                    ? 'ช่วงมีประจำเดือน'
                    : `รอบวันที่ ${prediction.currentCycleDay}`}
                </span>
                
                <div className="flex items-baseline gap-1 my-0.5">
                  <span className="text-3xl font-extrabold text-[#3F3540] tracking-tight">
                    {prediction.isCurrentlyPeriod ? 'Day' : 'อีก'}
                  </span>
                  <span className="text-4xl font-extrabold text-[#B85C72]">
                    {prediction.isCurrentlyPeriod
                      ? prediction.currentCycleDay
                      : prediction.daysUntilNextPeriod}
                  </span>
                  <span className="text-sm font-semibold text-[#3F3540]/80">
                    {prediction.isCurrentlyPeriod ? '' : 'วัน'}
                  </span>
                </div>

                <span className="text-[11px] text-[#3F3540]/75 leading-tight">
                  {prediction.isCurrentlyPeriod
                    ? 'พักผ่อนดูแลตัวเองนะ 🌸'
                    : 'คาดการณ์รอบเดือนถัดไป'}
                </span>
              </div>
            </div>

            {/* Phase Badge & Description */}
            <div className="mt-1 px-4 py-2.5 rounded-2xl bg-[#FFF9F6] border border-[#EEDDE0]/80 max-w-sm w-full">
              <h3 className="text-sm font-bold text-[#B85C72] flex items-center justify-center gap-1.5">
                <Sparkles size={14} className="text-[#D98C9A]" />
                {prediction.phaseLabel}
              </h3>
              <p className="text-xs text-[#3F3540]/80 mt-0.5 leading-relaxed">
                {prediction.phaseDescription}
              </p>

              {/* 4 Phases Visual Step Indicator */}
              <div className="grid grid-cols-4 gap-1.5 mt-3 pt-2.5 border-t border-[#EEDDE0]/50 text-[10px]">
                <div
                  className={`py-1 px-1 rounded-lg text-center font-medium transition-all ${
                    prediction.currentPhase === 'menstrual'
                      ? 'bg-[#D98C9A] text-white font-bold shadow-xs'
                      : 'bg-white/80 text-[#3F3540]/70'
                  }`}
                >
                  Menstrual
                </div>
                <div
                  className={`py-1 px-1 rounded-lg text-center font-medium transition-all ${
                    prediction.currentPhase === 'follicular'
                      ? 'bg-[#3B82F6] text-white font-bold shadow-xs'
                      : 'bg-white/80 text-[#3F3540]/70'
                  }`}
                >
                  Follicular
                </div>
                <div
                  className={`py-1 px-1 rounded-lg text-center font-medium transition-all ${
                    prediction.currentPhase === 'ovulation'
                      ? 'bg-[#F59E0B] text-white font-bold shadow-xs'
                      : 'bg-white/80 text-[#3F3540]/70'
                  }`}
                >
                  Ovulation
                </div>
                <div
                  className={`py-1 px-1 rounded-lg text-center font-medium transition-all ${
                    prediction.currentPhase === 'luteal'
                      ? 'bg-[#9333EA] text-white font-bold shadow-xs'
                      : 'bg-white/80 text-[#3F3540]/70'
                  }`}
                >
                  Luteal
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* EMPTY STATE HERO (NO USER DATA YET) */
          <div className="py-6 px-3 text-center flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#FFF0F3] to-[#FFFFFF] border-2 border-[#EEDDE0] shadow-xs flex items-center justify-center p-2 mb-3">
              <CapyIcon size={72} variant="sparkle" />
            </div>

            <h3 className="text-xl font-extrabold text-[#3F3540] tracking-tight">
              ยังไม่มีข้อมูลรอบเดือน 🌸
            </h3>
            <p className="text-xs text-[#3F3540]/75 mt-1.5 leading-relaxed max-w-xs">
              บอกวันแรกที่ประจำเดือนมาครั้งล่าสุดให้น้องคาปิรู้ เพื่อเริ่มคำนวณและคาดการณ์รอบเดือนนะ 🐹💗
            </p>

            {onRecordFirstPeriod && (
              <button
                id="empty-hero-record-first-btn"
                onClick={onRecordFirstPeriod}
                className="mt-4 py-2.5 px-5 bg-gradient-to-r from-[#D98C9A] to-[#B85C72] text-white text-xs font-bold rounded-2xl shadow-sm hover:opacity-95 transition-all flex items-center gap-1.5"
              >
                <span>🩷 บันทึกวันแรกของประจำเดือน</span>
              </button>
            )}
          </div>
        )}

        {/* Big Quick Log Button on Home */}
        <div className="mt-4 pt-1">
          <button
            id="home-quick-log-btn"
            onClick={() => onOpenQuickLog(todayKey)}
            className="w-full py-3.5 px-5 bg-gradient-to-r from-[#D98C9A] to-[#B85C72] text-white font-bold rounded-2xl shadow-md shadow-[#D98C9A]/30 hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2.5 text-base cursor-pointer"
          >
            {todayLog ? (
              <>
                <CheckCircle2 size={20} strokeWidth={2.5} />
                <span>แก้ไขบันทึกอาการวันนี้</span>
              </>
            ) : (
              <>
                <PlusCircle size={20} strokeWidth={2.5} />
                <span>บันทึกวันนี้ 🐹</span>
              </>
            )}
          </button>
        </div>

        {/* Transparent calculation status note */}
        <div className="mt-2.5 text-center">
          <p className="text-[11px] text-[#3F3540]/60 italic flex items-center justify-center gap-1">
            <span>ℹ️</span>
            <span>การคาดการณ์รอบเดือนเป็นการประเมินโดยประมาณ ไม่ใช่การรับประกัน</span>
          </p>
          <span className="text-[10px] text-[#B85C72]/80 mt-0.5 block">
            {prediction.isCalculatedFromRealData
              ? '✓ คำนวณจากประวัติรอบเดือนที่คุณบันทึกจริง'
              : prediction.hasData
              ? '• เริ่มต้นจากการบันทึกวันแรกของคุณ (บันทึกเพิ่มเพื่อให้ระบบจำ Pattern)'
              : '• ยังไม่มีข้อมูลบันทึกในอุปกรณ์นี้'}
          </span>
        </div>
      </div>

      {/* 2. Four Key Period Stats Cards */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-1">
          <h2 className="text-sm font-bold text-[#3F3540] flex items-center gap-1.5">
            <Activity size={16} className="text-[#B85C72]" />
            ข้อมูลสำคัญของรอบเดือน
          </h2>
          <button
            onClick={onNavigateToCalendar}
            className="text-xs font-semibold text-[#B85C72] hover:underline flex items-center"
          >
            ดูปฏิทิน <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Card 1: Last Period Date */}
          <div className="bg-[#FFFFFF] p-3.5 rounded-2xl border border-[#EEDDE0]/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#B85C72] mb-1.5">
              <span className="text-xs font-medium text-[#3F3540]/75">ประจำเดือนล่าสุด</span>
              <Droplet size={16} className="fill-[#D98C9A] text-[#D98C9A]" />
            </div>
            <div>
              {prediction.lastPeriodStartDate ? (
                <>
                  <div className="text-base font-bold text-[#3F3540]">
                    {formatThaiDateFriendly(prediction.lastPeriodStartDate)}
                  </div>
                  <div className="text-[11px] text-[#3F3540]/60 mt-0.5">
                    {formatThaiDateShort(prediction.lastPeriodStartDate)}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-sm font-bold text-[#3F3540]/70">
                    ยังไม่มีข้อมูล
                  </div>
                  <div className="text-[10px] text-[#3F3540]/50 mt-0.5">
                    บันทึกวันแรกเพื่อเริ่มติดตาม
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Card 2: Predicted Next Period Date */}
          <div className="bg-[#FFFFFF] p-3.5 rounded-2xl border border-[#EEDDE0]/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#B85C72] mb-1.5">
              <span className="text-xs font-medium text-[#3F3540]/75">รอบถัดไป (คาดการณ์)</span>
              <Calendar size={16} className="text-[#D98C9A]" />
            </div>
            <div>
              {prediction.predictedNextPeriodDate ? (
                <>
                  <div className="text-base font-bold text-[#B85C72]">
                    {formatThaiDateFriendly(prediction.predictedNextPeriodDate)}
                  </div>
                  <div className="text-[11px] text-[#3F3540]/60 mt-0.5">
                    {formatThaiDateShort(prediction.predictedNextPeriodDate)}
                  </div>
                </>
              ) : (
                <div className="text-xs text-[#3F3540]/60 leading-tight">
                  ยังมีข้อมูลไม่พอสำหรับคำนวณส่วนนี้
                </div>
              )}
            </div>
          </div>

          {/* Card 3: Average Cycle Length */}
          <div className="bg-[#FFFFFF] p-3.5 rounded-2xl border border-[#EEDDE0]/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#B85C72] mb-1.5">
              <span className="text-xs font-medium text-[#3F3540]/75">ความยาวรอบเดือน</span>
              <Clock size={16} className="text-[#D98C9A]" />
            </div>
            <div>
              {prediction.hasEnoughCyclesForPattern && prediction.averageCycleLength ? (
                <>
                  <div className="text-lg font-bold text-[#3F3540]">
                    {prediction.averageCycleLength}{' '}
                    <span className="text-xs font-normal text-[#3F3540]/75">วัน</span>
                  </div>
                  <div className="text-[11px] text-[#3F3540]/60 mt-0.5">
                    คำนวณจากประวัติจริง
                  </div>
                </>
              ) : (
                <div className="text-[11px] text-[#B85C72] font-medium leading-relaxed bg-[#FFF9F6] p-2 rounded-xl border border-[#EEDDE0]/50">
                  “คาปิขอเก็บข้อมูลอีกนิด แล้วจะช่วยดู Pattern ให้ได้มากขึ้นนะ 🐹✨”
                </div>
              )}
            </div>
          </div>

          {/* Card 4: Period Duration */}
          <div className="bg-[#FFFFFF] p-3.5 rounded-2xl border border-[#EEDDE0]/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#B85C72] mb-1.5">
              <span className="text-xs font-medium text-[#3F3540]/75">ระยะเวลาเป็นประจำเดือน</span>
              <Heart size={16} className="fill-[#EEDDE0] text-[#D98C9A]" />
            </div>
            <div>
              {prediction.averagePeriodDuration ? (
                <>
                  <div className="text-lg font-bold text-[#3F3540]">
                    {prediction.averagePeriodDuration}{' '}
                    <span className="text-xs font-normal text-[#3F3540]/75">วัน</span>
                  </div>
                  <div className="text-[11px] text-[#3F3540]/60 mt-0.5">
                    ระยะเวลาเฉลี่ย
                  </div>
                </>
              ) : (
                <div className="text-[11px] text-[#B85C72] font-medium leading-relaxed bg-[#FFF9F6] p-2 rounded-xl border border-[#EEDDE0]/50">
                  “คาปิขอเก็บข้อมูลอีกนิด แล้วจะช่วยดู Pattern ให้ได้มากขึ้นนะ 🐹✨”
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Today's Log Card (Logged or Empty State) */}
      {todayLog ? (
        <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#EEDDE0]/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#3F3540] flex items-center gap-1.5">
              <Smile size={15} className="text-[#B85C72]" />
              บันทึกวันนี้ของคุณ
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              บันทึกเรียบร้อย ✓
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-[#FFF9F6] p-2 rounded-xl border border-[#EEDDE0]/50">
              <span className="block text-[10px] text-[#3F3540]/60">Flow</span>
              <span className="font-bold text-[#B85C72] mt-0.5 block">
                {todayLog.flow === 'none'
                  ? 'ไม่มี'
                  : todayLog.flow === 'light'
                  ? 'น้อย'
                  : todayLog.flow === 'medium'
                  ? 'ปานกลาง'
                  : 'มาก'}
              </span>
            </div>

            <div className="bg-[#FFF9F6] p-2 rounded-xl border border-[#EEDDE0]/50">
              <span className="block text-[10px] text-[#3F3540]/60">ระดับความปวด</span>
              <span className="font-bold text-[#3F3540] mt-0.5 block">
                {todayLog.pain ?? 0} / 10
              </span>
            </div>

            <div className="bg-[#FFF9F6] p-2 rounded-xl border border-[#EEDDE0]/50">
              <span className="block text-[10px] text-[#3F3540]/60">พลังงาน</span>
              <span className="font-bold text-[#3F3540] mt-0.5 block">
                {todayLog.energy ?? 0} / 10
              </span>
            </div>
          </div>

          {todayLog.notes && (
            <div className="mt-2.5 p-2 bg-[#FFF9F6] rounded-xl text-xs text-[#3F3540]/80 italic">
              "{todayLog.notes}"
            </div>
          )}
        </div>
      ) : (
        /* Empty State for Today's Log */
        <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#EEDDE0]/80 shadow-xs text-center space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#3F3540]">
            <span className="text-base">🌷</span>
            <span>ยังไม่มีข้อมูลวันนี้</span>
          </div>
          <p className="text-xs text-[#3F3540]/75">
            “ถ้าอยากบันทึกอะไรไว้ให้คาปิ กดปุ่มด้านล่างได้เลยนะ”
          </p>
          <button
            id="home-today-empty-log-btn"
            onClick={() => onOpenQuickLog(todayKey)}
            className="px-4 py-2 bg-[#FFF9F6] hover:bg-[#EEDDE0]/40 text-[#B85C72] border border-[#EEDDE0] text-xs font-bold rounded-xl transition-all"
          >
            + บันทึกวันนี้ 🐹
          </button>
        </div>
      )}

      {/* 4. Daily Message from Nong Capi Card */}
      <CapyDailyTipCard
        currentPhase={prediction.currentPhase}
        todayLog={todayLog}
        allLogs={allLogs}
      />
    </div>
  );
};
