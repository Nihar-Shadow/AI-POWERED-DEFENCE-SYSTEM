import { useState, useEffect } from 'react';
import { 
  XMarkIcon,
  ArrowsPointingInIcon,
  PlayIcon,
  PauseIcon,
  EyeIcon,
  EyeSlashIcon,
  MagnifyingGlassIcon,
  CameraIcon,
  MapPinIcon,
  ClockIcon,
  SignalIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface Detection {
  id: string;
  type: string;
  confidence: number;
  bbox: { x: number; y: number; width: number; height: number };
}

interface CameraFeed {
  id: string;
  name: string;
  location: string;
  gps: string;
  isNightVision: boolean;
  isActive: boolean;
  detections: Detection[];
}

interface FullscreenCameraProps {
  feed: CameraFeed;
  isOpen: boolean;
  onClose: () => void;
}

export const FullscreenCamera = ({ feed, isOpen, onClose }: FullscreenCameraProps) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showDetections, setShowDetections] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
    if (e.key === ' ') {
      e.preventDefault();
      setIsPlaying(!isPlaying);
    }
    if (e.key === 'r' || e.key === 'R') {
      setIsRecording(!isRecording);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [isOpen, isPlaying, isRecording]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Main Video Display */}
      <div className="relative w-full h-full">
        {/* Simulated Video Feed */}
        <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
          {/* Video overlay effect */}
          <div className="video-overlay" />
          
          {/* Detection Bounding Boxes */}
          {showDetections && feed.detections.map((detection) => (
            <div
              key={detection.id}
              className="absolute border-2 border-destructive bg-destructive/20"
              style={{
                left: `${detection.bbox.x * zoomLevel}px`,
                top: `${detection.bbox.y * zoomLevel}px`,
                width: `${detection.bbox.width * zoomLevel}px`,
                height: `${detection.bbox.height * zoomLevel}px`,
              }}
            >
              <div className="absolute -top-8 left-0 bg-destructive text-white text-sm px-2 py-1 rounded font-bold">
                {detection.type}: {detection.confidence}%
              </div>
            </div>
          ))}
          
          {/* Scanline effect */}
          <div className="scanline absolute inset-0" />
        </div>

        {/* Top Controls Bar */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/90 to-transparent p-4">
          <div className="flex items-center justify-between">
            {/* Left: Camera Info */}
            <div className="flex items-center space-x-4">
              <div className="bg-black/80 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${feed.isActive ? 'bg-primary animate-pulse' : 'bg-destructive'}`} />
                  <span className="font-mono text-primary font-bold text-lg">{feed.id}</span>
                  {feed.isNightVision && (
                    <EyeIcon className="w-5 h-5 text-accent" title="Night Vision" />
                  )}
                </div>
                <div className="text-foreground font-bold text-lg">{feed.name}</div>
                <div className="text-muted-foreground">{feed.location}</div>
              </div>
              
              <div className="bg-black/80 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-sm">
                  <MapPinIcon className="w-4 h-4 text-muted-foreground" />
                  <span className="font-mono text-muted-foreground">{feed.gps}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <ClockIcon className="w-4 h-4 text-muted-foreground" />
                  <span className="font-mono text-muted-foreground">
                    {currentTime.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Close Button */}
            <button
              onClick={onClose}
              className="p-3 bg-black/80 rounded-lg hover:bg-black/60 transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Bottom Controls Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
          <div className="flex items-center justify-between">
            {/* Left: Playback Controls */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-3 bg-black/80 rounded-lg hover:bg-black/60 transition-colors"
              >
                {isPlaying ? (
                  <PauseIcon className="w-6 h-6 text-white" />
                ) : (
                  <PlayIcon className="w-6 h-6 text-white" />
                )}
              </button>
              
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={`p-3 rounded-lg transition-colors ${
                  isRecording 
                    ? 'bg-destructive text-white' 
                    : 'bg-black/80 text-white hover:bg-black/60'
                }`}
              >
                <CameraIcon className="w-6 h-6" />
              </button>
              
              <button
                onClick={() => setShowDetections(!showDetections)}
                className={`p-3 rounded-lg transition-colors ${
                  showDetections 
                    ? 'bg-primary text-white' 
                    : 'bg-black/80 text-white hover:bg-black/60'
                }`}
              >
                <EyeIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Center: Zoom Controls */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.25))}
                className="p-3 bg-black/80 rounded-lg hover:bg-black/60 transition-colors"
              >
                <MagnifyingGlassIcon className="w-6 h-6 text-white rotate-180" />
              </button>
              
              <div className="bg-black/80 rounded-lg px-4 py-3">
                <span className="font-mono text-white text-lg">{Math.round(zoomLevel * 100)}%</span>
              </div>
              
              <button
                onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.25))}
                className="p-3 bg-black/80 rounded-lg hover:bg-black/60 transition-colors"
              >
                <MagnifyingGlassIcon className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Right: Status Indicators */}
            <div className="flex items-center space-x-3">
              {feed.detections.length > 0 && (
                <div className="bg-destructive/90 rounded-lg px-4 py-3 flex items-center space-x-2">
                  <ExclamationTriangleIcon className="w-5 h-5 text-white" />
                  <span className="text-white font-bold">THREAT DETECTED</span>
                </div>
              )}
              
              <div className="bg-black/80 rounded-lg px-4 py-3 flex items-center space-x-2">
                <SignalIcon className="w-5 h-5 text-green-400" />
                <span className="text-white font-mono">LIVE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel - Detection List */}
        {feed.detections.length > 0 && (
          <div className="absolute top-20 right-4 w-80 bg-black/90 rounded-lg p-4">
            <h3 className="text-white font-bold mb-3 flex items-center space-x-2">
              <ExclamationTriangleIcon className="w-5 h-5 text-destructive" />
              <span>DETECTIONS</span>
            </h3>
            <div className="space-y-2">
              {feed.detections.map((detection) => (
                <div key={detection.id} className="bg-destructive/20 border border-destructive/50 rounded p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold">{detection.type}</span>
                    <span className="text-accent font-mono">{detection.confidence}%</span>
                  </div>
                  <div className="text-muted-foreground text-sm mt-1">
                    Confidence: {detection.confidence}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Keyboard Shortcuts Help */}
        <div className="absolute bottom-20 left-4 bg-black/80 rounded-lg p-3">
          <div className="text-white text-sm space-y-1">
            <div><span className="text-muted-foreground">ESC:</span> Close</div>
            <div><span className="text-muted-foreground">SPACE:</span> Play/Pause</div>
            <div><span className="text-muted-foreground">R:</span> Record</div>
          </div>
        </div>
      </div>
    </div>
  );
};
