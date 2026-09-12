import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Sparkles, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { CapyIcon } from './CapyIcon';
import { formatThaiDateFriendly, formatThaiDateShort, formatToDateKey, parseDateKey } from '../utils/dateUtils';

interface FirstSetupViewProps {
  onStartTracking: (selectedDate: string) => void;
  onSkip: () => void;
}

export const FirstSetupView: React.FC<FirstSetupViewProps> = ({
  onStartTracking,
  onSkip,
}) => {
  const todayKey = formatToDateKey(new Date());
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedDate) {
      setErrorMsg('เลือกวันแรกที่ประจำเดือนมาให้น้องคาปิก่อนนะ 🐹💗');
      return;
    }
    setErrorMsg(null);
    onStartTracking(selectedDate);
  };

  const setQuickDay = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    setSelectedDate(formatToDateKey(d));
    setErrorMsg(null);
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-between px-5 py-6 sm:py-8 max-w-md mx-auto text-[#3F3540]">
      {/* Top Section: Mascot & Warm Greeting */}
      <div className="text-center space-y-4 pt-4">
        {/* Mascot Avatar with soft glow */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative inline-block mx-auto"
        >
          <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#FFF0F3] to-[#FFFFFF] border-2 border-[#EEDDE0] shadow-sm flex items-center justify-center p-3">
            <CapyIcon size={84} variant="love" />
          </div>
          {/* Sparkle badge */}
          <span className="absolute -top-1 -right-1 bg-[#D98C9A] text-white p-1.5 rounded-full shadow-xs">
            <Sparkles size={16} />
          </span>
        </motion.div>

        <div>
          <h1 className="text-2xl font-extrabold text-[#3F3540] tracking-tight leading-snug">
            สวัสดี! คาปิมาช่วยจดรอบเดือนแล้วนะ 🐹💗
          </h1>
          <p className="text-sm text-[#3F3540]/75 mt-2 font-medium leading-relaxed max-w-xs mx-auto">
            ก่อนเริ่มใช้งาน บอกคาปิหน่อยว่าประจำเดือนครั้งล่าสุดเริ่มวันไหน
          </p>
        </div>
      </div>

      {/* Center Section: Large Date Selection Card */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="my-6"
      >
        <div className="bg-[#FFFFFF] p-5 sm:p-6 rounded-3xl border border-[#EEDDE0] shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🩷</span>
            <label
              htmlFor="first-period-date-input"
              className="text-sm font-bold text-[#3F3540]"
            >
              วันแรกที่ประจำเดือนมา
            </label>
          </div>

          {/* Big custom date selector field */}
          <div className="relative">
            <div className="flex items-center justify-between bg-[#FFF9F6] border-2 border-[#EEDDE0] focus-within:border-[#D98C9A] rounded-2xl px-4 py-3.5 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-[#B85C72] flex items-center justify-center border border-[#EEDDE0]/70 shadow-2xs">
                  <Calendar size={20} />
                </div>
                <div>
                  <span className="text-xs text-[#3F3540]/60 block font-medium">
                    {selectedDate ? 'วันที่เลือก:' : 'กรุณาเลือกวันที่'}
                  </span>
                  <span className="text-base font-bold text-[#3F3540]">
                    {selectedDate
                      ? `${formatThaiDateFriendly(selectedDate)} (${formatThaiDateShort(selectedDate)})`
                      : '[ เลือกวันที่ ]'}
                  </span>
                </div>
              </div>

              {/* Native Date Input Overlay */}
              <input
                id="first-period-date-input"
                type="date"
                value={selectedDate}
                max={todayKey}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setErrorMsg(null);
                }}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                aria-label="เลือกวันแรกที่ประจำเดือนมา"
              />
            </div>
          </div>

          {/* Quick Date Shortcut Pills */}
          <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-[#3F3540]/60 mr-1">เลือกเร็ว:</span>
            <button
              type="button"
              onClick={() => setQuickDay(0)}
              className="px-2.5 py-1 bg-[#FFF9F6] hover:bg-[#EEDDE0]/50 text-xs font-semibold text-[#3F3540] rounded-xl border border-[#EEDDE0] transition-colors"
            >
              วันนี้
            </button>
            <button
              type="button"
              onClick={() => setQuickDay(1)}
              className="px-2.5 py-1 bg-[#FFF9F6] hover:bg-[#EEDDE0]/50 text-xs font-semibold text-[#3F3540] rounded-xl border border-[#EEDDE0] transition-colors"
            >
              เมื่อวานนี้
            </button>
            <button
              type="button"
              onClick={() => setQuickDay(3)}
              className="px-2.5 py-1 bg-[#FFF9F6] hover:bg-[#EEDDE0]/50 text-xs font-semibold text-[#3F3540] rounded-xl border border-[#EEDDE0] transition-colors"
            >
              3 วันก่อน
            </button>
            <button
              type="button"
              onClick={() => setQuickDay(7)}
              className="px-2.5 py-1 bg-[#FFF9F6] hover:bg-[#EEDDE0]/50 text-xs font-semibold text-[#3F3540] rounded-xl border border-[#EEDDE0] transition-colors"
            >
              1 สัปดาห์ก่อน
            </button>
          </div>

          {errorMsg && (
            <div className="mt-3 p-2.5 bg-red-50 text-red-600 rounded-xl text-xs font-semibold flex items-center gap-1.5">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-[#EEDDE0]/50 text-center">
            <p className="text-[11px] text-[#3F3540]/60 leading-normal">
              🌸 ข้อมูลนี้จะใช้คำนวณและคาดการณ์รอบเดือนของคุณอย่างแม่นยำ ปลอดภัยอยู่ในอุปกรณ์นี้เท่านั้น
            </p>
          </div>
        </div>
      </motion.div>

      {/* Bottom Section: Primary Button & Skip Option */}
      <div className="space-y-3 pb-2">
        <button
          id="first-setup-start-btn"
          type="button"
          onClick={() => handleSubmit()}
          className="w-full py-4 px-6 bg-gradient-to-r from-[#D98C9A] to-[#B85C72] text-white font-bold text-base rounded-2xl shadow-md shadow-[#D98C9A]/30 hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>เริ่มบันทึกกันเลย ✨</span>
          <ArrowRight size={18} strokeWidth={2.5} />
        </button>

        <div className="text-center">
          <button
            id="first-setup-skip-btn"
            type="button"
            onClick={onSkip}
            className="py-2 px-4 text-xs font-semibold text-[#3F3540]/65 hover:text-[#B85C72] transition-colors underline-offset-4 hover:underline"
          >
            ข้ามไปก่อน
          </button>
        </div>

        {/* Local storage privacy badge */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-700/80 pt-1">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>บันทึกปลอดภัยในเครื่องนี้ 100% ไม่ต้องเข้าสู่ระบบ</span>
        </div>
      </div>
    </div>
  );
};
