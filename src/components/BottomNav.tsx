import React from 'react';
import { Calendar, Home, LineChart, Plus, Settings } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenQuickLog: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenQuickLog,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-t border-[#EEDDE0] shadow-lg max-w-md mx-auto">
      <div className="flex items-center justify-around px-2 py-2 safe-area-bottom">
        {/* Home */}
        <button
          id="nav-home-btn"
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center justify-center flex-1 py-1.5 transition-colors ${
            activeTab === 'home'
              ? 'text-[#B85C72] font-semibold'
              : 'text-[#3F3540]/60 hover:text-[#3F3540]'
          }`}
          aria-label="หน้าแรก"
        >
          <div
            className={`p-1 rounded-xl transition-all ${
              activeTab === 'home' ? 'bg-[#EEDDE0]/60' : ''
            }`}
          >
            <Home size={22} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
          </div>
          <span className="text-[11px] mt-0.5 tracking-tight">หน้าแรก</span>
        </button>

        {/* Calendar */}
        <button
          id="nav-calendar-btn"
          onClick={() => onSelectTab('calendar')}
          className={`flex flex-col items-center justify-center flex-1 py-1.5 transition-colors ${
            activeTab === 'calendar'
              ? 'text-[#B85C72] font-semibold'
              : 'text-[#3F3540]/60 hover:text-[#3F3540]'
          }`}
          aria-label="ปฏิทิน"
        >
          <div
            className={`p-1 rounded-xl transition-all ${
              activeTab === 'calendar' ? 'bg-[#EEDDE0]/60' : ''
            }`}
          >
            <Calendar size={22} strokeWidth={activeTab === 'calendar' ? 2.5 : 2} />
          </div>
          <span className="text-[11px] mt-0.5 tracking-tight">ปฏิทิน</span>
        </button>

        {/* Quick Log - Prominent Center Floating Button */}
        <div className="flex-1 flex flex-col items-center -mt-5">
          <button
            id="nav-quick-log-btn"
            onClick={onOpenQuickLog}
            className="w-13 h-13 rounded-full bg-gradient-to-tr from-[#B85C72] to-[#D98C9A] text-white flex items-center justify-center shadow-lg shadow-[#D98C9A]/40 hover:scale-105 active:scale-95 transition-transform"
            aria-label="บันทึกด่วน Quick Log"
          >
            <Plus size={28} strokeWidth={2.8} />
          </button>
          <span className="text-[11px] font-medium text-[#B85C72] mt-1 tracking-tight">
            บันทึกด่วน
          </span>
        </div>

        {/* Insights */}
        <button
          id="nav-insights-btn"
          onClick={() => onSelectTab('insights')}
          className={`flex flex-col items-center justify-center flex-1 py-1.5 transition-colors ${
            activeTab === 'insights'
              ? 'text-[#B85C72] font-semibold'
              : 'text-[#3F3540]/60 hover:text-[#3F3540]'
          }`}
          aria-label="ข้อมูลเชิงลึก"
        >
          <div
            className={`p-1 rounded-xl transition-all ${
              activeTab === 'insights' ? 'bg-[#EEDDE0]/60' : ''
            }`}
          >
            <LineChart size={22} strokeWidth={activeTab === 'insights' ? 2.5 : 2} />
          </div>
          <span className="text-[11px] mt-0.5 tracking-tight">สถิติ</span>
        </button>

        {/* Settings */}
        <button
          id="nav-settings-btn"
          onClick={() => onSelectTab('settings')}
          className={`flex flex-col items-center justify-center flex-1 py-1.5 transition-colors ${
            activeTab === 'settings'
              ? 'text-[#B85C72] font-semibold'
              : 'text-[#3F3540]/60 hover:text-[#3F3540]'
          }`}
          aria-label="ตั้งค่า"
        >
          <div
            className={`p-1 rounded-xl transition-all ${
              activeTab === 'settings' ? 'bg-[#EEDDE0]/60' : ''
            }`}
          >
            <Settings size={22} strokeWidth={activeTab === 'settings' ? 2.5 : 2} />
          </div>
          <span className="text-[11px] mt-0.5 tracking-tight">ตั้งค่า</span>
        </button>
      </div>
    </div>
  );
};
