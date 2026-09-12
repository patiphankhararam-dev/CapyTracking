import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Droplet, Trash2, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { DayLog, FlowLevel, MoodType } from '../types';
import { formatThaiDateShort, formatToDateKey } from '../utils/dateUtils';

interface QuickLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetDate: string; // YYYY-MM-DD
  existingLog?: DayLog;
  onSaveLog: (log: DayLog) => void;
  onDeleteLog?: (date: string) => void;
}

const MOOD_OPTIONS: { id: MoodType; label: string; emoji: string }[] = [
  { id: 'calm', label: 'สบายใจ', emoji: '😌' },
  { id: 'happy', label: 'มีความสุข', emoji: '🥰' },
  { id: 'energetic', label: 'สดชื่น', emoji: '✨' },
  { id: 'tired', label: 'เหนื่อยล้า', emoji: '🥱' },
  { id: 'sensitive', label: 'อ่อนไหว', emoji: '🥺' },
  { id: 'crampy', label: 'ปวดเกร็ง', emoji: '😣' },
  { id: 'irritable', label: 'หงุดหงิด', emoji: '😤' },
  { id: 'anxious', label: 'กังวล', emoji: '💭' },
  { id: 'sleepy', label: 'ง่วงนอน', emoji: '😴' },
];

const FLOW_OPTIONS: { id: FlowLevel; label: string; droplets: number; desc: string }[] = [
  { id: 'none', label: 'ไม่มี', droplets: 0, desc: 'ไม่มีเลือด' },
  { id: 'light', label: 'น้อย', droplets: 1, desc: 'มาเล็กน้อย' },
  { id: 'medium', label: 'ปานกลาง', droplets: 2, desc: 'ระดับปกติ' },
  { id: 'heavy', label: 'มาก', droplets: 3, desc: 'มามากเป็นพิเศษ' },
];

export const QuickLogModal: React.FC<QuickLogModalProps> = ({
  isOpen,
  onClose,
  targetDate,
  existingLog,
  onSaveLog,
  onDeleteLog,
}) => {
  const [selectedFlow, setSelectedFlow] = useState<FlowLevel>('none');
  const [isPeriodDay, setIsPeriodDay] = useState<boolean>(false);
  const [pain, setPain] = useState<number>(0);
  const [energy, setEnergy] = useState<number>(7);
  const [selectedMoods, setSelectedMoods] = useState<MoodType[]>([]);
  const [notes, setNotes] = useState<string>('');
  const [dateInput, setDateInput] = useState<string>(targetDate);

  // Sync state with existing log when modal opens or targetDate changes
  useEffect(() => {
    if (isOpen) {
      setDateInput(targetDate);
      if (existingLog) {
        setSelectedFlow(existingLog.flow || 'none');
        setIsPeriodDay(existingLog.isPeriodDay || existingLog.flow !== 'none');
        setPain(existingLog.pain ?? 0);
        setEnergy(existingLog.energy ?? 7);
        setSelectedMoods(existingLog.moods || []);
        setNotes(existingLog.notes || '');
      } else {
        // Reset to sensible defaults for new day
        setSelectedFlow('none');
        setIsPeriodDay(false);
        setPain(0);
        setEnergy(7);
        setSelectedMoods(['calm']);
        setNotes('');
      }
    }
  }, [isOpen, targetDate, existingLog]);

  const handleFlowChange = (flow: FlowLevel) => {
    setSelectedFlow(flow);
    if (flow !== 'none') {
      setIsPeriodDay(true);
    }
  };

  const handleTogglePeriodDay = (checked: boolean) => {
    setIsPeriodDay(checked);
    if (!checked) {
      setSelectedFlow('none');
    } else if (selectedFlow === 'none') {
      setSelectedFlow('medium');
    }
  };

  const handleToggleMood = (mood: MoodType) => {
    setSelectedMoods((prev) =>
      prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood]
    );
  };

  const handleSave = () => {
    const finalLog: DayLog = {
      date: dateInput,
      isPeriodDay: isPeriodDay || selectedFlow !== 'none',
      flow: selectedFlow,
      pain,
      energy,
      moods: selectedMoods,
      notes: notes.trim() || undefined,
      updatedAt: new Date().toISOString(),
    };
    onSaveLog(finalLog);
    onClose();
  };

  const handleDelete = () => {
    if (onDeleteLog && existingLog) {
      onDeleteLog(dateInput);
      onClose();
    }
  };

  // Pain helper text
  const getPainLabel = (val: number) => {
    if (val === 0) return 'ไม่ปวดเลย สบายดี';
    if (val <= 3) return 'ปวดตึงเล็กน้อย ยังทำงานได้ปกติ';
    if (val <= 6) return 'ปวดปานกลาง ควรพักผ่อนหรือประคบอุ่น';
    if (val <= 8) return 'ปวดมาก แนะนำทานยาหรือนอนพัก';
    return 'ปวดรุนแรงมาก พักผ่อนทันที';
  };

  // Energy helper text
  const getEnergyLabel = (val: number) => {
    if (val <= 2) return 'หมดพลัง ร่างกายต้องการการพักผ่อน';
    if (val <= 5) return 'มีพลังปานกลาง ทำกิจกรรมเบาๆ ได้';
    if (val <= 8) return 'กระปรี้กระเปร่า มีพลังสดใส';
    return 'พลังงานเต็มเปี่ยม สดชื่นสุดๆ!';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#3F3540]/50 backdrop-blur-xs transition-opacity"
          />

          {/* Sheet / Modal */}
          <motion.div
            initial={{ y: '100%', opacity: 0.8 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0.8 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#FFFFFF] rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 pb-8 sm:p-6 text-[#3F3540] z-10"
          >
            {/* Grab handle for mobile touch */}
            <div className="w-12 h-1.5 bg-[#EEDDE0] rounded-full mx-auto mb-4" />

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#FFF9F6]">
              <div>
                <h2 className="text-lg font-bold text-[#3F3540] flex items-center gap-1.5">
                  <Sparkles size={18} className="text-[#B85C72]" />
                  บันทึกข้อมูลประจำวัน
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-[#3F3540]/70 mt-0.5">
                  <CalendarIcon size={13} className="text-[#D98C9A]" />
                  <span>{formatThaiDateShort(dateInput)}</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {existingLog && onDeleteLog && (
                  <button
                    onClick={handleDelete}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="ลบข้อมูลวันนี้"
                    aria-label="ลบบันทึก"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 text-[#3F3540]/60 hover:text-[#3F3540] hover:bg-[#FFF9F6] rounded-full transition-colors"
                  aria-label="ปิด"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Optional Date Picker input if user wants to change date */}
            <div className="mt-3 flex items-center justify-between px-3 py-2 bg-[#FFF9F6] rounded-xl text-xs">
              <span className="font-medium text-[#3F3540]/80">เลือกวันที่บันทึก:</span>
              <input
                type="date"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                max={formatToDateKey(new Date())}
                className="bg-white border border-[#EEDDE0] rounded-lg px-2.5 py-1 text-xs text-[#3F3540] font-medium outline-none focus:border-[#D98C9A]"
              />
            </div>

            <div className="space-y-5 mt-4">
              {/* 1. Period & Flow Selection */}
              <div className="bg-[#FFF9F6] p-3.5 rounded-2xl border border-[#EEDDE0]/60">
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-sm font-semibold text-[#3F3540] flex items-center gap-1.5">
                    <Droplet
                      size={16}
                      className={isPeriodDay ? 'text-[#B85C72] fill-[#D98C9A]' : 'text-[#3F3540]/50'}
                    />
                    ปริมาณประจำเดือน (Flow)
                  </label>

                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <span className="text-xs text-[#3F3540]/80">มีประจำเดือน</span>
                    <input
                      type="checkbox"
                      checked={isPeriodDay}
                      onChange={(e) => handleTogglePeriodDay(e.target.checked)}
                      className="w-4 h-4 rounded text-[#D98C9A] focus:ring-[#D98C9A] border-gray-300"
                    />
                  </label>
                </div>

                {/* Flow Pill Buttons */}
                <div className="grid grid-cols-4 gap-2">
                  {FLOW_OPTIONS.map((f) => {
                    const isSelected = selectedFlow === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => handleFlowChange(f.id)}
                        className={`py-2 px-1 rounded-xl text-xs flex flex-col items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-[#D98C9A] text-white font-semibold shadow-sm scale-102'
                            : 'bg-white border border-[#EEDDE0] text-[#3F3540] hover:bg-[#EEDDE0]/40'
                        }`}
                      >
                        <div className="flex items-center gap-0.5 mb-1">
                          {f.droplets === 0 ? (
                            <span className="text-xs opacity-50">—</span>
                          ) : (
                            Array.from({ length: f.droplets }).map((_, idx) => (
                              <Droplet
                                key={idx}
                                size={11}
                                className={isSelected ? 'fill-white text-white' : 'fill-[#D98C9A] text-[#D98C9A]'}
                              />
                            ))
                          )}
                        </div>
                        <span className="leading-tight">{f.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Mood Selection */}
              <div>
                <label className="text-sm font-semibold text-[#3F3540] block mb-2">
                  อารมณ์วันนี้ (Mood)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {MOOD_OPTIONS.map((m) => {
                    const isSelected = selectedMoods.includes(m.id);
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => handleToggleMood(m.id)}
                        className={`py-2 px-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all ${
                          isSelected
                            ? 'bg-[#EEDDE0] text-[#B85C72] font-semibold border-2 border-[#D98C9A]'
                            : 'bg-[#FFF9F6] border border-[#EEDDE0]/70 text-[#3F3540] hover:bg-[#EEDDE0]/30'
                        }`}
                      >
                        <span className="text-base">{m.emoji}</span>
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Pain Slider (0 - 10) */}
              <div className="bg-[#FFF9F6] p-3.5 rounded-2xl border border-[#EEDDE0]/60">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-[#3F3540]">
                    ระดับความปวด (Pain):
                  </span>
                  <span className="text-sm font-bold text-[#B85C72] px-2 py-0.5 rounded-lg bg-white border border-[#EEDDE0]">
                    {pain} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={pain}
                  onChange={(e) => setPain(Number(e.target.value))}
                  className="w-full h-2 bg-[#EEDDE0] rounded-lg cursor-pointer my-2"
                />
                <div className="flex justify-between text-[11px] text-[#3F3540]/60 mb-1">
                  <span>0 (ไม่ปวด)</span>
                  <span>5 (ปานกลาง)</span>
                  <span>10 (รุนแรง)</span>
                </div>
                <p className="text-xs text-[#B85C72] font-medium mt-1">
                  💡 {getPainLabel(pain)}
                </p>
              </div>

              {/* 4. Energy Slider (0 - 10) */}
              <div className="bg-[#FFF9F6] p-3.5 rounded-2xl border border-[#EEDDE0]/60">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-[#3F3540]">
                    ระดับพลังงาน (Energy):
                  </span>
                  <span className="text-sm font-bold text-[#B85C72] px-2 py-0.5 rounded-lg bg-white border border-[#EEDDE0]">
                    {energy} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={energy}
                  onChange={(e) => setEnergy(Number(e.target.value))}
                  className="w-full h-2 bg-[#EEDDE0] rounded-lg cursor-pointer my-2"
                />
                <div className="flex justify-between text-[11px] text-[#3F3540]/60 mb-1">
                  <span>0 (หมดพลัง)</span>
                  <span>5 (พอมีแรง)</span>
                  <span>10 (สดชื่นเต็มที่)</span>
                </div>
                <p className="text-xs text-[#B85C72] font-medium mt-1">
                  ⚡ {getEnergyLabel(energy)}
                </p>
              </div>

              {/* 5. Optional Notes */}
              <div>
                <label className="text-sm font-semibold text-[#3F3540] block mb-1.5">
                  โน้ตเพิ่มเติม (Optional Note)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="เช่น ดื่มน้ำอุ่นเยอะๆ, ทานยาแก้ปวด, นอนพักผ่อน..."
                  className="w-full px-3 py-2 text-sm bg-[#FFF9F6] border border-[#EEDDE0] rounded-xl text-[#3F3540] placeholder:text-[#3F3540]/40 outline-none focus:border-[#D98C9A] resize-none"
                />
              </div>

              {/* Submit Save Button */}
              <button
                type="button"
                onClick={handleSave}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-[#D98C9A] to-[#B85C72] text-white font-semibold rounded-2xl shadow-md shadow-[#D98C9A]/30 hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2 text-base"
              >
                <Check size={20} strokeWidth={2.5} />
                บันทึกข้อมูลลงเครื่อง
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
