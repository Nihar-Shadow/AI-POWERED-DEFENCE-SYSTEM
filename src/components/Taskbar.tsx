import { useState } from 'react';
import { 
  EyeIcon, 
  MapIcon, 
  UserGroupIcon, 
  ExclamationTriangleIcon,
  ChevronDownIcon,
  SignalIcon,
  WifiIcon
} from '@heroicons/react/24/outline';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

interface TaskbarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const Taskbar = ({ activeSection, onSectionChange }: TaskbarProps) => {
  const sections = [
    {
      id: 'surveillance',
      label: 'Surveillance',
      icon: EyeIcon,
      description: 'Real-time monitoring and camera feeds',
      color: 'text-blue-400',
      status: 'online',
      alerts: 3
    },
    {
      id: 'map',
      label: 'MAPS',
      icon: MapIcon,
      description: 'Interactive battlefield mapping',
      color: 'text-green-400',
      status: 'online',
      alerts: 0
    },
    {
      id: 'soldier-support',
      label: 'Soldier Support',
      icon: UserGroupIcon,
      description: 'Unit status and support systems',
      color: 'text-yellow-400',
      status: 'warning',
      alerts: 1
    },
    {
      id: 'threat-analysis',
      label: 'Threat Analysis',
      icon: ExclamationTriangleIcon,
      description: 'Intelligence and threat assessment',
      color: 'text-red-400',
      status: 'critical',
      alerts: 5
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="tactical-panel border-b border-primary/20 bg-background/95 backdrop-blur-sm">
      <div className="px-6 py-2">
        <div className="flex items-center justify-between">
          {/* Navigation Menu */}
          <NavigationMenu>
            <NavigationMenuList className="flex space-x-1">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                
                return (
                  <NavigationMenuItem key={section.id}>
                    <NavigationMenuTrigger
                      className={cn(
                        "h-12 px-4 py-2 text-sm font-medium transition-all duration-200 relative",
                        "hover:bg-accent hover:text-accent-foreground",
                        "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
                        isActive && "bg-primary/10 text-primary border-b-2 border-primary",
                        !isActive && "text-muted-foreground"
                      )}
                      onClick={() => onSectionChange(section.id)}
                    >
                      <div className="flex items-center space-x-2">
                        <div className="relative">
                          <Icon className={cn("w-4 h-4", section.color)} />
                          {/* Status indicator */}
                          <div className={cn(
                            "absolute -top-1 -right-1 w-2 h-2 rounded-full",
                            getStatusColor(section.status)
                          )} />
                        </div>
                        <span>{section.label}</span>
                        {section.alerts > 0 && (
                          <div className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                            {section.alerts}
                          </div>
                        )}
                        <ChevronDownIcon className="w-3 h-3" />
                      </div>
                    </NavigationMenuTrigger>
                    
                    <NavigationMenuContent>
                      <div className="w-72 p-4 bg-popover border rounded-lg shadow-lg">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-foreground flex items-center space-x-2">
                              <Icon className={cn("w-4 h-4", section.color)} />
                              <span>{section.label}</span>
                            </h3>
                            <div className="flex items-center space-x-2">
                              <div className={cn(
                                "w-2 h-2 rounded-full",
                                getStatusColor(section.status)
                              )} />
                              <span className="text-xs text-muted-foreground capitalize">
                                {section.status}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {section.description}
                          </p>
                          {section.alerts > 0 && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-md p-2">
                              <div className="text-xs text-red-400 font-medium">
                                {section.alerts} active alert{section.alerts > 1 ? 's' : ''}
                              </div>
                            </div>
                          )}
                          <div className="pt-2 space-y-2">
                            <button
                              className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors bg-primary/5 border border-primary/20"
                              onClick={() => onSectionChange(section.id)}
                            >
                              Open {section.label}
                            </button>
                            <button
                              className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>

          {/* System Status */}
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-2">
              <SignalIcon className="w-3 h-3 text-green-400" />
              <span className="text-muted-foreground">SYSTEMS ONLINE</span>
            </div>
            <div className="flex items-center space-x-2">
              <WifiIcon className="w-3 h-3 text-blue-400" />
              <span className="text-muted-foreground">SECURE NETWORK</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="text-muted-foreground">
              {sections.filter(s => s.alerts > 0).length} ACTIVE ALERTS
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
