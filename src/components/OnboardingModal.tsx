import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Calendar, Clock, Droplet, ArrowRight, Check } from 'lucide-react';
import { CapyIcon } from './CapyIcon';
import { UserSettings } from '../types';
import { formatToDateKey } from '../utils/dateUtils';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (settings: Partial<UserSettings>) => void;
  onSkip: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  onSkip,
}) => {
  const [step, setStep] = useState<number>(1);
  const [lastPeriodDate, setLastPeriodDate] = useState<string>('');
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [periodDuration, setPeriodDuration] = useState<number>(5);

  const handleFinish = () => {
    onComplete({
      lastPeriodDate: lastPeriodDate || undefined,
      cycleLength,
      periodDuration,
      hasCompletedOnboarding: true,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3F3540]/60 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0 }}
            className="w-full max-w-sm bg-[#FFFFFF] rounded-3xl shadow-2xl p-6 text-[#3F3540] relative overflow-hidden"
          >
            {/* Step Progress indicator */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-1.5">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`h-1.5 rounded-full transition-all ${
                      s === step
                        ? 'w-6 bg-[#B85C72]'
                        : s < step
                        ? 'w-3 bg-[#D98C9A]'
                        : 'w-3 bg-[#EEDDE0]'
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={onSkip}
                className="text-xs font-semibold text-[#3F3540]/60 hover:text-[#B85C72] transition-colors"
              >
                ข้าม (Skip)
              </button>
            </div>

            {/* Step 1: Welcome & Last Period Date */}
            {step === 1 && (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <CapyIcon size={72} variant="happy" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[#3F3540]">
                    ยินดีต้อนรับสู่ Capy Tracking
                  </h2>
                  <p className="text-xs text-[#3F3540]/70 mt-1 leading-relaxed">
                    แอปติดตามรอบเดือนที่นุ่มนวล สบายใจ ไม่ต้องล็อกอิน ข้อมูลอยู่ในเครื่องคุณเท่านั้น 🌸
                  </p>
                </div>

                <div className="text-left bg-[#FFF9F6] p-4 rounded-2xl border border-[#EEDDE0]/80">
                  <label className="text-xs font-bold text-[#3F3540] flex items-center gap-1.5 mb-2">
                    <Calendar size={15} className="text-[#B85C72]" />
                    วันที่มีประจำเดือนครั้งล่าสุด
                  </label>
                  <input
                    type="date"
                    value={lastPeriodDate}
                    onChange={(e) => setLastPeriodDate(e.target.value)}
                    max={formatToDateKey(new Date())}
                    className="w-full bg-white border border-[#EEDDE0] rounded-xl px-3 py-2 text-sm text-[#3F3540] font-medium outline-none focus:border-[#D98C9A]"
                  />
                  <p className="text-[11px] text-[#3F3540]/50 mt-1.5">
                    (หากจำไม่ได้ สามารถกดถัดไปเพื่อเริ่มใช้งานก่อนได้)
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full py-3 bg-gradient-to-r from-[#D98C9A] to-[#B85C72] text-white font-bold rounded-2xl shadow-md shadow-[#D98C9A]/30 flex items-center justify-center gap-2 text-sm"
                >
                  <span>ถัดไป</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}

            {/* Step 2: Estimated Cycle Length */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#FFF9F6] text-[#B85C72] rounded-2xl flex items-center justify-center mx-auto mb-2 border border-[#EEDDE0]">
                    <Clock size={24} />
                  </div>
                  <h2 className="text-lg font-bold text-[#3F3540]">
                    ความยาวรอบเดือนโดยประมาณ
                  </h2>
                  <p className="text-xs text-[#3F3540]/70 mt-1">
                    นับจากวันแรกของรอบเดือน ถึงวันแรกของรอบเดือนถัดไป
                  </p>
                </div>

                <div className="bg-[#FFF9F6] p-4 rounded-2xl border border-[#EEDDE0]/80 text-center">
                  <span className="text-3xl font-extrabold text-[#B85C72]">
                    {cycleLength}
                  </span>
                  <span className="text-sm font-semibold text-[#3F3540]/80 ml-1">
                    วัน
                  </span>

                  <input
                    type="range"
                    min="21"
                    max="45"
                    value={cycleLength}
                    onChange={(e) => setCycleLength(Number(e.target.value))}
                    className="w-full h-2.5 bg-[#EEDDE0] rounded-lg cursor-pointer my-3"
                  />

                  <div className="flex justify-between text-[11px] text-[#3F3540]/60">
                    <span>21 วัน</span>
                    <span>28 วัน (ทั่วไป)</span>
                    <span>45 วัน</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="py-3 px-4 bg-[#FFF9F6] text-[#3F3540] font-semibold text-sm rounded-2xl border border-[#EEDDE0]"
                  >
                    ย้อนกลับ
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex-1 py-3 bg-gradient-to-r from-[#D98C9A] to-[#B85C72] text-white font-bold rounded-2xl shadow-md shadow-[#D98C9A]/30 flex items-center justify-center gap-2 text-sm"
                  >
                    <span>ถัดไป</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Period Duration */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#FFF9F6] text-[#B85C72] rounded-2xl flex items-center justify-center mx-auto mb-2 border border-[#EEDDE0]">
                    <Droplet size={24} fill="#D98C9A" />
                  </div>
                  <h2 className="text-lg font-bold text-[#3F3540]">
                    จำนวนวันที่มีประจำเดือน
                  </h2>
                  <p className="text-xs text-[#3F3540]/70 mt-1">
                    โดยปกติประจำเดือนจะมาประมาณกี่วัน
                  </p>
                </div>

                <div className="bg-[#FFF9F6] p-4 rounded-2xl border border-[#EEDDE0]/80 text-center">
                  <span className="text-3xl font-extrabold text-[#B85C72]">
                    {periodDuration}
                  </span>
                  <span className="text-sm font-semibold text-[#3F3540]/80 ml-1">
                    วัน
                  </span>

                  <input
                    type="range"
                    min="2"
                    max="10"
                    value={periodDuration}
                    onChange={(e) => setPeriodDuration(Number(e.target.value))}
                    className="w-full h-2.5 bg-[#EEDDE0] rounded-lg cursor-pointer my-3"
                  />

                  <div className="flex justify-between text-[11px] text-[#3F3540]/60">
                    <span>2 วัน</span>
                    <span>5 วัน (ทั่วไป)</span>
                    <span>10 วัน</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="py-3 px-4 bg-[#FFF9F6] text-[#3F3540] font-semibold text-sm rounded-2xl border border-[#EEDDE0]"
                  >
                    ย้อนกลับ
                  </button>
                  <button
                    type="button"
                    onClick={handleFinish}
                    className="flex-1 py-3 bg-gradient-to-r from-[#D98C9A] to-[#B85C72] text-white font-bold rounded-2xl shadow-md shadow-[#D98C9A]/30 flex items-center justify-center gap-2 text-sm"
                  >
                    <Check size={18} strokeWidth={2.5} />
                    <span>เริ่มต้นใช้งาน</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
