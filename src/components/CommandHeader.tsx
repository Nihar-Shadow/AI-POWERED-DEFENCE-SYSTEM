import {
  ClockIcon,
  UserIcon, 
  SignalIcon,
  BellIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { NotificationPanel } from './NotificationPanel';
import { useNotifications } from '../contexts/NotificationContext';

interface User {
  username: string;
  rank: string;
}

interface CommandHeaderProps {
  missionTime: number;
  currentUser: User | null;
  onLogout: () => void;
}

export const CommandHeader = ({ missionTime, currentUser, onLogout }: CommandHeaderProps) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { notifications, markAsRead, clearAll, unreadCount } = useNotifications();
  
  const formatMissionTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <header className="tactical-panel border-b-2 border-primary/20 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left: Mission Info */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <img src="/images/logo.png" alt="RAKSHAK logo" className="w-10 h-10 object-contain" />
            <h1 className="text-xl font-orbitron font-bold text-primary text-glow">
              RAKSHAK
            </h1>
          </div>
          
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <ClockIcon className="w-4 h-4 text-accent" />
              <span className="text-accent font-mono">
                ELAPSED: {formatMissionTime(missionTime)}
              </span>
            </div>
            
            <div className="text-muted-foreground">
              MISSION: OVERWATCH-ALPHA
            </div>
          </div>
        </div>

        {/* Center: Time */}
        <div className="text-center">
          <div className="text-xs text-muted-foreground">LOCAL TIME</div>
          <div className="font-mono text-lg text-foreground">
            {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* Right: Commander Info & Status */}
        <div className="flex items-center space-x-4">
          <button className="relative p-2 rounded-full hover:bg-card transition-colors">
            <BellIcon className="w-5 h-5 text-muted-foreground" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full animate-pulse" />
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <SignalIcon className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">SECURE</span>
          </div>
          
          <div className="flex items-center space-x-2 px-3 py-1 bg-card rounded-full">
            <UserIcon className="w-4 h-4 text-foreground" />
            <span className="text-sm font-mono">
              {currentUser ? `${currentUser.rank}. ${currentUser.username.toUpperCase()}` : 'UNAUTHORIZED'}
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 px-3 py-1 bg-destructive/20 hover:bg-destructive/30 border border-destructive/30 rounded-full transition-colors"
          >
            <ArrowRightOnRectangleIcon className="w-4 h-4 text-destructive" />
            <span className="text-sm font-mono text-destructive">LOGOUT</span>
          </button>
        </div>
      </div>
    </header>
  );
};