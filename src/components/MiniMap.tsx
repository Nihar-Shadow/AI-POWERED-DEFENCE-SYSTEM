import { useEffect, useRef, useState } from 'react';
import { MapPinIcon, UserGroupIcon, EyeIcon } from '@heroicons/react/24/outline';

interface MapPoint {
  id: string;
  type: 'threat' | 'friendly' | 'camera';
  name: string;
  lat: number;
  lng: number;
  status?: string;
}

export const MiniMap = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mapPoints] = useState<MapPoint[]>([
    { id: 'threat-1', type: 'threat', name: 'Active Threat', lat: 35.6762, lng: 139.6503 },
    { id: 'friendly-1', type: 'friendly', name: 'Alpha Team', lat: 35.6765, lng: 139.6510 },
    { id: 'friendly-2', type: 'friendly', name: 'Bravo Team', lat: 35.6758, lng: 139.6498 },
    { id: 'camera-1', type: 'camera', name: 'CAM-01', lat: 35.6760, lng: 139.6505 },
    { id: 'camera-2', type: 'camera', name: 'CAM-02', lat: 35.6770, lng: 139.6515 },
    { id: 'camera-3', type: 'camera', name: 'CAM-03', lat: 35.6755, lng: 139.6490 },
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid background
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
        // Convert lat/lng to canvas coordinates (simplified)
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

        // Draw point
        ctx.beginPath();
        ctx.arc(x, y, point.type === 'threat' ? 6 : 4, 0, 2 * Math.PI);
        ctx.fill();

        // Draw pulse effect for threats
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

      // Draw connections between friendly units
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
    };

    draw();
    
    const interval = setInterval(draw, 100); // Animate pulses
    return () => clearInterval(interval);
  }, [mapPoints]);

  return (
    <div className="tactical-panel p-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-orbitron font-bold text-primary">
          TACTICAL MAP
        </h3>
        
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

      {/* Map Canvas */}
      <div className="relative bg-black/50 rounded border border-border overflow-hidden flex-1">
        <canvas
          ref={canvasRef}
          width={300}
          height={180}
          className="w-full h-full"
        />
        
        {/* Radar sweep effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-primary/30 rounded-full animate-ping" />
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <div className="flex items-center space-x-1">
          <MapPinIcon className="w-3 h-3 text-destructive" />
          <span className="text-muted-foreground">
            {mapPoints.filter(p => p.type === 'threat').length}
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          <UserGroupIcon className="w-3 h-3 text-primary" />
          <span className="text-muted-foreground">
            {mapPoints.filter(p => p.type === 'friendly').length}
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          <EyeIcon className="w-3 h-3 text-accent" />
          <span className="text-muted-foreground">
            {mapPoints.filter(p => p.type === 'camera').length}
          </span>
        </div>
      </div>
    </div>
  );
};