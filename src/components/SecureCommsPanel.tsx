import { useState, useEffect } from 'react';
import {
  ChatBubbleLeftRightIcon,
  LockClosedIcon,
  MicrophoneIcon,
  PaperClipIcon,
  XMarkIcon,
  UserIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

interface Message {
  id: string;
  sender: string;
  rank: string;
  content: string;
  timestamp: Date;
  encrypted: boolean;
  type: 'text' | 'audio' | 'location' | 'file';
}

interface User {
  id: string;
  name: string;
  rank: string;
  status: 'online' | 'idle' | 'typing' | 'offline';
}

interface SecureCommsPanelProps {
  isOpen: boolean;
  onToggle: (open: boolean) => void;
}

export const SecureCommsPanel = ({ isOpen, onToggle }: SecureCommsPanelProps) => {
  const [message, setMessage] = useState('');
  const [isPTT, setIsPTT] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'Sgt. Reyes',
      rank: 'SGT',
      content: 'Alpha team in position. North perimeter secure.',
      timestamp: new Date(Date.now() - 300000),
      encrypted: true,
      type: 'text'
    },
    {
      id: '2',
      sender: 'Lt. Chen',
      rank: 'LT',
      content: 'Copy that. Maintain radio silence until further notice.',
      timestamp: new Date(Date.now() - 240000),
      encrypted: true,
      type: 'text'
    }
  ]);

  const [users] = useState<User[]>([
    { id: '1', name: 'Sgt. Reyes', rank: 'SGT', status: 'online' },
    { id: '2', name: 'Lt. Chen', rank: 'LT', status: 'online' },
    { id: '3', name: 'Cpl. Johnson', rank: 'CPL', status: 'idle' },
    { id: '4', name: 'Pvt. Williams', rank: 'PVT', status: 'offline' }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-primary';
      case 'idle': return 'bg-warning-amber';
      case 'typing': return 'bg-accent';
      case 'offline': return 'bg-muted';
      default: return 'bg-muted';
    }
  };

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'Cdr. Martinez',
      rank: 'CDR',
      content: message,
      timestamp: new Date(),
      encrypted: true,
      type: 'text'
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Toggle Button - Bottom Right */}
      <button
        onClick={() => onToggle(!isOpen)}
        className={`fixed right-6 bottom-6 z-50 p-4 rounded-full border-2 border-primary bg-background/95 backdrop-blur-sm tactical-panel shadow-lg transition-all duration-300 hover:scale-110 ${
          isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <ChatBubbleLeftRightIcon className="w-8 h-8 text-primary" />
      </button>

      {/* Bottom Popup Panel - Much Bigger */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 transform transition-transform duration-300 ${
        isOpen ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div className="h-[600px] bg-background border-t-2 border-primary/20 tactical-panel rounded-t-xl shadow-2xl">
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
              <div className="flex items-center space-x-3">
                <LockClosedIcon className="w-6 h-6 text-primary" />
                <h3 className="font-orbitron font-bold text-xl text-primary">SECURE COMMUNICATIONS</h3>
              </div>
              <button 
                onClick={() => onToggle(false)}
                className="p-2 rounded-full hover:bg-card transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-muted-foreground" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex">
              {/* Left Side - Online Users */}
              <div className="w-80 p-6 border-r border-border bg-card/30">
                <div className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">ACTIVE UNITS</div>
                <div className="space-y-3">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(user.status)}`} />
                      <UserIcon className="w-5 h-5 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="text-sm font-mono font-semibold">{user.rank}. {user.name.split(' ')[1]}</div>
                        <div className="text-xs text-muted-foreground capitalize">{user.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* System Status */}
                <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="text-xs font-semibold text-primary mb-2">SYSTEM STATUS</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Encryption:</span>
                      <span className="text-green-400 font-mono">AES-256</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Protocol:</span>
                      <span className="text-blue-400 font-mono">Signal</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Connection:</span>
                      <span className="text-green-400 font-mono">SECURE</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Messages */}
              <div className="flex-1 flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-mono font-semibold text-primary">{msg.rank}. {msg.sender.split(' ')[1]}</span>
                        {msg.encrypted && (
                          <LockClosedIcon className="w-4 h-4 text-accent" title="AES-256 + Signal Protocol" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {msg.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="bg-card rounded-lg p-4 text-sm border border-border shadow-sm">
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input Area */}
                <div className="p-6 border-t border-border bg-gradient-to-r from-card/50 to-transparent">
                  <div className="flex items-center space-x-3 mb-4">
                    <button
                      onMouseDown={() => setIsPTT(true)}
                      onMouseUp={() => setIsPTT(false)}
                      onMouseLeave={() => setIsPTT(false)}
                      className={`p-3 rounded-full transition-all duration-200 ${
                        isPTT ? 'bg-primary text-primary-foreground scale-110' : 'bg-card text-muted-foreground hover:text-foreground hover:scale-105'
                      }`}
                    >
                      <MicrophoneIcon className="w-5 h-5" />
                    </button>
                    
                    <button className="p-3 rounded-full bg-card text-muted-foreground hover:text-foreground hover:scale-105 transition-all duration-200">
                      <PaperClipIcon className="w-5 h-5" />
                    </button>
                    
                    <button className="p-3 rounded-full bg-card text-muted-foreground hover:text-foreground hover:scale-105 transition-all duration-200">
                      <MapPinIcon className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type secure message..."
                      className="flex-1 bg-input border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <button
                      onClick={sendMessage}
                      className="btn-tactical px-6 py-3 text-sm font-semibold"
                    >
                      SEND
                    </button>
                  </div>
                  
                  <div className="text-xs text-muted-foreground mt-3 flex items-center space-x-2">
                    <LockClosedIcon className="w-4 h-4" />
                    <span>End-to-end encrypted • AES-256 + Signal Protocol</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => onToggle(false)}
        />
      )}
    </>
  );
};