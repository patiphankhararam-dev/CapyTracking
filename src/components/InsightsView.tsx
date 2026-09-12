import React, { useState } from 'react';
import { CyclePrediction, DayLog, UserSettings } from '../types';
import { 
  analyzeMyPattern, 
  calculateDetailedCycles, 
  formatThaiDateShort, 
  THAI_MONTHS 
} from '../utils/dateUtils';
import { 
  Sparkles, 
  Activity, 
  TrendingUp, 
  CalendarCheck2, 
  Droplet, 
  Zap, 
  Smile, 
  AlertCircle,
  HelpCircle,
  BarChart2,
  PieChart
} from 'lucide-react';
import { CapyIcon } from './CapyIcon';

interface InsightsViewProps {
  logs: Record<string, DayLog>;
  prediction: CyclePrediction;
  settings: UserSettings;
}

export const InsightsView: React.FC<InsightsViewProps> = ({ logs, prediction, settings }) => {
  const [activeTab, setActiveTab] = useState<'insights' | 'pattern' | 'statistics'>('insights');

  const detailedCycles = calculateDetailedCycles(logs, settings);
  const myPattern = analyzeMyPattern(logs, prediction);

  const allLogsArray: DayLog[] = (Object.values(logs) as DayLog[]).sort((a, b) => a.date.localeCompare(b.date));
  const totalLoggedDays = allLogsArray.length;

  // Calculate averages strictly from real logs
  const painSum = allLogsArray.reduce((acc, curr) => acc + (curr.pain || 0), 0);
  const avgPain = totalLoggedDays > 0 ? (painSum / totalLoggedDays).toFixed(1) : '0';

  const energySum = allLogsArray.reduce((acc, curr) => acc + (curr.energy || 0), 0);
  const avgEnergy = totalLoggedDays > 0 ? (energySum / totalLoggedDays).toFixed(1) : '0';

  // Count flow levels strictly from real logs
  const flowCounts: Record<string, number> = { none: 0, light: 0, medium: 0, heavy: 0 };
  allLogsArray.forEach((l) => {
    if (l.flow) flowCounts[l.flow] = (flowCounts[l.flow] || 0) + 1;
  });

  // Count mood occurrences strictly from real logs
  const moodCounts: Record<string, number> = {};
  allLogsArray.forEach((l) => {
    (l.moods || []).forEach((m) => {
      moodCounts[m] = (moodCounts[m] || 0) + 1;
    });
  });
  const sortedMoods = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]);

  // Symptom days (where pain > 0 or mood recorded or flow is not none)
  const symptomDaysCount = allLogsArray.filter(
    (l) => (l.pain && l.pain > 0) || (l.moods && l.moods.length > 0) || (l.flow && l.flow !== 'none')
  ).length;

  // Recent logs for trend chart (last 10 logged days)
  const recentLogsForChart = allLogsArray.slice(-10);

  // Helper for phase label
  const getPhaseNameThai = (phase: string | null): string => {
    switch (phase) {
      case 'menstrual':
        return 'ช่วงมีประจำเดือน (Menstrual)';
      case 'follicular':
        return 'ระยะฟอลลิคูลาร์ (Follicular)';
      case 'ovulation':
        return 'ช่วงตกไข่ (Ovulation)';
      case 'luteal':
        return 'ช่วงก่อนมีประจำเดือน (Luteal / PMS)';
      default:
        return 'ยังไม่มีข้อมูล';
    }
  };

  const getFlowNameThai = (flow: string | null): string => {
    switch (flow) {
      case 'heavy':
        return 'มามาก (Heavy)';
      case 'medium':
        return 'ปานกลาง (Medium)';
      case 'light':
        return 'มาน้อย (Light)';
      case 'none':
        return 'ไม่มี (None)';
      default:
        return 'ไม่มีข้อมูล';
    }
  };

  const getMoodEmoji = (mood: string | null): string => {
    switch (mood) {
      case 'calm':
        return '😌 สบายใจ';
      case 'happy':
        return '🥰 มีความสุข';
      case 'energetic':
        return '✨ สดชื่น';
      case 'tired':
        return '🥱 เหนื่อยล้า';
      case 'sensitive':
        return '🥺 อ่อนไหว';
      case 'crampy':
        return '😣 ปวดเกร็ง';
      case 'irritable':
        return '😤 หงุดหงิด';
      case 'anxious':
        return '💭 กังวล';
      case 'sleepy':
        return '😴 ง่วงนอน';
      default:
        return mood || '-';
    }
  };

  return (
    <div className="space-y-4 pb-24 px-4 pt-1">
      {/* 1. Header with Cozy Capybara & Nav Tabs */}
      <div className="bg-[#FFFFFF] p-4 rounded-3xl border border-[#EEDDE0]/80 shadow-xs">
        <div className="flex items-center gap-3 mb-3">
          <CapyIcon size={46} variant="happy" />
          <div className="flex-1">
            <h1 className="text-base font-bold text-[#3F3540]">
              ข้อมูลเชิงลึก & รูปแบบส่วนตัว
            </h1>
            <p className="text-xs text-[#3F3540]/70">
              วิเคราะห์จากข้อมูลที่คุณบันทึกจริงในเครื่อง
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-[#FFF9F6] p-1 rounded-2xl border border-[#EEDDE0]/60 text-xs">
          <button
            onClick={() => setActiveTab('insights')}
            className={`py-2 px-1 rounded-xl font-bold transition-all text-center flex items-center justify-center gap-1 ${
              activeTab === 'insights'
                ? 'bg-[#D98C9A] text-white shadow-xs'
                : 'text-[#3F3540]/75 hover:text-[#3F3540]'
            }`}
          >
            <BarChart2 size={14} />
            <span>ภาพรวม</span>
          </button>

          <button
            onClick={() => setActiveTab('pattern')}
            className={`py-2 px-1 rounded-xl font-bold transition-all text-center flex items-center justify-center gap-1 ${
              activeTab === 'pattern'
                ? 'bg-[#D98C9A] text-white shadow-xs'
                : 'text-[#3F3540]/75 hover:text-[#3F3540]'
            }`}
          >
            <Sparkles size={14} />
            <span>My Pattern</span>
          </button>

          <button
            onClick={() => setActiveTab('statistics')}
            className={`py-2 px-1 rounded-xl font-bold transition-all text-center flex items-center justify-center gap-1 ${
              activeTab === 'statistics'
                ? 'bg-[#D98C9A] text-white shadow-xs'
                : 'text-[#3F3540]/75 hover:text-[#3F3540]'
            }`}
          >
            <CalendarCheck2 size={14} />
            <span>สถิติรอบ</span>
          </button>
        </div>
      </div>

      {/* 2. TAB: INSIGHTS & TRENDS */}
      {activeTab === 'insights' && (
        <div className="space-y-4">
          {totalLoggedDays === 0 ? (
            <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#EEDDE0]/80 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#FFF9F6] text-[#B85C72] flex items-center justify-center mx-auto border border-[#EEDDE0]">
                <AlertCircle size={24} />
              </div>
              <h3 className="text-sm font-bold text-[#3F3540]">
                ยังมีข้อมูลไม่เพียงพอสำหรับวิเคราะห์
              </h3>
              <p className="text-xs text-[#3F3540]/70 max-w-xs mx-auto leading-relaxed">
                เมื่อคุณเริ่มบันทึกอาการในหน้า Quick Log หรือปฏิทิน กราฟและสถิติจะถูกคำนวณจากข้อมูลจริงของคุณทันที
              </p>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-[#FFFFFF] rounded-2xl border border-[#EEDDE0]/80 shadow-xs">
                  <div className="flex items-center justify-between text-[#B85C72] mb-1">
                    <span className="text-xs font-medium text-[#3F3540]/75">ระดับความปวดเฉลี่ย</span>
                    <Activity size={16} />
                  </div>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-extrabold text-[#B85C72]">{avgPain}</span>
                    <span className="text-xs text-[#3F3540]/60">/ 10</span>
                  </div>
                  <span className="text-[10px] text-[#3F3540]/60 mt-1 block">
                    จากบันทึก {totalLoggedDays} วัน
                  </span>
                </div>

                <div className="p-3.5 bg-[#FFFFFF] rounded-2xl border border-[#EEDDE0]/80 shadow-xs">
                  <div className="flex items-center justify-between text-amber-600 mb-1">
                    <span className="text-xs font-medium text-[#3F3540]/75">ระดับพลังงานเฉลี่ย</span>
                    <Zap size={16} />
                  </div>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-extrabold text-amber-600">{avgEnergy}</span>
                    <span className="text-xs text-[#3F3540]/60">/ 10</span>
                  </div>
                  <span className="text-[10px] text-[#3F3540]/60 mt-1 block">
                    จากบันทึก {totalLoggedDays} วัน
                  </span>
                </div>
              </div>

              {/* Symptom Days & Flow Overview */}
              <div className="bg-[#FFFFFF] p-4 rounded-3xl border border-[#EEDDE0]/80 shadow-xs">
                <h2 className="text-sm font-bold text-[#3F3540] flex items-center gap-1.5 mb-3">
                  <Droplet size={16} className="text-[#B85C72]" />
                  จำนวนวันที่มีอาการและ Flow
                </h2>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FFF9F6] border border-[#EEDDE0]/60 mb-3">
                  <div>
                    <span className="text-xs font-bold text-[#3F3540] block">วันที่มีการบันทึกอาการ</span>
                    <span className="text-[11px] text-[#3F3540]/60">มีความปวด อาการ หรืออารมณ์</span>
                  </div>
                  <span className="text-xl font-extrabold text-[#B85C72]">
                    {symptomDaysCount} <span className="text-xs font-normal text-[#3F3540]/70">วัน</span>
                  </span>
                </div>

                {/* Flow Distribution Real Bar Graph */}
                <div className="space-y-2 text-xs">
                  <span className="text-[11px] font-semibold text-[#3F3540]/75 block">
                    การกระจายของ Flow ที่บันทึกจริง:
                  </span>

                  {(['heavy', 'medium', 'light', 'none'] as const).map((flowKey) => {
                    const count = flowCounts[flowKey] || 0;
                    const pct = totalLoggedDays > 0 ? Math.round((count / totalLoggedDays) * 100) : 0;
                    return (
                      <div key={flowKey} className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-[#3F3540]/80">{getFlowNameThai(flowKey)}</span>
                          <span className="font-semibold text-[#3F3540]">
                            {count} วัน ({pct}%)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-[#FFF9F6] rounded-full overflow-hidden border border-[#EEDDE0]/60">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              flowKey === 'heavy'
                                ? 'bg-[#B85C72]'
                                : flowKey === 'medium'
                                ? 'bg-[#D98C9A]'
                                : flowKey === 'light'
                                ? 'bg-[#EEDDE0]'
                                : 'bg-gray-300'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Real Chart: Pain & Energy Trend */}
              <div className="bg-[#FFFFFF] p-4 rounded-3xl border border-[#EEDDE0]/80 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-[#3F3540] flex items-center gap-1.5">
                    <TrendingUp size={16} className="text-[#B85C72]" />
                    แนวโน้มความปวด & พลังงาน (ตามวันที่บันทึก)
                  </h2>
                  <div className="flex items-center gap-3 text-[10px]">
                    <span className="flex items-center gap-1 text-[#B85C72] font-semibold">
                      <span className="w-2 h-2 rounded-full bg-[#B85C72]" /> ความปวด
                    </span>
                    <span className="flex items-center gap-1 text-amber-600 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-amber-500" /> พลังงาน
                    </span>
                  </div>
                </div>

                {/* Responsive SVG Chart */}
                <div className="bg-[#FFF9F6] p-3 rounded-2xl border border-[#EEDDE0]/60">
                  <div className="h-44 w-full flex items-end gap-2 pt-4 pb-2 px-1">
                    {recentLogsForChart.map((log) => {
                      const painHeight = Math.max(4, (log.pain / 10) * 120);
                      const energyHeight = Math.max(4, (log.energy / 10) * 120);
                      const dayLabel = log.date.split('-').slice(1).join('/');

                      return (
                        <div
                          key={log.date}
                          className="flex-1 flex flex-col items-center justify-end h-full group relative"
                        >
                          {/* Tooltip on hover/active */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-[#3F3540] text-white text-[9px] px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-10">
                            ปวด {log.pain} | พลังงาน {log.energy}
                          </div>

                          <div className="w-full flex items-end justify-center gap-1 h-32">
                            {/* Pain bar */}
                            <div
                              style={{ height: `${painHeight}px` }}
                              className="w-2 sm:w-3 bg-[#B85C72] rounded-t-sm transition-all"
                              title={`ความปวด: ${log.pain}`}
                            />
                            {/* Energy bar */}
                            <div
                              style={{ height: `${energyHeight}px` }}
                              className="w-2 sm:w-3 bg-amber-500 rounded-t-sm transition-all"
                              title={`พลังงาน: ${log.energy}`}
                            />
                          </div>

                          <span className="text-[9px] text-[#3F3540]/60 mt-2 rotate-0 truncate">
                            {dayLabel}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-center text-[10px] text-[#3F3540]/50 pt-2 border-t border-[#EEDDE0]/40">
                    แสดงข้อมูล {recentLogsForChart.length} วันล่าสุดที่ผู้ใช้บันทึก
                  </div>
                </div>
              </div>

              {/* Mood Frequencies */}
              <div className="bg-[#FFFFFF] p-4 rounded-3xl border border-[#EEDDE0]/80 shadow-xs">
                <h2 className="text-sm font-bold text-[#3F3540] flex items-center gap-1.5 mb-2.5">
                  <Smile size={16} className="text-[#B85C72]" />
                  อารมณ์ที่บันทึกบ่อยที่สุด
                </h2>

                {sortedMoods.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {sortedMoods.map(([moodKey, count]) => (
                      <div
                        key={moodKey}
                        className="px-3 py-1.5 bg-[#FFF9F6] border border-[#EEDDE0] rounded-xl flex items-center gap-2 text-xs text-[#3F3540]"
                      >
                        <span className="font-medium">{getMoodEmoji(moodKey)}</span>
                        <span className="bg-[#EEDDE0] text-[#B85C72] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                          {count} ครั้ง
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#3F3540]/60 italic py-2">
                    ยังไม่มีการบันทึกอารมณ์
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* 3. TAB: MY PATTERN */}
      {activeTab === 'pattern' && (
        <div className="space-y-4">
          {!myPattern.hasEnoughData ? (
            <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#EEDDE0]/80 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#FFF9F6] text-[#B85C72] flex items-center justify-center mx-auto border border-[#EEDDE0]">
                <HelpCircle size={24} />
              </div>
              <h3 className="text-sm font-bold text-[#3F3540]">
                ยังมีข้อมูลไม่เพียงพอสำหรับวิเคราะห์
              </h3>
              <p className="text-xs text-[#3F3540]/70 max-w-xs mx-auto leading-relaxed">
                ระบบต้องการบันทึกอาการอย่างน้อย 3 วันเพื่อค้นหารูปแบบส่วนตัว (My Pattern) ของร่างกายคุณ บันทึกความปวดและพลังงานต่อได้เลย!
              </p>
            </div>
          ) : (
            <>
              {/* Core Body Cycle Insights */}
              <div className="bg-[#FFFFFF] p-4 rounded-3xl border border-[#EEDDE0]/80 shadow-xs space-y-3">
                <h2 className="text-sm font-bold text-[#3F3540] flex items-center gap-1.5">
                  <Sparkles size={16} className="text-[#B85C72]" />
                  รูปแบบรอบเดือนเฉพาะตัวของคุณ
                </h2>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-[#FFF9F6] rounded-2xl border border-[#EEDDE0]/60">
                    <span className="text-[11px] text-[#3F3540]/60 block mb-1">
                      รอบเดือนโดยเฉลี่ย
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-extrabold text-[#3F3540]">
                        {myPattern.avgCycleLength}
                      </span>
                      <span className="text-xs font-semibold text-[#3F3540]/70">วัน</span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#FFF9F6] rounded-2xl border border-[#EEDDE0]/60">
                    <span className="text-[11px] text-[#3F3540]/60 block mb-1">
                      ประจำเดือนโดยเฉลี่ย
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-extrabold text-[#B85C72]">
                        {myPattern.avgPeriodDuration}
                      </span>
                      <span className="text-xs font-semibold text-[#3F3540]/70">วัน</span>
                    </div>
                  </div>
                </div>

                {/* Key Symptom Phase Correlations */}
                <div className="space-y-2.5 pt-1">
                  {/* High Pain Phase */}
                  <div className="p-3 bg-[#FFF9F6] rounded-2xl border border-[#EEDDE0]/60 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#D98C9A]/20 text-[#B85C72] flex items-center justify-center shrink-0 mt-0.5">
                      <Activity size={18} />
                    </div>
                    <div className="flex-1 text-xs">
                      <span className="text-[11px] text-[#3F3540]/70 block">
                        ช่วงที่มักมีอาการปวดสูงที่สุด
                      </span>
                      <span className="font-bold text-[#B85C72] text-sm block mt-0.5">
                        {myPattern.highestPainPhase
                          ? getPhaseNameThai(myPattern.highestPainPhase)
                          : 'ยังไม่พบความแตกต่างชัดเจน'}
                      </span>
                      {myPattern.highestPainPhaseAvg > 0 && (
                        <span className="text-[11px] text-[#3F3540]/60 mt-0.5 block">
                          ระดับเฉลี่ย: {myPattern.highestPainPhaseAvg} / 10
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Low Energy Phase */}
                  <div className="p-3 bg-[#FFF9F6] rounded-2xl border border-[#EEDDE0]/60 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Zap size={18} />
                    </div>
                    <div className="flex-1 text-xs">
                      <span className="text-[11px] text-[#3F3540]/70 block">
                        ช่วงที่พลังงานมักจะต่ำที่สุด
                      </span>
                      <span className="font-bold text-amber-700 text-sm block mt-0.5">
                        {myPattern.lowestEnergyPhase
                          ? getPhaseNameThai(myPattern.lowestEnergyPhase)
                          : 'ยังไม่พบความแตกต่างชัดเจน'}
                      </span>
                      {myPattern.lowestEnergyPhaseAvg > 0 && (
                        <span className="text-[11px] text-[#3F3540]/60 mt-0.5 block">
                          ระดับเฉลี่ย: {myPattern.lowestEnergyPhaseAvg} / 10
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Dominant Flow & Mood */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 bg-[#FFF9F6] rounded-2xl border border-[#EEDDE0]/60">
                      <span className="text-[11px] text-[#3F3540]/60 block mb-1">
                        Flow ที่พบมากที่สุด
                      </span>
                      <span className="font-bold text-[#B85C72] text-sm block">
                        {myPattern.dominantFlow ? getFlowNameThai(myPattern.dominantFlow) : '-'}
                      </span>
                    </div>

                    <div className="p-3 bg-[#FFF9F6] rounded-2xl border border-[#EEDDE0]/60">
                      <span className="text-[11px] text-[#3F3540]/60 block mb-1">
                        อารมณ์ที่บันทึกบ่อย
                      </span>
                      <span className="font-bold text-[#3F3540] text-sm block">
                        {myPattern.dominantMood ? getMoodEmoji(myPattern.dominantMood) : '-'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Capybara Personal Pattern Advice */}
              <div className="bg-gradient-to-r from-[#EEDDE0]/60 to-[#FFF9F6] p-4 rounded-3xl border border-[#EEDDE0] flex items-center gap-3">
                <CapyIcon size={46} variant="water" />
                <div className="flex-1 text-xs">
                  <span className="font-bold text-[#B85C72] block">
                    คำแนะนำเฉพาะรูปแบบของคุณ
                  </span>
                  <p className="text-[#3F3540]/80 mt-0.5 leading-relaxed">
                    ช่วงที่ปวดสูงหรือพลังงานต่ำ แนะนำเตรียมถุงน้ำร้อน ดื่มชาอุ่นๆ และลดกิจกรรมหนักๆ ล่วงหน้าเพื่อความผ่อนคลายนะ 🍊
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* 4. TAB: HISTORICAL STATISTICS BY CYCLE */}
      {activeTab === 'statistics' && (
        <div className="space-y-4">
          <div className="bg-[#FFFFFF] p-4 rounded-3xl border border-[#EEDDE0]/80 shadow-xs">
            <h2 className="text-sm font-bold text-[#3F3540] flex items-center gap-1.5 mb-2">
              <CalendarCheck2 size={16} className="text-[#B85C72]" />
              สถิติย้อนหลังแยกตามรอบเดือน (Cycle Breakdown)
            </h2>
            <p className="text-xs text-[#3F3540]/70 mb-3">
              เปรียบเทียบความยาวรอบ ระยะเวลาเป็นประจำเดือน และความปวดในแต่ละรอบ
            </p>

            {detailedCycles.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <p className="text-xs text-[#3F3540]/60">
                  ยังมีข้อมูลไม่เพียงพอสำหรับวิเคราะห์
                </p>
                <p className="text-[11px] text-[#3F3540]/50 max-w-xs mx-auto">
                  บันทึกวันแรกของประจำเดือนเพื่อเริ่มเก็บสถิติรอบที่ 1
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {detailedCycles.map((cycle) => (
                  <div
                    key={cycle.startDate}
                    className="p-3.5 bg-[#FFF9F6] rounded-2xl border border-[#EEDDE0]/70 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-[#EEDDE0]/50">
                      <div>
                        <span className="font-bold text-[#3F3540] text-sm">
                          รอบเดือนที่ {cycle.cycleNumber}
                        </span>
                        <span className="text-[11px] text-[#3F3540]/60 block mt-0.5">
                          เริ่ม: {formatThaiDateShort(cycle.startDate)}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-[#B85C72] bg-white px-2.5 py-1 rounded-xl border border-[#EEDDE0]">
                        {cycle.periodDuration} วันที่มีประจำเดือน
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                      <div className="bg-white/80 p-2 rounded-xl border border-[#EEDDE0]/40">
                        <span className="text-[#3F3540]/60 block">ความยาวรอบ</span>
                        <span className="font-bold text-[#3F3540] text-sm">
                          {cycle.cycleLength ? `${cycle.cycleLength} วัน` : 'รอบปัจจุบัน'}
                        </span>
                      </div>

                      <div className="bg-white/80 p-2 rounded-xl border border-[#EEDDE0]/40">
                        <span className="text-[#3F3540]/60 block">ความปวดเฉลี่ย</span>
                        <span className="font-bold text-[#B85C72] text-sm">
                          {cycle.avgPain} / 10
                        </span>
                      </div>

                      <div className="bg-white/80 p-2 rounded-xl border border-[#EEDDE0]/40">
                        <span className="text-[#3F3540]/60 block">พลังงานเฉลี่ย</span>
                        <span className="font-bold text-amber-600 text-sm">
                          {cycle.avgEnergy} / 10
                        </span>
                      </div>

                      <div className="bg-white/80 p-2 rounded-xl border border-[#EEDDE0]/40">
                        <span className="text-[#3F3540]/60 block">Flow หลัก</span>
                        <span className="font-bold text-[#3F3540]">
                          {getFlowNameThai(cycle.dominantFlow)}
                        </span>
                      </div>
                    </div>

                    {cycle.dominantMood && (
                      <div className="pt-1 text-[11px] text-[#3F3540]/70 flex items-center gap-1.5">
                        <span>อารมณ์เด่นในรอบนี้:</span>
                        <span className="font-semibold text-[#B85C72]">
                          {getMoodEmoji(cycle.dominantMood)}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
