import React, { useState, useEffect, useMemo } from 'react';
import { ActiveTab, DayLog, UserSettings } from './types';
import {
  getStoredLogs,
  saveStoredLogs,
  getStoredSettings,
  saveStoredSettings,
} from './utils/storage';
import { calculateCyclePrediction, getTodayKey } from './utils/dateUtils';
import { CapyHeader } from './components/CapyHeader';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { CalendarView } from './components/CalendarView';
import { InsightsView } from './components/InsightsView';
import { SettingsView } from './components/SettingsView';
import { QuickLogModal } from './components/QuickLogModal';
import { FirstSetupView } from './components/FirstSetupView';
import { Check } from 'lucide-react';

export default function App() {
  const [logs, setLogs] = useState<Record<string, DayLog>>({});
  const [settings, setSettings] = useState<UserSettings>(() => getStoredSettings());
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isQuickLogOpen, setIsQuickLogOpen] = useState<boolean>(false);
  const [targetLogDate, setTargetLogDate] = useState<string>(getTodayKey());
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPromptingFirstSetup, setIsPromptingFirstSetup] = useState<boolean>(false);

  // Initialize data on mount
  useEffect(() => {
    const loadedLogs = getStoredLogs();
    const loadedSettings = getStoredSettings();
    setLogs(loadedLogs);
    setSettings(loadedSettings);
  }, []);

  // Compute cycle predictions reactively whenever logs or settings change
  const prediction = useMemo(() => {
    return calculateCyclePrediction(logs, settings);
  }, [logs, settings]);

  const todayKey = getTodayKey();
  const todayLog = logs[todayKey];

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Save or update a day's log
  const handleSaveLog = (savedLog: DayLog) => {
    const updated = {
      ...logs,
      [savedLog.date]: savedLog,
    };
    setLogs(updated);
    saveStoredLogs(updated);

    // If period day, update lastPeriodDate if newer or not set
    if (savedLog.isPeriodDay || savedLog.flow !== 'none') {
      if (!settings.lastPeriodDate || savedLog.date >= settings.lastPeriodDate) {
        const updatedSettings: UserSettings = {
          ...settings,
          lastPeriodDate: savedLog.date,
          hasCompletedOnboarding: true,
        };
        setSettings(updatedSettings);
        saveStoredSettings(updatedSettings);
      }
    }

    triggerToast('บันทึกข้อมูลเรียบร้อยแล้ว ✨');
  };

  // Delete a day's log
  const handleDeleteLog = (dateKey: string) => {
    const updated = { ...logs };
    delete updated[dateKey];
    setLogs(updated);
    saveStoredLogs(updated);
    triggerToast('ลบข้อมูลเรียบร้อยแล้ว');
  };

  // Open quick log for a specific date or today
  const handleOpenQuickLog = (date?: string) => {
    setTargetLogDate(date || getTodayKey());
    setIsQuickLogOpen(true);
  };

  // Update user settings
  const handleUpdateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    saveStoredSettings(newSettings);
  };

  // Reload data (after import or reset)
  const handleReloadData = () => {
    const loadedLogs = getStoredLogs();
    const loadedSettings = getStoredSettings();
    setLogs(loadedLogs);
    setSettings(loadedSettings);
    setIsPromptingFirstSetup(false);
  };

  // First Setup: User submits their first period start date
  const handleFirstSetupStart = (selectedDate: string) => {
    const firstPeriodLog: DayLog = {
      date: selectedDate,
      isPeriodDay: true,
      flow: 'medium',
      pain: 0,
      energy: 7,
      moods: ['calm'],
      notes: 'วันแรกของรอบเดือน',
      updatedAt: new Date().toISOString(),
    };

    const updatedLogs = {
      ...logs,
      [selectedDate]: firstPeriodLog,
    };
    setLogs(updatedLogs);
    saveStoredLogs(updatedLogs);

    const updatedSettings: UserSettings = {
      ...settings,
      lastPeriodDate: selectedDate,
      hasCompletedOnboarding: true,
    };
    setSettings(updatedSettings);
    saveStoredSettings(updatedSettings);
    setIsPromptingFirstSetup(false);

    triggerToast('เริ่มต้นการติดตามรอบเดือนเรียบร้อย! คาปิพร้อมดูแลนะ 🐹💗');
  };

  // First Setup: User clicks "ข้ามไปก่อน" -> enter Empty State
  const handleFirstSetupSkip = () => {
    const updatedSettings: UserSettings = {
      ...settings,
      hasCompletedOnboarding: true,
    };
    setSettings(updatedSettings);
    saveStoredSettings(updatedSettings);
    setIsPromptingFirstSetup(false);
  };

  // Is user in initial first setup mode?
  const isFirstTimeVisitor = (!settings.hasCompletedOnboarding && !prediction.hasData) || isPromptingFirstSetup;

  return (
    <div className="min-h-screen bg-[#F6EDE8] flex flex-col items-center justify-start sm:py-6">
      {/* Mobile-first centered app shell */}
      <main className="w-full max-w-md min-h-screen sm:min-h-[844px] bg-[#FFF9F6] shadow-xl sm:rounded-[36px] sm:border sm:border-[#EEDDE0]/80 relative flex flex-col overflow-x-hidden">
        {/* App Top Header */}
        <CapyHeader
          prediction={prediction}
          onOpenQuickLog={() => handleOpenQuickLog()}
        />

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#3F3540] text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
            <Check size={16} className="text-[#D98C9A]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* View Switcher based on Active Tab */}
        <div className="flex-1">
          {activeTab === 'home' && (
            isFirstTimeVisitor ? (
              <FirstSetupView
                onStartTracking={handleFirstSetupStart}
                onSkip={handleFirstSetupSkip}
              />
            ) : (
              <HomeView
                prediction={prediction}
                todayLog={todayLog}
                allLogs={logs}
                onOpenQuickLog={handleOpenQuickLog}
                onNavigateToCalendar={() => setActiveTab('calendar')}
                onRecordFirstPeriod={() => setIsPromptingFirstSetup(true)}
              />
            )
          )}

          {activeTab === 'calendar' && (
            <CalendarView
              logs={logs}
              prediction={prediction}
              onOpenLogForDate={handleOpenQuickLog}
            />
          )}

          {activeTab === 'insights' && (
            <InsightsView logs={logs} prediction={prediction} settings={settings} />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              settings={settings}
              logs={logs}
              onUpdateSettings={handleUpdateSettings}
              onReloadData={handleReloadData}
            />
          )}
        </div>

        {/* Bottom Navigation */}
        <BottomNav
          activeTab={activeTab}
          onSelectTab={(tab) => {
            if (isPromptingFirstSetup) setIsPromptingFirstSetup(false);
            setActiveTab(tab);
          }}
          onOpenQuickLog={() => handleOpenQuickLog()}
        />

        {/* Quick Log Modal (Bottom Sheet) */}
        <QuickLogModal
          isOpen={isQuickLogOpen}
          onClose={() => setIsQuickLogOpen(false)}
          targetDate={targetLogDate}
          existingLog={logs[targetLogDate]}
          onSaveLog={handleSaveLog}
          onDeleteLog={handleDeleteLog}
        />
      </main>
    </div>
  );
}
