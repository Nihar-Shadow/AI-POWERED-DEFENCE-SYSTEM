import { useState, useEffect } from 'react';
import { 
  PlayIcon, 
  PauseIcon, 
  ArrowsPointingOutIcon,
  EyeIcon,
  EyeSlashIcon,
  MapPinIcon,
  SignalIcon,
  Battery100Icon,
  WifiIcon,
  CameraIcon,
  VideoCameraIcon
 } from '@heroicons/react/24/outline';
import { FullscreenCamera } from './FullscreenCamera';

interface CameraFeed {
  id: string;
  name: string;
  location: string;
  gps: string;
  isNightVision: boolean;
  isActive: boolean;
  detections: Detection[];
  type: 'fixed' | 'drone';
  altitude?: number;
  battery?: number;
  signal?: number;
  speed?: number;
  heading?: number;
}

interface Detection {
  id: string;
  type: string;
  confidence: number;
  bbox: { x: number; y: number; width: number; height: number };
}

export const SurveillanceGrid = () => {
  const [activeTab, setActiveTab] = useState<'fixed' | 'drone'>('fixed');
  const [gridSize, setGridSize] = useState<'2x2' | '3x3' | '1x1'>('2x2');
  const [autoRotate, setAutoRotate] = useState(false);
  const [expandedFeed, setExpandedFeed] = useState<string | null>(null);
  const [fullscreenFeed, setFullscreenFeed] = useState<CameraFeed | null>(null);
  const [feeds, setFeeds] = useState<CameraFeed[]>([
    // Fixed Cameras
    {
      id: 'CAM-01',
      name: 'NORTH PERIMETER',
      location: 'GATE ALPHA',
      gps: '35.6762°N, 139.6503°E',
      isNightVision: false,
      isActive: true,
      type: 'fixed',
      detections: [
        { id: '1', type: 'Person', confidence: 92, bbox: { x: 120, y: 80, width: 60, height: 120 } }
      ]
    },
    {
      id: 'CAM-02',
      name: 'EAST CORRIDOR',
      location: 'SECTOR-B',
      gps: '35.6765°N, 139.6510°E',
      isNightVision: true,
      isActive: true,
      type: 'fixed',
      detections: []
    },
    {
      id: 'CAM-03',
      name: 'SOUTH YARD',
      location: 'CHECKPOINT-2',
      gps: '35.6758°N, 139.6498°E',
      isNightVision: false,
      isActive: true,
      type: 'fixed',
      detections: [
        { id: '2', type: 'Vehicle', confidence: 87, bbox: { x: 200, y: 150, width: 100, height: 60 } }
      ]
    },
    {
      id: 'CAM-04',
      name: 'WEST ENTRANCE',
      location: 'MAIN GATE',
      gps: '35.6760°N, 139.6495°E',
      isNightVision: false,
      isActive: false,
      type: 'fixed',
      detections: []
    },
    // Drone Cameras
    {
      id: 'DRONE-01',
      name: 'RAKSHAK-ALPHA',
      location: 'PATROL SECTOR-A',
      gps: '35.6768°N, 139.6515°E',
      isNightVision: true,
      isActive: true,
      type: 'drone',
      altitude: 150,
      battery: 85,
      signal: 92,
      speed: 25,
      heading: 180,
      detections: [
        { id: '3', type: 'Person', confidence: 94, bbox: { x: 80, y: 120, width: 50, height: 100 } }
      ]
    },
    {
      id: 'DRONE-02',
      name: 'RAKSHAK-BRAVO',
      location: 'PATROL SECTOR-B',
      gps: '35.6755°N, 139.6485°E',
      isNightVision: true,
      isActive: true,
      type: 'drone',
      altitude: 120,
      battery: 67,
      signal: 88,
      speed: 18,
      heading: 45,
      detections: []
    },
    {
      id: 'DRONE-03',
      name: 'RAKSHAK-CHARLIE',
      location: 'PATROL SECTOR-C',
      gps: '35.6772°N, 139.6490°E',
      isNightVision: false,
      isActive: true,
      type: 'drone',
      altitude: 200,
      battery: 45,
      signal: 95,
      speed: 30,
      heading: 270,
      detections: [
        { id: '4', type: 'Vehicle', confidence: 91, bbox: { x: 150, y: 90, width: 120, height: 70 } }
      ]
    },
    {
      id: 'DRONE-04',
      name: 'RAKSHAK-DELTA',
      location: 'PATROL SECTOR-D',
      gps: '35.6750°N, 139.6520°E',
      isNightVision: true,
      isActive: false,
      type: 'drone',
      altitude: 0,
      battery: 12,
      signal: 0,
      speed: 0,
      heading: 0,
      detections: []
    }
  ]);

  const getGridClass = () => {
    switch (gridSize) {
      case '1x1': return 'grid-cols-1';
      case '2x2': return 'grid-cols-2';
      case '3x3': return 'grid-cols-3';
      default: return 'grid-cols-2';
    }
  };

  const getFilteredFeeds = () => {
    return feeds.filter(feed => feed.type === activeTab);
  };

  const simulateDetection = () => {
    // Simulate random AI detections
    setFeeds(prev => prev.map(feed => ({
      ...feed,
      detections: Math.random() > 0.7 ? [
        {
          id: Date.now().toString(),
          type: ['Person', 'Vehicle', 'Motion'][Math.floor(Math.random() * 3)],
          confidence: Math.floor(Math.random() * 30 + 70),
          bbox: {
            x: Math.random() * 200,
            y: Math.random() * 100,
            width: 60 + Math.random() * 40,
            height: 80 + Math.random() * 60
          }
        }
      ] : []
    })));
  };

  const updateDroneStatus = () => {
    setFeeds(prev => prev.map(feed => {
      if (feed.type === 'drone' && feed.isActive) {
        return {
          ...feed,
          battery: Math.max(0, (feed.battery || 100) - Math.random() * 2),
          altitude: feed.altitude ? feed.altitude + (Math.random() - 0.5) * 10 : 150,
          speed: feed.speed ? feed.speed + (Math.random() - 0.5) * 5 : 25,
          heading: feed.heading ? (feed.heading + Math.random() * 10) % 360 : 180,
          signal: Math.max(70, (feed.signal || 100) - Math.random() * 3)
        };
      }
      return feed;
    }));
  };

  useEffect(() => {
    const detectionInterval = setInterval(simulateDetection, 3000);
    const droneInterval = setInterval(updateDroneStatus, 2000);
    
    return () => {
      clearInterval(detectionInterval);
      clearInterval(droneInterval);
    };
  }, []);

  const handleFullscreen = (feed: CameraFeed, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Fullscreen button clicked for feed:', feed.id);
    setFullscreenFeed(feed);
  };

  const handleFeedClick = (feedId: string) => {
    if (gridSize === '1x1') {
      // In 1x1 mode, clicking opens fullscreen
      const feed = feeds.find(f => f.id === feedId);
      if (feed) {
        setFullscreenFeed(feed);
      }
    } else {
      // In other modes, clicking expands/collapses
      setExpandedFeed(expandedFeed === feedId ? null : feedId);
    }
  };

  const getBatteryColor = (battery: number) => {
    if (battery > 60) return 'text-green-400';
    if (battery > 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getSignalColor = (signal: number) => {
    if (signal > 80) return 'text-green-400';
    if (signal > 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="tactical-panel p-4 h-full">
      {/* Header Controls */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-orbitron font-bold text-primary">
          SURVEILLANCE GRID
        </h2>
        
        <div className="flex items-center space-x-2">
          {/* Camera Type Tabs */}
          <div className="flex bg-card rounded border border-border">
            <button
              onClick={() => setActiveTab('fixed')}
              className={`px-4 py-2 text-sm font-mono transition-colors flex items-center space-x-2 ${
                activeTab === 'fixed' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <CameraIcon className="w-4 h-4" />
              <span>FIXED CAMS</span>
            </button>
            <button
              onClick={() => setActiveTab('drone')}
              className={`px-4 py-2 text-sm font-mono transition-colors flex items-center space-x-2 ${
                activeTab === 'drone' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <VideoCameraIcon className="w-4 h-4" />
              <span>DRONE CAMS</span>
            </button>
          </div>
          
          {/* Grid Size Toggle */}
          <div className="flex bg-card rounded border border-border">
            {['1x1', '2x2', '3x3'].map((size) => (
              <button
                key={size}
                onClick={() => setGridSize(size as any)}
                className={`px-3 py-1 text-xs font-mono transition-colors ${
                  gridSize === size 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
          
          {/* Auto Rotate */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded transition-colors ${
              autoRotate ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:text-foreground'
            }`}
          >
            {autoRotate ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Status Summary */}
      <div className="flex items-center justify-between mb-4 p-3 bg-card/50 rounded border border-border">
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-400 font-mono">
              {getFilteredFeeds().filter(f => f.isActive).length} ACTIVE
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            <span className="text-red-400 font-mono">
              {getFilteredFeeds().filter(f => !f.isActive).length} OFFLINE
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
            <span className="text-yellow-400 font-mono">
              {getFilteredFeeds().reduce((sum, f) => sum + f.detections.length, 0)} THREATS
            </span>
          </div>
        </div>
        
        {activeTab === 'drone' && (
                      <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <Battery100Icon className="w-4 h-4 text-green-400" />
                <span className="text-muted-foreground">AVG BATTERY:</span>
                <span className="text-green-400 font-mono">
                  {Math.round(getFilteredFeeds().reduce((sum, f) => sum + (f.battery || 0), 0) / getFilteredFeeds().length)}%
                </span>
              </div>
            <div className="flex items-center space-x-1">
              <SignalIcon className="w-4 h-4 text-blue-400" />
              <span className="text-muted-foreground">AVG SIGNAL:</span>
              <span className="text-blue-400 font-mono">
                {Math.round(getFilteredFeeds().reduce((sum, f) => sum + (f.signal || 0), 0) / getFilteredFeeds().length)}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Video Grid */}
      <div className={`grid ${getGridClass()} gap-4 h-[calc(100%-160px)]`}>
        {getFilteredFeeds().slice(0, gridSize === '1x1' ? 1 : gridSize === '2x2' ? 4 : 9).map((feed) => (
          <div 
            key={feed.id} 
            className={`relative bg-black rounded border border-border overflow-hidden group cursor-pointer transition-all duration-300 ${
              expandedFeed === feed.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handleFeedClick(feed.id)}
          >
            {/* Simulated Video Feed */}
            <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 relative">
              {/* Video overlay effect */}
              <div className="video-overlay" />
              
              {/* Detection Bounding Boxes */}
              {feed.detections.map((detection) => (
                <div
                  key={detection.id}
                  className="absolute border-2 border-destructive bg-destructive/20"
                  style={{
                    left: `${detection.bbox.x}px`,
                    top: `${detection.bbox.y}px`,
                    width: `${detection.bbox.width}px`,
                    height: `${detection.bbox.height}px`,
                  }}
                >
                  <div className="absolute -top-6 left-0 bg-destructive text-white text-xs px-1 py-0.5 rounded">
                    {detection.type}: {detection.confidence}%
                  </div>
                </div>
              ))}
              
              {/* Scanline effect */}
              <div className="scanline absolute inset-0" />
            </div>

            {/* Feed Info Overlay */}
            <div className="absolute top-2 left-2 bg-black/80 rounded p-2 text-xs">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${feed.isActive ? 'bg-primary animate-pulse' : 'bg-destructive'}`} />
                <span className="font-mono text-primary font-bold">{feed.id}</span>
                {feed.isNightVision && (
                  <EyeIcon className="w-3 h-3 text-accent" title="Night Vision" />
                )}
              </div>
              <div className="text-foreground font-medium">{feed.name}</div>
              <div className="text-muted-foreground">{feed.location}</div>
              <div className="text-muted-foreground font-mono text-xs">{feed.gps}</div>
              
              {/* Drone-specific info */}
              {feed.type === 'drone' && feed.isActive && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">ALT:</span>
                    <span className="text-accent font-mono">{Math.round(feed.altitude || 0)}m</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">SPD:</span>
                    <span className="text-accent font-mono">{Math.round(feed.speed || 0)}km/h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">HDG:</span>
                    <span className="text-accent font-mono">{Math.round(feed.heading || 0)}°</span>
                  </div>
                </div>
              )}
            </div>

            {/* Drone Status Indicators */}
            {feed.type === 'drone' && (
              <div className="absolute top-2 right-2 flex items-center space-x-1">
                <div className="flex items-center space-x-1 bg-black/80 rounded px-1 py-0.5">
                  <Battery100Icon className={`w-3 h-3 ${getBatteryColor(feed.battery || 0)}`} />
                  <span className={`text-xs font-mono ${getBatteryColor(feed.battery || 0)}`}>
                    {Math.round(feed.battery || 0)}%
                  </span>
                </div>
                <div className="flex items-center space-x-1 bg-black/80 rounded px-1 py-0.5">
                  <SignalIcon className={`w-3 h-3 ${getSignalColor(feed.signal || 0)}`} />
                  <span className={`text-xs font-mono ${getSignalColor(feed.signal || 0)}`}>
                    {Math.round(feed.signal || 0)}%
                  </span>
                </div>
              </div>
            )}

            {/* Fullscreen Button */}
            <button 
              className="absolute bottom-2 right-2 p-2 bg-primary/80 rounded-lg hover:bg-primary transition-all duration-200 hover:scale-110 z-10"
              onClick={(e) => handleFullscreen(feed, e)}
              title="Fullscreen"
            >
              <ArrowsPointingOutIcon className="w-4 h-4 text-white" />
            </button>

            {/* Threat Alert */}
            {feed.detections.length > 0 && (
              <div className="absolute bottom-2 left-2 right-16">
                <div className="bg-destructive text-white text-xs font-bold px-2 py-1 rounded threat-glow">
                  THREAT DETECTED
                </div>
              </div>
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
          </div>
        ))}
      </div>

      {/* Fullscreen Camera Component */}
      {fullscreenFeed && (
        <FullscreenCamera
          feed={fullscreenFeed}
          isOpen={!!fullscreenFeed}
          onClose={() => setFullscreenFeed(null)}
        />
      )}
    </div>
  );
};