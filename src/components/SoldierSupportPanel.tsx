import { useState, useEffect } from 'react';
import { 
  UserIcon,
  HeartIcon,
  ShieldCheckIcon,
  BoltIcon,
  ClockIcon,
  MapPinIcon,
  SignalIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface Soldier {
  id: string;
  name: string;
  rank: string;
  unit: string;
  position: { lat: number; lng: number; };
  health: {
    heartRate: number;
    bodyTemp: number;
    bloodOxygen: number;
    stress: number;
    fatigue: number;
  };
  equipment: {
    armor: number;
    ammo: number;
    battery: number;
    comms: boolean;
  };
  status: 'active' | 'injured' | 'kia' | 'offline';
  lastUpdate: Date;
}

export const SoldierSupportPanel = () => {
  const [selectedSoldier, setSelectedSoldier] = useState<string | null>(null);
  const [soldiers, setSoldiers] = useState<Soldier[]>([
    {
      id: 'SOL-001',
      name: 'James Reyes',
      rank: 'SGT',
      unit: 'Alpha Squad',
      position: { lat: 35.6762, lng: 139.6503 },
      health: {
        heartRate: 78,
        bodyTemp: 98.6,
        bloodOxygen: 98,
        stress: 25,
        fatigue: 30
      },
      equipment: {
        armor: 85,
        ammo: 92,
        battery: 67,
        comms: true
      },
      status: 'active',
      lastUpdate: new Date()
    },
    {
      id: 'SOL-002',
      name: 'Maria Chen',
      rank: 'LT',
      unit: 'Bravo Squad',
      position: { lat: 35.6765, lng: 139.6510 },
      health: {
        heartRate: 85,
        bodyTemp: 99.1,
        bloodOxygen: 96,
        stress: 45,
        fatigue: 50
      },
      equipment: {
        armor: 72,
        ammo: 78,
        battery: 89,
        comms: true
      },
      status: 'active',
      lastUpdate: new Date()
    },
    {
      id: 'SOL-003',
      name: 'David Johnson',
      rank: 'CPL',
      unit: 'Charlie Squad',
      position: { lat: 35.6758, lng: 139.6498 },
      health: {
        heartRate: 95,
        bodyTemp: 99.8,
        bloodOxygen: 94,
        stress: 65,
        fatigue: 70
      },
      equipment: {
        armor: 45,
        ammo: 23,
        battery: 12,
        comms: false
      },
      status: 'injured',
      lastUpdate: new Date(Date.now() - 120000)
    },
    {
      id: 'SOL-004',
      name: 'Sarah Williams',
      rank: 'PVT',
      unit: 'Delta Squad',
      position: { lat: 35.6770, lng: 139.6515 },
      health: {
        heartRate: 72,
        bodyTemp: 98.2,
        bloodOxygen: 99,
        stress: 15,
        fatigue: 20
      },
      equipment: {
        armor: 95,
        ammo: 100,
        battery: 98,
        comms: true
      },
      status: 'active',
      lastUpdate: new Date()
    }
  ]);

  // Simulate real-time health updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSoldiers(prev => prev.map(soldier => ({
        ...soldier,
        health: {
          ...soldier.health,
          heartRate: Math.max(60, Math.min(120, soldier.health.heartRate + (Math.random() - 0.5) * 5)),
          stress: Math.max(0, Math.min(100, soldier.health.stress + (Math.random() - 0.5) * 3)),
          fatigue: Math.max(0, Math.min(100, soldier.health.fatigue + (Math.random() - 0.5) * 2))
        },
        equipment: {
          ...soldier.equipment,
          battery: Math.max(0, soldier.equipment.battery - Math.random() * 0.5)
        },
        lastUpdate: new Date()
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-primary';
      case 'injured': return 'text-warning-amber';
      case 'kia': return 'text-destructive';
      case 'offline': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getHealthColor = (value: number, type: 'heartRate' | 'temp' | 'oxygen' | 'stress' | 'fatigue') => {
    switch (type) {
      case 'heartRate':
        if (value < 60 || value > 100) return 'text-destructive';
        if (value < 70 || value > 90) return 'text-warning-amber';
        return 'text-primary';
      case 'temp':
        if (value > 100 || value < 97) return 'text-destructive';
        if (value > 99.5 || value < 97.5) return 'text-warning-amber';
        return 'text-primary';
      case 'oxygen':
        if (value < 95) return 'text-destructive';
        if (value < 97) return 'text-warning-amber';
        return 'text-primary';
      case 'stress':
      case 'fatigue':
        if (value > 70) return 'text-destructive';
        if (value > 50) return 'text-warning-amber';
        return 'text-primary';
      default:
        return 'text-primary';
    }
  };

  const getEquipmentColor = (value: number) => {
    if (value < 25) return 'text-destructive';
    if (value < 50) return 'text-warning-amber';
    return 'text-primary';
  };

  return (
    <div className="tactical-panel p-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-orbitron font-bold text-primary">
          SOLDIER SUPPORT
        </h2>
        
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="text-xs text-primary font-mono">
            {soldiers.filter(s => s.status === 'active').length} ACTIVE
          </span>
        </div>
      </div>

      {/* Soldier List */}
      <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
        {soldiers.map((soldier) => (
          <div 
            key={soldier.id}
            onClick={() => setSelectedSoldier(selectedSoldier === soldier.id ? null : soldier.id)}
            className={`bg-card border rounded-lg p-3 cursor-pointer transition-all hover:border-primary/50 ${
              selectedSoldier === soldier.id ? 'border-primary bg-primary/5' : 'border-border'
            } ${
              soldier.status === 'injured' ? 'border-warning-amber/50 bg-warning-amber/5' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="flex flex-col items-center">
                  <UserIcon className={`w-6 h-6 ${getStatusColor(soldier.status)}`} />
                  <div className={`w-2 h-2 rounded-full mt-1 ${
                    soldier.status === 'active' ? 'bg-primary animate-pulse' : 
                    soldier.status === 'injured' ? 'bg-warning-amber animate-pulse' :
                    soldier.status === 'kia' ? 'bg-destructive' : 'bg-muted'
                  }`} />
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm font-bold text-foreground">
                      {soldier.rank}. {soldier.name}
                    </span>
                    <span className="text-xs bg-card-foreground/10 px-2 py-0.5 rounded">
                      {soldier.unit}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs">
                    <div className="flex items-center space-x-1">
                      <HeartIcon className={`w-3 h-3 ${getHealthColor(soldier.health.heartRate, 'heartRate')}`} />
                      <span className={getHealthColor(soldier.health.heartRate, 'heartRate')}>
                        {soldier.health.heartRate} BPM
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <BoltIcon className={`w-3 h-3 ${getEquipmentColor(soldier.equipment.battery)}`} />
                      <span className={getEquipmentColor(soldier.equipment.battery)}>
                        {Math.round(soldier.equipment.battery)}%
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <SignalIcon className={`w-3 h-3 ${soldier.equipment.comms ? 'text-primary' : 'text-destructive'}`} />
                      <span className={soldier.equipment.comms ? 'text-primary' : 'text-destructive'}>
                        {soldier.equipment.comms ? 'ONLINE' : 'OFFLINE'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Last Update: {soldier.lastUpdate.toLocaleTimeString()}
                  </div>
                </div>
              </div>
              
              {soldier.status === 'injured' && (
                <ExclamationTriangleIcon className="w-5 h-5 text-warning-amber" />
              )}
            </div>

            {/* Expanded Details */}
            {selectedSoldier === soldier.id && (
              <div className="mt-4 pt-4 border-t border-border space-y-4">
                {/* Health Vitals */}
                <div>
                  <h4 className="text-sm font-orbitron font-bold text-primary mb-2">HEALTH VITALS</h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Heart Rate:</span>
                      <span className={getHealthColor(soldier.health.heartRate, 'heartRate')}>
                        {soldier.health.heartRate} BPM
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Body Temp:</span>
                      <span className={getHealthColor(soldier.health.bodyTemp, 'temp')}>
                        {soldier.health.bodyTemp}°F
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Blood O2:</span>
                      <span className={getHealthColor(soldier.health.bloodOxygen, 'oxygen')}>
                        {soldier.health.bloodOxygen}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Stress Level:</span>
                      <span className={getHealthColor(soldier.health.stress, 'stress')}>
                        {soldier.health.stress}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fatigue:</span>
                      <span className={getHealthColor(soldier.health.fatigue, 'fatigue')}>
                        {soldier.health.fatigue}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Equipment Status */}
                <div>
                  <h4 className="text-sm font-orbitron font-bold text-primary mb-2">EQUIPMENT STATUS</h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Armor:</span>
                      <span className={getEquipmentColor(soldier.equipment.armor)}>
                        {soldier.equipment.armor}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ammunition:</span>
                      <span className={getEquipmentColor(soldier.equipment.ammo)}>
                        {soldier.equipment.ammo}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Battery:</span>
                      <span className={getEquipmentColor(soldier.equipment.battery)}>
                        {Math.round(soldier.equipment.battery)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Comms:</span>
                      <span className={soldier.equipment.comms ? 'text-primary' : 'text-destructive'}>
                        {soldier.equipment.comms ? 'ACTIVE' : 'OFFLINE'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Position */}
                <div>
                  <h4 className="text-sm font-orbitron font-bold text-primary mb-2">POSITION</h4>
                  <div className="flex items-center space-x-2 text-xs">
                    <MapPinIcon className="w-3 h-3 text-accent" />
                    <span className="text-muted-foreground">
                      {soldier.position.lat.toFixed(4)}°N, {soldier.position.lng.toFixed(4)}°E
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="pt-4 border-t border-border">
        <div className="flex space-x-2">
          <button className="btn-mission text-xs">
            MEDEVAC
          </button>
          <button className="btn-tactical text-xs">
            RESUPPLY
          </button>
          <button className="btn-danger text-xs">
            EMERGENCY
          </button>
        </div>
      </div>
    </div>
  );
};