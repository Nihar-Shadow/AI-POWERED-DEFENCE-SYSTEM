import { useState, useEffect, useCallback } from 'react';
import { 
  ExclamationTriangleIcon,
  ClockIcon,
  EyeIcon,
  CheckCircleIcon,
  FlagIcon
} from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';

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

interface PredictionPayload {
  lat: number;
  lon: number;
  wind_speed: number;
  temperature: number;
  last_threat_count: number;
}

interface PredictionResponse {
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  risk_score: number;
  timestamp?: string;
  coordinates?: {
    lat: number;
    lon: number;
  };
  environmental_factors?: {
    wind_speed: number;
    temperature: number;
  };
  threat_history?: {
    last_threat_count: number;
  };
  recommendations?: string[];
}

export const ThreatAnalysisPanel = () => {
  const [activeTab, setActiveTab] = useState<'current' | 'history' | 'resolved' | 'flagged'>('current');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [hasNewUpdate, setHasNewUpdate] = useState<boolean>(false);
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
  
  // Function to fetch prediction data from the backend
  const fetchPredictionData = async (): Promise<PredictionResponse> => {
    const payload: PredictionPayload = {
      lat: 28.61,
      lon: 77.20,
      wind_speed: 10,
      temperature: 25,
      last_threat_count: threats.filter(t => t.status === 'active').length
    };

    try {
      // Try to fetch from the actual API
      const response = await fetch('http://localhost:8090/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch prediction data:', error);
      // If API call fails, use mock data as fallback
      return {
        risk_level: 'MEDIUM',
        risk_score: 6.7
      };
    }
  };
  
  // Use React Query to fetch and cache prediction data
  const { data: predictionData, isLoading, isError, refetch } = useQuery({
    queryKey: ['predictionData'],
    queryFn: fetchPredictionData,
    refetchInterval: 5000, // Refetch every 5 seconds for more frequent updates
    staleTime: 2000, // Shorter stale time for more responsive updates
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });
  
  // Update threats based on prediction data
  useEffect(() => {
    if (predictionData) {
      // Generate a new threat based on prediction data
      const newThreat: Threat = {
        id: `T-${Math.floor(Math.random() * 1000)}`,
        type: `${predictionData.risk_level} Risk`,
        severity: predictionData.risk_level === 'HIGH' ? 'high' : 
                 predictionData.risk_level === 'MEDIUM' ? 'medium' : 'low',
        confidence: Math.round(predictionData.risk_score * 10),
        feedId: 'PREDICT',
        timestamp: new Date(),
        status: 'active',
        description: predictionData.recommendations ? 
                    predictionData.recommendations[0] : 
                    `${predictionData.risk_level} risk level detected (score: ${predictionData.risk_score.toFixed(1)})`
      };
      
      // Add the new threat to the list
      setThreats(prev => {
        // Keep only the last 5 threats to avoid cluttering the UI
        const updatedThreats = [newThreat, ...prev.filter(t => t.feedId !== 'PREDICT')];
        return updatedThreats.slice(0, 5);
      });
      
      // Update last update time and show update indicator
      setLastUpdate(new Date());
      setHasNewUpdate(true);
      
      // Reset the update indicator after 3 seconds
      setTimeout(() => {
        setHasNewUpdate(false);
      }, 3000);
    }
  }, [predictionData]);

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
        
        <div className="flex flex-col items-end">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
            <span className="text-xs text-destructive font-mono">
              {threats.filter(t => t.status === 'active').length} ACTIVE
            </span>
          </div>
          
          {/* Prediction Engine Status */}
          <div className="flex items-center space-x-2 mt-1">
            <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : isError ? 'bg-red-500' : hasNewUpdate ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`} />
            <span className={`text-xs font-mono ${hasNewUpdate ? 'text-blue-500 font-bold' : ''}`}>
              PREDICT ENGINE: {isLoading ? 'UPDATING' : isError ? 'ERROR' : hasNewUpdate ? 'NEW DATA' : 'ONLINE'}
            </span>
            {hasNewUpdate && <span className="text-xs text-blue-500 animate-pulse">●</span>}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Last update: {lastUpdate.toLocaleTimeString()}
          </div>
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
                threat.severity === 'high' ? 'border-destructive/50 bg-destructive/5' : 
                threat.feedId === 'PREDICT' ? 'border-primary/50 bg-primary/5' : 'border-border'
              } ${threat.feedId === 'PREDICT' ? 'animate-pulse-slow' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {getSeverityIcon(threat.severity)}
                  
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-sm font-bold text-foreground">
                        {threat.id}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        threat.feedId === 'PREDICT' ? 'bg-primary/20 text-primary font-bold' : 'bg-card-foreground/10'
                      }`}>
                        {threat.type}
                      </span>
                      <span className={`text-xs font-mono ${
                        threat.feedId === 'PREDICT' ? 'text-primary' : 'text-accent'
                      }`}>
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
                      {threat.feedId === 'PREDICT' && (
                        <span className="text-primary text-xs">PREDICTIVE</span>
                      )}
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
          <button 
            className="btn-primary text-xs flex items-center space-x-1"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <span className={`w-3 h-3 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></span>
            <span>{isLoading ? 'UPDATING...' : 'REFRESH PREDICT'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};