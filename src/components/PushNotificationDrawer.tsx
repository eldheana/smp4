import React from 'react';
import { 
  X, 
  Bell, 
  CheckCircle2, 
  Clock, 
  Zap, 
  Calendar, 
  Radio, 
  CheckCheck,
  ShieldAlert
} from 'lucide-react';
import { PushNotification } from '../types';

interface PushNotificationDrawerProps {
  notifications: PushNotification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAllAsRead: () => void;
  onRequestWebNotificationPermission: () => void;
}

export const PushNotificationDrawer: React.FC<PushNotificationDrawerProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkAllAsRead,
  onRequestWebNotificationPermission
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 w-full max-w-sm h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Notifikasi Kompetisi
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onMarkAllAsRead}
              className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:underline"
              title="Tandai semua terbaca"
            >
              Tandai Dibaca
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Web Notification Permission Prompt */}
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/60 flex items-center justify-between text-xs">
          <div className="text-[11px] text-amber-900 dark:text-amber-200 pr-2">
            Aktifkan notifikasi peramban untuk pengingat giliran bel babak rebutan.
          </div>
          <button
            onClick={onRequestWebNotificationPermission}
            className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500 hover:bg-amber-600 text-white shrink-0 shadow-sm"
          >
            Izinkan
          </button>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 p-2">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Belum ada notifikasi baru saat ini.
            </div>
          ) : (
            notifications.map((n) => {
              const Icon = n.type === 'buzzer_turn' ? Zap : n.type === 'round_start' ? Radio : Calendar;

              return (
                <div 
                  key={n.id}
                  className={`p-3 rounded-xl transition ${
                    !n.read 
                      ? 'bg-amber-50/60 dark:bg-amber-950/30 border-l-4 border-amber-500' 
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-start space-x-2.5">
                    <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300 shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                          {n.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {n.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                        {n.message}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
