import { useState, useEffect } from 'react';
import { CommandHeader } from '@/components/CommandHeader';
import { Taskbar } from '@/components/Taskbar';
import { SurveillanceGrid } from '@/components/SurveillanceGrid';
import { ThreatAnalysisPanel } from '@/components/ThreatAnalysisPanel';
import { SecureCommsPanel } from '@/components/SecureCommsPanel';
import { StatusFooter } from '@/components/StatusFooter';
import { TacticalMap } from '@/components/TacticalMap';
import { SoldierSupportPanel } from '@/components/SoldierSupportPanel';

interface User {
  username: string;
  rank: string;
}

interface IndexProps {
  currentUser: User | null;
  onLogout: () => void;
}

const Index = ({ currentUser, onLogout }: IndexProps) => {
  const [missionTime, setMissionTime] = useState(0);
  const [commsOpen, setCommsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('surveillance');

  useEffect(() => {
    const interval = setInterval(() => {
      setMissionTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'surveillance':
        return (
          <div className="col-span-12 space-y-4">
            <div className="h-[500px]">
              <SurveillanceGrid />
            </div>
          </div>
        );
      
      case 'map':
        return (
          <div className="col-span-12 space-y-4">
            <div className="h-[600px]">
              <TacticalMap />
            </div>
          </div>
        );
      
      case 'soldier-support':
        return (
          <div className="col-span-12 space-y-4">
            <div className="h-[500px]">
              <SoldierSupportPanel />
            </div>
          </div>
        );
      
      case 'threat-analysis':
        return (
          <div className="col-span-12 space-y-4">
            <div className="h-[500px]">
              <ThreatAnalysisPanel />
            </div>
          </div>
        );
      
      default:
        return (
          <div className="col-span-12 space-y-4">
            <div className="h-[500px]">
              <SurveillanceGrid />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Image */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/background.jpg')"
          }}
        />
        {/* Dark overlay for better contrast */}
        <div className="absolute inset-0 bg-black/30" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <CommandHeader 
          missionTime={missionTime} 
          currentUser={currentUser}
          onLogout={onLogout}
        />
        <Taskbar activeSection={activeSection} onSectionChange={setActiveSection} />
        
        <main className="flex-1 p-4 grid grid-cols-12 gap-4 relative">
          {renderSectionContent()}
          
          {/* Secure Communications - Larger Sliding Panel */}
          <SecureCommsPanel isOpen={commsOpen} onToggle={setCommsOpen} />
        </main>
        
        <StatusFooter />
      </div>
    </div>
  );
};

export default Index;
