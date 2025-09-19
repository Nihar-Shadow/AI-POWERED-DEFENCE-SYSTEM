import { useState, useEffect } from 'react';
import { XMarkIcon, BellAlertIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  read: boolean;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
}

export const NotificationPanel = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onClearAll
}: NotificationPanelProps) => {
  if (!isOpen) return null;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-600';
      case 'medium':
        return 'bg-amber-500';
      case 'low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getUnreadCount = () => {
    return notifications.filter(notification => !notification.read).length;
  };

  return (
    <div className="absolute top-16 right-4 z-50 w-96 bg-card/95 backdrop-blur-sm border border-primary/20 rounded-md shadow-lg overflow-hidden">
      <div className="p-4 border-b border-primary/20 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BellAlertIcon className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Notifications</h3>
          {getUnreadCount() > 0 && (
            <span className="px-2 py-0.5 text-xs bg-primary text-black rounded-full">
              {getUnreadCount()}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onClearAll}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear All
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-primary/10 transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            <p>No notifications</p>
          </div>
        ) : (
          <ul className="divide-y divide-primary/10">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={`p-4 hover:bg-primary/5 transition-colors ${!notification.read ? 'bg-primary/10' : ''}`}
                onClick={() => onMarkAsRead(notification.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className={`mt-1 w-3 h-3 rounded-full ${getSeverityColor(notification.severity)}`} />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    
                    {/* Additional threat details */}
                    <div className="mt-2 pt-2 border-t border-primary/10 grid grid-cols-2 gap-2 text-xs">
                      {notification.threatType && (
                        <div>
                          <span className="text-primary">Type:</span> {notification.threatType}
                        </div>
                      )}
                      {notification.sector && (
                        <div>
                          <span className="text-primary">Sector:</span> {notification.sector}
                        </div>
                      )}
                      {notification.coordinates && (
                        <div className="col-span-2">
                          <span className="text-primary">Coordinates:</span> {notification.coordinates}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};