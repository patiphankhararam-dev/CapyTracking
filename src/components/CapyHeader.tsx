import React from 'react';
import { CapyIcon } from './CapyIcon';
import { CyclePrediction } from '../types';
import { formatThaiDateShort, getTodayKey } from '../utils/dateUtils';
import { Droplet, Sparkles } from 'lucide-react';

interface CapyHeaderProps {
  prediction: CyclePrediction;
  onOpenQuickLog?: () => void;
}

export const CapyHeader: React.FC<CapyHeaderProps> = ({ prediction }) => {
  const todayKey = getTodayKey();
  const dateFormatted = formatThaiDateShort(todayKey);

  return (
    <header className="px-4 pt-4 pb-2 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="relative">
          <CapyIcon size={44} variant={prediction.isCurrentlyPeriod ? 'cozy' : 'happy'} />
          {prediction.isCurrentlyPeriod && (
            <span className="absolute -bottom-1 -right-1 bg-[#D98C9A] text-white p-0.5 rounded-full ring-2 ring-[#FFF9F6]">
              <Droplet size={11} fill="currentColor" />
            </span>
          )}
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-xl font-bold tracking-tight text-[#3F3540]">
              Capy Tracking
            </h1>
            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EEDDE0] text-[#B85C72]">
              <Sparkles size={10} /> Local
            </span>
          </div>
          <p className="text-xs text-[#3F3540]/65">{dateFormatted}</p>
        </div>
      </div>

      <div className="text-right">
        <span
          className={`inline-block text-[11px] font-medium px-2.5 py-1 rounded-full ${
            prediction.isCurrentlyPeriod
              ? 'bg-[#D98C9A] text-white font-semibold shadow-xs'
              : 'bg-[#FFFFFF] text-[#B85C72] border border-[#EEDDE0]'
          }`}
        >
          {prediction.hasData ? (
            prediction.isCurrentlyPeriod
              ? 'มีประจำเดือน'
              : `วันที่ ${prediction.currentCycleDay} ของรอบ`
          ) : (
            'น้องคาปิพร้อมดูแล 🐹'
          )}
        </span>
      </div>
    </header>
  );
};
