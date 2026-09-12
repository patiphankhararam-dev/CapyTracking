import React, { useState, useEffect } from 'react';
import { CyclePhase, DayLog } from '../types';
import { CapyIcon } from './CapyIcon';
import {
  CapyTip,
  getContextualCapyTips,
  getRandomCapyTip,
  GENERAL_TIPS,
} from '../data/capyTips';
import { Sparkles, RefreshCw } from 'lucide-react';

interface CapyDailyTipCardProps {
  currentPhase: CyclePhase | null;
  todayLog?: DayLog;
  allLogs?: Record<string, DayLog>;
}

const WAITING_TIP: CapyTip = {
  id: 'waiting_for_user_data',
  category: 'general',
  text: 'คาปิรอข้อมูลจากเธออยู่นะ 🐹✨ บอกวันแรกของรอบเดือน หรือบันทึกความรู้สึกวันนี้ได้ทุกเมื่อเลย',
  avatarVariant: 'sparkle',
  tag: 'น้องคาปิอยู่ตรงนี้เสมอ',
};

export const CapyDailyTipCard: React.FC<CapyDailyTipCardProps> = ({
  currentPhase,
  todayLog,
  allLogs,
}) => {
  const [currentTip, setCurrentTip] = useState<CapyTip>(() => {
    if (!currentPhase && !todayLog) {
      return WAITING_TIP;
    }
    const { primaryPool, fallbackPool } = getContextualCapyTips(
      currentPhase || 'follicular',
      todayLog,
      allLogs
    );
    return getRandomCapyTip(primaryPool, fallbackPool);
  });

  const [isRotating, setIsRotating] = useState(false);

  // Update tip when phase or todayLog changes significantly
  useEffect(() => {
    if (!currentPhase && !todayLog) {
      setCurrentTip(WAITING_TIP);
      return;
    }
    const { primaryPool, fallbackPool } = getContextualCapyTips(
      currentPhase || 'follicular',
      todayLog,
      allLogs
    );
    setCurrentTip(getRandomCapyTip(primaryPool, fallbackPool));
  }, [currentPhase, todayLog?.pain, todayLog?.energy, todayLog?.moods?.length]);

  const handleNextTip = () => {
    setIsRotating(true);
    const { primaryPool, fallbackPool } = getContextualCapyTips(
      currentPhase || 'follicular',
      todayLog,
      allLogs
    );
    const next = getRandomCapyTip(primaryPool, fallbackPool, currentTip.id);
    setCurrentTip(next);

    setTimeout(() => {
      setIsRotating(false);
    }, 400);
  };

  return (
    <div className="bg-gradient-to-br from-[#FFF9F6] via-[#FFFFFF] to-[#FDF4F5] p-4 rounded-3xl border border-[#EEDDE0] shadow-xs relative overflow-hidden">
      {/* Decorative soft bubble aura in background */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#D98C9A]/10 rounded-full blur-xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-bold text-[#3F3540] flex items-center gap-1.5">
            ข้อความจากน้องคาปิ 🐹
          </span>
          {currentTip.tag && (
            <span className="bg-[#EEDDE0]/70 text-[#B85C72] text-[10px] font-semibold px-2 py-0.5 rounded-full">
              {currentTip.tag}
            </span>
          )}
        </div>

        {/* Small "ขออีกข้อความ ✨" Button */}
        <button
          onClick={handleNextTip}
          className="px-2.5 py-1 bg-white hover:bg-[#FFF9F6] border border-[#EEDDE0] text-[#B85C72] text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-2xs active:scale-95 transition-all cursor-pointer"
          title="ขอข้อความใหม่"
          aria-label="ขออีกข้อความ"
        >
          <Sparkles
            size={13}
            className={`transition-transform duration-300 ${
              isRotating ? 'rotate-180 scale-110 text-[#D98C9A]' : ''
            }`}
          />
          <span className="text-[11px] whitespace-nowrap">ขออีกข้อความ ✨</span>
        </button>
      </div>

      {/* Body with Mascot Avatar & Speech */}
      <div className="flex items-start gap-3.5">
        <div className="shrink-0 relative">
          <div className="w-14 h-14 rounded-2xl bg-white/90 border border-[#EEDDE0]/70 shadow-2xs flex items-center justify-center p-1">
            <CapyIcon size={50} variant={currentTip.avatarVariant} />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="bg-white/80 p-3 rounded-2xl border border-[#EEDDE0]/60 text-xs text-[#3F3540] leading-relaxed shadow-2xs transition-all duration-300">
            <p className="font-medium text-[#3F3540]">
              {currentTip.text}
            </p>
          </div>

          <div className="flex items-center justify-between mt-2 px-1">
            <span className="text-[10px] text-[#3F3540]/55 flex items-center gap-1">
              <span>🧡</span> คาปิบาร่าเพื่อนซี้ดูแลสุขภาพของคุณ
            </span>
            <span className="text-[10px] text-[#3F3540]/45">
              General Wellness
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
