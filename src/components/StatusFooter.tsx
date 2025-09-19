import { useState, useEffect } from 'react';
import { 
  ServerIcon, 
  WifiIcon, 
  ClockIcon,
  ShieldCheckIcon,
  SignalIcon 
} from '@heroicons/react/24/outline';

export const StatusFooter = () => {
  const [uptime, setUptime] = useState(0);
  const [latency, setLatency] = useState(12);
  const [serverStatus, setServerStatus] = useState<'online' | 'warning' | 'offline'>('online');

  useEffect(() => {
    const interval = setInterval(() => {
      setUptime(prev => prev + 1);
      // Simulate network latency changes
      setLatency(prev => Math.max(8, Math.min(50, prev + (Math.random() - 0.5) * 4)));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-primary';
      case 'warning': return 'text-warning-amber';
      case 'offline': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <footer className="tactical-panel border-t-2 border-primary/20 px-6 py-2">
      <div className="flex items-center justify-between text-xs font-mono">
        {/* Left: System Status */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <ServerIcon className={`w-4 h-4 ${getStatusColor(serverStatus)}`} />
            <span className="text-muted-foreground">SERVER:</span>
            <span className={getStatusColor(serverStatus)}>
              {serverStatus.toUpperCase()}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <WifiIcon className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">SYNC:</span>
            <span className={latency > 30 ? 'text-warning-amber' : 'text-primary'}>
              {Math.round(latency)}ms
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <ClockIcon className="w-4 h-4 text-accent" />
            <span className="text-muted-foreground">UPTIME:</span>
            <span className="text-accent">{formatUptime(uptime)}</span>
          </div>
        </div>

        {/* Center: Security Status */}
        <div className="flex items-center space-x-2">
          <ShieldCheckIcon className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">SECURITY:</span>
          <span className="text-primary">TLS 1.3 • AES-256</span>
        </div>

        {/* Right: Version Info */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <SignalIcon className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">DATALINK:</span>
            <span className="text-primary">ACTIVE</span>
          </div>
          
          <div className="text-muted-foreground">
            v2.4.1-CLASSIFIED
          </div>
        </div>
      </div>
    </footer>
  );
};