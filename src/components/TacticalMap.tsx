
import { useEffect, useRef, useState, useCallback } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { 
  MapPinIcon, 
  UserGroupIcon, 
  EyeIcon, 
  FireIcon,
  ExclamationTriangleIcon,
  SignalIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  ShieldExclamationIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface MapPoint {
  id: string;
  type: 'threat' | 'friendly' | 'camera';
  name: string;
  lat: number;
  lng: number;
  status?: string;
}

interface HeatMapData {
  id: string;
  type: 'activity' | 'threat' | 'movement';
  intensity: number;
  lat: number;
  lng: number;
  radius: number;
}

interface MapView {
  zoom: number;
  offsetX: number;
  offsetY: number;
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
  timestamp: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  environmental_factors: {
    wind_speed: number;
    temperature: number;
  };
  threat_history: {
    last_threat_count: number;
  };
  recommendations: string[];
}

export const TacticalMap = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heatMapRef = useRef<HTMLCanvasElement>(null);
  const [predictionData, setPredictionData] = useState<PredictionResponse | null>(null);
  const [predictionError, setPredictionError] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const { addNotification } = useNotifications();
  const [mapPoints] = useState<MapPoint[]>([
    { id: 'threat-1', type: 'threat', name: 'Active Threat', lat: 35.6762, lng: 139.6503 },
    { id: 'threat-2', type: 'threat', name: 'Suspicious Activity', lat: 35.6768, lng: 139.6512 },
    { id: 'friendly-1', type: 'friendly', name: 'Alpha Team', lat: 35.6765, lng: 139.6510 },
    { id: 'friendly-2', type: 'friendly', name: 'Bravo Team', lat: 35.6758, lng: 139.6498 },
    { id: 'friendly-3', type: 'friendly', name: 'Charlie Team', lat: 35.6772, lng: 139.6508 },
    { id: 'camera-1', type: 'camera', name: 'CAM-01', lat: 35.6760, lng: 139.6505 },
    { id: 'camera-2', type: 'camera', name: 'CAM-02', lat: 35.6770, lng: 139.6515 },
    { id: 'camera-3', type: 'camera', name: 'CAM-03', lat: 35.6755, lng: 139.6490 },
    { id: 'camera-4', type: 'camera', name: 'CAM-04', lat: 35.6768, lng: 139.6495 },
  ]);

  const [heatMapData] = useState<HeatMapData[]>([
    { id: 'heat-1', type: 'activity', intensity: 0.8, lat: 35.6762, lng: 139.6503, radius: 50 },
    { id: 'heat-2', type: 'threat', intensity: 0.9, lat: 35.6768, lng: 139.6512, radius: 40 },
    { id: 'heat-3', type: 'movement', intensity: 0.6, lat: 35.6765, lng: 139.6510, radius: 60 },
    { id: 'heat-4', type: 'activity', intensity: 0.4, lat: 35.6758, lng: 139.6498, radius: 30 },
  ]);

  const [selectedHeatMap, setSelectedHeatMap] = useState<'activity' | 'threat' | 'movement'>('activity');
  const [tacticalMapView, setTacticalMapView] = useState<MapView>({ zoom: 1, offsetX: 0, offsetY: 0 });
  const [heatMapView, setHeatMapView] = useState<MapView>({ zoom: 1, offsetX: 0, offsetY: 0 });
  
  // Mouse interaction states
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeMap, setActiveMap] = useState<'tactical' | 'heat'>('tactical');

  // Consolidated mouse event handlers
  const handleMouseDown = (e: React.MouseEvent, mapType: 'tactical' | 'heat') => {
    setIsDragging(true);
    setActiveMap(mapType);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    if (activeMap === 'tactical') {
      setTacticalMapView(prev => ({
        ...prev,
        offsetX: prev.offsetX + deltaX,
        offsetY: prev.offsetY + deltaY
      }));
    } else {
      setHeatMapView(prev => ({
        ...prev,
        offsetX: prev.offsetX + deltaX,
        offsetY: prev.offsetY + deltaY
      }));
    }
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent, mapType: 'tactical' | 'heat') => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    
    if (mapType === 'tactical') {
      const newZoom = Math.max(0.5, Math.min(3, tacticalMapView.zoom * zoomFactor));
      setTacticalMapView(prev => ({ ...prev, zoom: newZoom }));
    } else {
      const newZoom = Math.max(0.5, Math.min(3, heatMapView.zoom * zoomFactor));
      setHeatMapView(prev => ({ ...prev, zoom: newZoom }));
    }
  };

  // Function to fetch prediction data
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchPredictionData = useCallback(async () => {
    setIsLoading(true);
    const payload: PredictionPayload = {
      lat: 28.61,
      lon: 77.20,
      wind_speed: 10,
      temperature: 25,
      last_threat_count: 2
    };

    try {
      // Mock prediction data since the server is offline
      const mockData: PredictionResponse = {
        risk_level: 'MEDIUM',
        risk_score: 6.7,
        timestamp: new Date().toISOString(),
        coordinates: {
          lat: payload.lat,
          lon: payload.lon
        },
        environmental_factors: {
          wind_speed: payload.wind_speed,
          temperature: payload.temperature
        },
        threat_history: {
          last_threat_count: payload.last_threat_count
        },
        recommendations: [
          "Increase patrol frequency in sector A-7",
          "Deploy additional surveillance in high-risk areas",
          "Monitor weather conditions for visibility impact"
        ]
      };
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('Mock Prediction:', mockData);
      setPredictionData(mockData);
      setPredictionError(false);
      
      // Generate notification based on risk level
      const severity = mockData.risk_level === 'HIGH' ? 'high' : 
                      mockData.risk_level === 'MEDIUM' ? 'medium' : 'low';
      
      // Generate random sector for the prediction
      const sector = `${String.fromCharCode(65 + Math.floor(Math.random() * 5))}-${Math.floor(Math.random() * 9) + 1}`;
      
      // Determine threat type based on risk level
      const threatType = mockData.risk_level === 'HIGH' ? 'Critical Security Alert' :
                        mockData.risk_level === 'MEDIUM' ? 'Elevated Risk Warning' : 'Routine Monitoring Alert';
                      
      addNotification({
        title: `${mockData.risk_level} Risk Level Detected`,
        message: `Risk score: ${mockData.risk_score.toFixed(1)} in sector ${sector}. Environmental factors: Wind ${mockData.environmental_factors.wind_speed}km/h, Temp ${mockData.environmental_factors.temperature}°C. ${mockData.recommendations[0]}`,
        severity: severity as 'high' | 'medium' | 'low',
        threatType: threatType,
        sector: sector,
        coordinates: `${mockData.coordinates.lat.toFixed(4)}, ${mockData.coordinates.lon.toFixed(4)}`
      });
      
      // Commented out actual API call since server is offline
      /*
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Prediction:', data);
      setPredictionData(data);
      setPredictionError(false);
      */
    } catch (error) {
      console.error('Failed to fetch prediction data:', error);
      setPredictionError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Function to generate notifications for threat points
  const generateThreatNotifications = useCallback(() => {
    // Get threat points
    const threatPoints = mapPoints.filter(point => point.type === 'threat');
    
    // Threat types with detailed descriptions
    const threatTypes = {
      'Active Threat': 'Armed hostile entity with confirmed aggressive intent',
      'Suspicious Activity': 'Unidentified movement pattern indicating potential hostile action',
      'Perimeter Breach': 'Security boundary compromised by unknown entity',
      'Unauthorized Access': 'Entry detected in restricted area without proper clearance',
      'Sensor Trigger': 'Perimeter detection system activated by unidentified presence'
    };
    
    // Generate a notification for each threat point
    threatPoints.forEach(threat => {
      const threatDescription = threatTypes[threat.name as keyof typeof threatTypes] || 'Unknown threat type';
      const sector = `${String.fromCharCode(65 + Math.floor(Math.random() * 5))}-${Math.floor(Math.random() * 9) + 1}`;
      
      addNotification({
        title: `Threat Alert: ${threat.name}`,
        message: `${threatDescription} in sector ${sector}. Coordinates: ${threat.lat.toFixed(4)}, ${threat.lng.toFixed(4)}`,
        severity: 'high',
        threatType: threat.name,
        sector: sector,
        coordinates: `${threat.lat.toFixed(4)}, ${threat.lng.toFixed(4)}`
      });
    });
  }, [mapPoints, addNotification]);

  // Initial fetch on component mount
  useEffect(() => {
    fetchPredictionData();
    // Generate initial threat notifications with a slight delay
    const timer = setTimeout(() => {
      generateThreatNotifications();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [fetchPredictionData, generateThreatNotifications]);

  // Auto-update every 15 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchPredictionData();
    }, 15000);

    return () => clearInterval(intervalId);
  }, [fetchPredictionData]);
  
  // Simulate random threat notifications
  useEffect(() => {
    const simulateRandomThreat = () => {
      // Comprehensive threat types with detailed descriptions
      const threatDetails = [
        {
          type: 'Unauthorized Access',
          description: 'Security breach detected with unauthorized credentials',
          response: 'Deploy security team for immediate containment'
        },
        {
          type: 'Suspicious Movement',
          description: 'Irregular movement pattern detected by motion sensors',
          response: 'Increase surveillance in affected area'
        },
        {
          type: 'Perimeter Breach',
          description: 'Physical security barrier compromised',
          response: 'Lock down affected sector and deploy response team'
        },
        {
          type: 'Unidentified Vehicle',
          description: 'Vehicle without proper identification in restricted zone',
          response: 'Dispatch patrol to intercept and identify'
        },
        {
          type: 'Sensor Trigger',
          description: 'Multiple security sensors activated simultaneously',
          response: 'Initiate full spectrum scan of affected area'
        },
        {
          type: 'Communication Disruption',
          description: 'Interference detected in secure communication channels',
          response: 'Switch to backup frequency and trace source'
        },
        {
          type: 'Drone Detection',
          description: 'Unauthorized aerial vehicle in restricted airspace',
          response: 'Activate counter-drone measures'
        },
        {
          type: 'Cyber Intrusion',
          description: 'Attempted breach of digital security systems',
          response: 'Isolate affected systems and trace attack vector'
        }
      ];
      
      // Generate random coordinates
      const lat = 35.67 + (Math.random() * 0.01);
      const lng = 139.65 + (Math.random() * 0.01);
      
      // Generate random sector
      const sectors = ['A-1', 'B-3', 'C-7', 'D-2', 'E-5', 'F-9', 'G-4', 'H-6'];
      const randomSector = sectors[Math.floor(Math.random() * sectors.length)];
      
      // Select random threat
      const randomThreat = threatDetails[Math.floor(Math.random() * threatDetails.length)];
      const severity = Math.random() > 0.7 ? 'high' : 'medium';
      
      addNotification({
        title: `New Threat: ${randomThreat.type}`,
        message: `${randomThreat.description} in sector ${randomSector}. ${randomThreat.response}. Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        severity: severity,
        threatType: randomThreat.type,
        sector: randomSector,
        coordinates: `${lat.toFixed(4)}, ${lng.toFixed(4)}`
      });
    };
    
    // Simulate a new threat every 15-30 seconds to make testing easier
    const intervalId = setInterval(() => {
      if (Math.random() > 0.3) { // 70% chance to generate a notification
        simulateRandomThreat();
      }
    }, 15000);
    
    return () => clearInterval(intervalId);
  }, [addNotification]);

  // Global mouse up handler
  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, []);

  // Tactical Map Drawing Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const drawTacticalMap = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(tacticalMapView.offsetX, tacticalMapView.offsetY);
      ctx.scale(tacticalMapView.zoom, tacticalMapView.zoom);

      // Draw grid
      ctx.strokeStyle = 'rgba(0, 255, 115, 0.1)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i <= canvas.height; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Draw map points
      mapPoints.forEach((point) => {
        const x = ((point.lng - 139.645) / 0.01) * canvas.width;
        const y = canvas.height - ((point.lat - 35.674) / 0.004) * canvas.height;

        ctx.save();
        switch (point.type) {
          case 'threat':
            ctx.fillStyle = '#ff4c4c';
            ctx.shadowColor = '#ff4c4c';
            ctx.shadowBlur = 10;
            break;
          case 'friendly':
            ctx.fillStyle = '#00ff73';
            ctx.shadowColor = '#00ff73';
            ctx.shadowBlur = 8;
            break;
          case 'camera':
            ctx.fillStyle = '#3399ff';
            ctx.shadowColor = '#3399ff';
            ctx.shadowBlur = 6;
            break;
        }

        ctx.beginPath();
        ctx.arc(x, y, point.type === 'threat' ? 6 : 4, 0, 2 * Math.PI);
        ctx.fill();

        if (point.type === 'threat') {
          ctx.strokeStyle = '#ff4c4c';
          ctx.lineWidth = 2;
          ctx.globalAlpha = 0.5;
          ctx.beginPath();
          ctx.arc(x, y, 12, 0, 2 * Math.PI);
          ctx.stroke();
        }
        ctx.restore();
      });

      // Draw connections
      const friendlyUnits = mapPoints.filter(p => p.type === 'friendly');
      if (friendlyUnits.length > 1) {
        ctx.strokeStyle = 'rgba(0, 255, 115, 0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 4]);
        for (let i = 0; i < friendlyUnits.length - 1; i++) {
          const from = friendlyUnits[i];
          const to = friendlyUnits[i + 1];
          const x1 = ((from.lng - 139.645) / 0.01) * canvas.width;
          const y1 = canvas.height - ((from.lat - 35.674) / 0.004) * canvas.height;
          const x2 = ((to.lng - 139.645) / 0.01) * canvas.width;
          const y2 = canvas.height - ((to.lat - 35.674) / 0.004) * canvas.height;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
        ctx.setLineDash([]);
      }
      ctx.restore();
      animationFrameId = requestAnimationFrame(drawTacticalMap);
    };

    drawTacticalMap();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [mapPoints, tacticalMapView]);

  // Heat Map Drawing Effect
  useEffect(() => {
    const canvas = heatMapRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const drawHeatMap = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(heatMapView.offsetX, heatMapView.offsetY);
      ctx.scale(heatMapView.zoom, heatMapView.zoom);

      const filteredData = heatMapData.filter(d => d.type === selectedHeatMap);

      filteredData.forEach(point => {
        const x = ((point.lng - 139.645) / 0.01) * canvas.width;
        const y = canvas.height - ((point.lat - 35.674) / 0.004) * canvas.height;
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, point.radius);
        gradient.addColorStop(0, `rgba(${selectedHeatMap === 'threat' ? '255, 0, 0' : selectedHeatMap === 'activity' ? '255, 165, 0' : '0, 255, 255'}, ${point.intensity * 0.5})`);
        gradient.addColorStop(1, `rgba(${selectedHeatMap === 'threat' ? '255, 0, 0' : selectedHeatMap === 'activity' ? '255, 165, 0' : '0, 255, 255'}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, point.radius, 0, 2 * Math.PI);
        ctx.fill();
      });

      ctx.restore();
      animationFrameId = requestAnimationFrame(drawHeatMap);
    };

    drawHeatMap();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [heatMapData, heatMapView, selectedHeatMap]);

  // Helper function to get background color based on risk level
  const getRiskBackgroundColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'LOW':
        return 'bg-green-600';
      case 'MEDIUM':
        return 'bg-orange-500';
      case 'HIGH':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div className="h-full flex flex-col bg-background text-foreground font-sans relative">
      {/* Predictive Threat Engine Status Panel */}
      {predictionError ? (
        <div className="absolute top-4 right-4 z-50 bg-red-600/90 text-white px-3 py-2 rounded-md border border-red-400 shadow-lg flex items-center space-x-2">
          <ShieldExclamationIcon className="w-5 h-5" />
          <span className="text-sm font-mono font-semibold tracking-wide">Predictive Engine Offline</span>
        </div>
      ) : predictionData && (
        <div 
          onClick={() => setShowDetailsModal(true)}
          className={`absolute top-4 right-4 z-50 ${getRiskBackgroundColor(predictionData.risk_level)}/90 text-white px-3 py-2 rounded-md border border-gray-700 shadow-lg backdrop-blur-sm cursor-pointer hover:brightness-110 transition-all`}
        >
          <div className="text-sm font-mono font-semibold tracking-wide flex items-center space-x-2">
            <span>Risk: {predictionData.risk_level} (score: {predictionData.risk_score.toFixed(2)})</span>
            <span className="text-xs opacity-70">Click for details</span>
          </div>
        </div>
      )}
      
      {/* Detailed Prediction Results Modal */}
      {showDetailsModal && predictionData && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
            <button 
              onClick={() => setShowDetailsModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
            
            <h3 className="text-lg font-orbitron font-bold text-primary mb-4">PREDICTIVE THREAT ENGINE ANALYSIS</h3>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground">RISK ASSESSMENT</h4>
                  <div className={`text-2xl font-mono font-bold ${predictionData.risk_level === 'HIGH' ? 'text-red-500' : predictionData.risk_level === 'MEDIUM' ? 'text-orange-500' : 'text-green-500'}`}>
                    {predictionData.risk_level}
                  </div>
                  <div className="text-lg font-mono">
                    Score: {predictionData.risk_score.toFixed(2)}/10
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground">LOCATION DATA</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Latitude: <span className="font-mono">{predictionData.coordinates.lat}</span></div>
                    <div>Longitude: <span className="font-mono">{predictionData.coordinates.lon}</span></div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground">ENVIRONMENTAL FACTORS</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Wind Speed: <span className="font-mono">{predictionData.environmental_factors.wind_speed} km/h</span></div>
                    <div>Temperature: <span className="font-mono">{predictionData.environmental_factors.temperature}°C</span></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground">THREAT HISTORY</h4>
                  <div className="text-sm">Previous Threats: <span className="font-mono">{predictionData.threat_history.last_threat_count}</span></div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground">RECOMMENDATIONS</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {predictionData.recommendations.map((rec, index) => (
                  <li key={index} className="font-mono">{rec}</li>
                ))}
              </ul>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-mono text-sm"
              >
                CLOSE REPORT
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="p-4 border-b border-border bg-card/50">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-orbitron font-bold text-primary">SENTINEL COMMAND</h2>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <ClockIcon className="w-4 h-4 text-muted-foreground" />
              <span className="font-mono text-muted-foreground">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Half - Tactical Map */}
        <div className="w-1/2 p-4 border-r border-border">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-orbitron font-bold text-primary">TACTICAL OVERVIEW</h3>
              <div className="flex items-center space-x-3 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-destructive rounded-full" />
                  <span className="text-muted-foreground">THREATS</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-muted-foreground">FRIENDLY</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-accent rounded-full" />
                  <span className="text-muted-foreground">CAMERAS</span>
                </div>
              </div>
            </div>

            <div 
              className="relative bg-black/50 rounded border border-border overflow-hidden flex-1 cursor-grab active:cursor-grabbing"
              onMouseDown={(e) => handleMouseDown(e, 'tactical')}
              onMouseMove={handleMouseMove}
              onWheel={(e) => handleWheel(e, 'tactical')}
            >
              <canvas
                ref={canvasRef}
                width={400}
                height={300}
                className="w-full h-full"
              />
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-primary/30 rounded-full animate-ping" />
              </div>
              <div className="absolute top-2 right-2 bg-black/80 rounded px-2 py-1 text-xs text-white">
                {Math.round(tacticalMapView.zoom * 100)}%
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
              <div className="flex items-center space-x-1">
                <ExclamationTriangleIcon className="w-3 h-3 text-destructive" />
                <span className="text-muted-foreground">
                  {mapPoints.filter(p => p.type === 'threat').length} THREATS
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <UserGroupIcon className="w-3 h-3 text-primary" />
                <span className="text-muted-foreground">
                  {mapPoints.filter(p => p.type === 'friendly').length} UNITS
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <EyeIcon className="w-3 h-3 text-accent" />
                <span className="text-muted-foreground">
                  {mapPoints.filter(p => p.type === 'camera').length} CAMERAS
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Half - Heat Maps */}
        <div className="w-1/2 p-4">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-orbitron font-bold text-primary">HEAT MAP ANALYSIS</h3>
              <div className="flex items-center space-x-2">
                <div className="flex bg-card rounded border border-border">
                  {[
                    { key: 'activity', label: 'ACTIVITY', color: 'text-orange-400' },
                    { key: 'threat', label: 'THREAT', color: 'text-red-400' },
                    { key: 'movement', label: 'MOVEMENT', color: 'text-cyan-400' }
                  ].map(type => (
                    <button
                      key={type.key}
                      onClick={() => setSelectedHeatMap(type.key as any)}
                      className={`px-3 py-1 text-xs font-mono transition-colors ${
                        selectedHeatMap === type.key 
                          ? 'bg-primary text-primary-foreground' 
                          : `text-muted-foreground hover:text-foreground ${type.color}`
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setHeatMapView(prev => ({ ...prev, zoom: Math.max(0.5, prev.zoom - 0.25) }))}
                    className="p-1 bg-card rounded hover:bg-accent transition-colors"
                  >
                    <MagnifyingGlassIcon className="w-3 h-3 text-muted-foreground rotate-180" />
                  </button>
                  <button
                    onClick={() => setHeatMapView(prev => ({ ...prev, zoom: Math.min(3, prev.zoom + 0.25) }))}
                    className="p-1 bg-card rounded hover:bg-accent transition-colors"
                  >
                    <MagnifyingGlassIcon className="w-3 h-3 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>

            <div 
              className="relative bg-black/50 rounded border border-border overflow-hidden flex-1 cursor-grab active:cursor-grabbing"
              onMouseDown={(e) => handleMouseDown(e, 'heat')}
              onMouseMove={handleMouseMove}
              onWheel={(e) => handleWheel(e, 'heat')}
            >
              <canvas
                ref={heatMapRef}
                width={400}
                height={300}
                className="w-full h-full"
              />
              <div className="absolute top-2 right-2 bg-black/80 rounded px-2 py-1 text-xs text-white">
                {Math.round(heatMapView.zoom * 100)}%
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
              <div className="flex items-center space-x-1">
                <FireIcon className="w-3 h-3 text-orange-400" />
                <span className="text-muted-foreground">
                  {heatMapData.filter(h => h.type === 'activity').length} ACTIVITY ZONES
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <ExclamationTriangleIcon className="w-3 h-3 text-red-400" />
                <span className="text-muted-foreground">
                  {heatMapData.filter(h => h.type === 'threat').length} THREAT AREAS
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <SignalIcon className="w-3 h-3 text-cyan-400" />
                <span className="text-muted-foreground">
                  {heatMapData.filter(h => h.type === 'movement').length} MOVEMENT PATTERNS
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border bg-card/50">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-muted-foreground">SYSTEMS ONLINE</span>
            </div>
            <div className="flex items-center space-x-2">
              <SignalIcon className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">GPS ACTIVE</span>
            </div>
            <div className="flex items-center space-x-2">
              <EyeIcon className="w-4 h-4 text-accent" />
              <span className="text-muted-foreground">SURVEILLANCE ACTIVE</span>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <button 
              onClick={fetchPredictionData} 
              disabled={isLoading}
              className="px-3 py-1 bg-primary/80 hover:bg-primary text-primary-foreground rounded-md border border-primary/50 font-mono text-xs flex items-center space-x-2 transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="w-3 h-3 rounded-full border-2 border-t-transparent border-primary-foreground animate-spin"></div>
                  <span>PROCESSING...</span>
                </>
              ) : (
                <>
                  <ShieldExclamationIcon className="w-3 h-3" />
                  <span>RUN THREAT PREDICTION</span>
                </>
              )}
            </button>
            <span className="text-muted-foreground">
              LAST UPDATE: {new Date().toLocaleTimeString()}
            </span>
            <span className="text-muted-foreground">
              TACTICAL ZOOM: {Math.round(tacticalMapView.zoom * 100)}%
            </span>
            <span className="text-muted-foreground">
              HEAT ZOOM: {Math.round(heatMapView.zoom * 100)}%
            </span>
            <span className="text-muted-foreground">
              HEAT MAP: {selectedHeatMap.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};