import { useState, useEffect } from 'react';
import { 
  ExclamationTriangleIcon,
  ClockIcon,
  EyeIcon,
  CheckCircleIcon,
  FlagIcon
} from '@heroicons/react/24/outline';

interface Threat {
  id: string;
  type: string;
  severity: 'high' | 'medium' | 'low';
  confidence: number;
  feedId: string;
  timestamp: Date;
  status: 'active' | 'resolved' | 'flagged';
  description: string;
}

export const ThreatAnalysisPanel = () => {
  const [activeTab, setActiveTab] = useState<'current' | 'history' | 'resolved' | 'flagged'>('current');
  const [threats, setThreats] = useState<Threat[]>([
    {
      id: 'T-001',
      type: 'Person',
      severity: 'high',
      confidence: 92,
      feedId: 'CAM-01',
      timestamp: new Date(),
      status: 'active',
      description: 'Unauthorized personnel detected at north perimeter'
    },
    {
      id: 'T-002',
      type: 'Vehicle',
      severity: 'medium',
      confidence: 87,
      feedId: 'CAM-03',
      timestamp: new Date(Date.now() - 300000),
      status: 'active',
      description: 'Unidentified vehicle in restricted zone'
    }
  ]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-warning-amber';
      case 'low': return 'text-accent';
      default: return 'text-muted-foreground';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <ExclamationTriangleIcon className="w-4 h-4 text-destructive threat-glow" />;
      case 'medium': return <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500" />;
      case 'low': return <ExclamationTriangleIcon className="w-4 h-4 text-accent" />;
      default: return <ExclamationTriangleIcon className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const filteredThreats = threats.filter(threat => threat.status === activeTab);

  return (
    <div className="tactical-panel p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-orbitron font-bold text-primary">
          THREAT ANALYSIS
        </h2>
        
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
          <span className="text-xs text-destructive font-mono">
            {threats.filter(t => t.status === 'active').length} ACTIVE
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-4 bg-card rounded border border-border p-1">
        {[
          { key: 'current', label: 'CURRENT', icon: ExclamationTriangleIcon },
          { key: 'history', label: 'HISTORY', icon: ClockIcon },
          { key: 'resolved', label: 'RESOLVED', icon: CheckCircleIcon },
          { key: 'flagged', label: 'FLAGGED', icon: FlagIcon }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`flex items-center space-x-1 px-3 py-2 rounded text-xs font-mono transition-colors ${
              activeTab === key
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="w-3 h-3" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Threat List */}
      <div className="space-y-3 max-h-48 overflow-y-auto">
        {filteredThreats.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <div className="text-4xl mb-2">✓</div>
            <div>NO {activeTab.toUpperCase()} THREATS</div>
          </div>
        ) : (
          filteredThreats.map((threat) => (
            <div 
              key={threat.id}
              className={`bg-card border rounded-lg p-3 ${
                threat.severity === 'high' ? 'border-destructive/50 bg-destructive/5' : 'border-border'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {getSeverityIcon(threat.severity)}
                  
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-sm font-bold text-foreground">
                        {threat.id}
                      </span>
                      <span className="text-xs bg-card-foreground/10 px-2 py-0.5 rounded">
                        {threat.type}
                      </span>
                      <span className="text-xs text-accent font-mono">
                        {threat.feedId}
                      </span>
                    </div>
                    
                    <p className="text-sm text-foreground">
                      {threat.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>
                        Confidence: <span className="text-foreground font-mono">{threat.confidence}%</span>
                      </span>
                      <span>
                        {threat.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-1">
                  <button className="p-1 rounded hover:bg-card-foreground/10 transition-colors">
                    <EyeIcon className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button className="p-1 rounded hover:bg-card-foreground/10 transition-colors">
                    <FlagIcon className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex space-x-2">
          <button className="btn-danger text-xs">
            PAUSE AI
          </button>
          <button className="btn-mission text-xs">
            TAKE CONTROL
          </button>
          <button className="btn-tactical text-xs">
            CLEAR ALL
          </button>
        </div>
      </div>
    </div>
  );
};