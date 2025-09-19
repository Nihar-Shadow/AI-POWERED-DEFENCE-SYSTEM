import { useState, useEffect } from 'react';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  UserIcon, 
  LockClosedIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  FingerPrintIcon,
  SignalIcon
} from '@heroicons/react/24/outline';

interface LoginPageProps {
  onLogin: (credentials: { username: string; rank: string }) => void;
}

interface User {
  username: string;
  rank: string;
  clearance: string;
  department: string;
}

export const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [securityLevel, setSecurityLevel] = useState('SECURE');
  const [connectionStatus, setConnectionStatus] = useState('ESTABLISHING');

  // Simulated authorized users
  const authorizedUsers: User[] = [
    { username: 'martinez', rank: 'CDR', clearance: 'TOP SECRET', department: 'COMMAND' },
    { username: 'reyes', rank: 'SGT', clearance: 'SECRET', department: 'SURVEILLANCE' },
    { username: 'chen', rank: 'LT', clearance: 'SECRET', department: 'INTELLIGENCE' },
    { username: 'johnson', rank: 'CPL', clearance: 'CONFIDENTIAL', department: 'SUPPORT' },
    { username: 'williams', rank: 'PVT', clearance: 'CONFIDENTIAL', department: 'SUPPORT' }
  ];

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const connectionInterval = setInterval(() => {
      setConnectionStatus('SECURE');
    }, 2000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(connectionInterval);
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const user = authorizedUsers.find(u => 
      u.username.toLowerCase() === username.toLowerCase() && 
      password === 'rakshak2024'
    );

    if (user) {
      // Simulate security check
      await new Promise(resolve => setTimeout(resolve, 500));
      onLogin({ username: user.username, rank: user.rank });
    } else {
      setError('INVALID CREDENTIALS - ACCESS DENIED');
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setUsername('martinez');
    setPassword('rakshak2024');
  };

  useEffect(() => {
    handleDemoLogin();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Image Background */}
      <div className="absolute inset-0">
        {/* Option 1: Using a local image from public folder */}
        {/* 
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/military-background.jpg')"
          }}
        />
        */}
        
        {/* Option 2: Using a local image from public folder */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/background.jpg')"
          }}
        />
        
        {/* Option 3: Using CSS camouflage pattern as fallback */}
        {/* <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 20% 30%, #1a4d2e 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, #8b4513 0%, transparent 50%),
              radial-gradient(circle at 40% 70%, #d2b48c 0%, transparent 50%),
              radial-gradient(circle at 90% 80%, #2d2d2d 0%, transparent 50%),
              radial-gradient(circle at 10% 80%, #1a4d2e 0%, transparent 50%),
              radial-gradient(circle at 70% 40%, #8b4513 0%, transparent 50%),
              radial-gradient(circle at 30% 10%, #d2b48c 0%, transparent 50%),
              radial-gradient(circle at 60% 90%, #2d2d2d 0%, transparent 50%),
              radial-gradient(circle at 85% 60%, #1a4d2e 0%, transparent 50%),
              radial-gradient(circle at 15% 50%, #8b4513 0%, transparent 50%),
              radial-gradient(circle at 50% 25%, #d2b48c 0%, transparent 50%),
              radial-gradient(circle at 75% 15%, #2d2d2d 0%, transparent 50%),
              radial-gradient(circle at 25% 85%, #1a4d2e 0%, transparent 50%),
              radial-gradient(circle at 95% 35%, #8b4513 0%, transparent 50%),
              radial-gradient(circle at 5% 15%, #d2b48c 0%, transparent 50%),
              radial-gradient(circle at 45% 95%, #2d2d2d 0%, transparent 50%)
            `,
            backgroundSize: '200px 200px, 150px 150px, 180px 180px, 120px 120px, 160px 160px, 140px 140px, 170px 170px, 130px 130px, 190px 190px, 110px 110px, 200px 200px, 145px 145px, 175px 175px, 125px 125px, 155px 155px, 135px 135px',
            backgroundPosition: '0% 0%, 100% 0%, 50% 50%, 75% 25%, 25% 75%, 90% 10%, 10% 90%, 60% 40%, 40% 60%, 80% 20%, 20% 80%, 70% 30%, 30% 70%, 85% 15%, 15% 85%, 55% 45%'
          }}
        />
        
        {/* Dark overlay for better contrast with image */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Main Login Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <img src="/images/logo.png" alt="RAKSHAK logo" className="w-12 h-12 object-contain animate-pulse" />
              <h1 className="text-3xl font-orbitron font-bold text-primary">
                RAKSHAK
              </h1>
            </div>
            <p className="text-muted-foreground text-sm font-mono">
              SECURE COMMAND INTERFACE
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-black/80 border border-primary/30 rounded-lg p-6 shadow-2xl">
            {/* Security Status */}
            <div className="flex items-center justify-between mb-6 p-3 bg-primary/20 rounded border border-primary/30">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-mono text-green-400">{securityLevel}</span>
              </div>
              <div className="flex items-center space-x-2">
                <SignalIcon className="w-3 h-3 text-blue-400" />
                <span className="text-xs font-mono text-blue-400">{connectionStatus}</span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Username Field */}
              <div>
                <label className="block text-xs font-mono text-muted-foreground mb-2">
                  OPERATOR ID
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-black/90 border border-primary/40 rounded-md text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-muted-foreground"
                    placeholder="ENTER USERNAME"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-mono text-muted-foreground mb-2">
                  ACCESS CODE
                </label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-black/90 border border-primary/40 rounded-md text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-muted-foreground"
                    placeholder="ENTER PASSWORD"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-4 h-4" />
                    ) : (
                      <EyeIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center space-x-2 p-3 bg-destructive/40 border border-destructive/50 rounded-md">
                  <ExclamationTriangleIcon className="w-4 h-4 text-destructive" />
                  <span className="text-xs font-mono text-destructive">{error}</span>
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground font-mono font-bold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>VERIFYING ACCESS...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <FingerPrintIcon className="w-4 h-4" />
                    <span>AUTHENTICATE</span>
                  </div>
                )}
              </button>
            </form>

            {/* Demo Login */}
            <div className="mt-4 pt-4 border-t border-primary/30">
              <button
                onClick={handleDemoLogin}
                className="w-full py-2 text-xs font-mono text-muted-foreground hover:text-white transition-colors"
              >
                LOAD DEMO CREDENTIALS
              </button>
            </div>
          </div>

          {/* Footer Information */}
          <div className="mt-6 text-center space-y-2">
            <div className="text-xs font-mono text-muted-foreground">
              {currentTime.toLocaleDateString()} | {currentTime.toLocaleTimeString()}
            </div>
            <div className="text-xs font-mono text-muted-foreground">
              CLASSIFIED SYSTEM - AUTHORIZED PERSONNEL ONLY
            </div>
            <div className="text-xs font-mono text-muted-foreground">
              AES-256 ENCRYPTION | SECURE CONNECTION
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-4 p-3 bg-destructive/30 border border-destructive/40 rounded-md">
            <div className="flex items-center space-x-2">
              <ExclamationTriangleIcon className="w-4 h-4 text-destructive" />
              <span className="text-xs font-mono text-destructive">
                UNAUTHORIZED ACCESS ATTEMPTS WILL BE LOGGED AND REPORTED
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Side Panel - System Status */}
      <div className="absolute right-8 top-8 w-64 bg-black/80 border border-primary/30 rounded-lg p-4 z-20 shadow-xl">
        <h3 className="text-sm font-orbitron font-bold text-primary mb-3">
          SYSTEM STATUS
        </h3>
        <div className="space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Encryption:</span>
            <span className="text-green-400">AES-256</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Protocol:</span>
            <span className="text-blue-400">TLS 1.3</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Firewall:</span>
            <span className="text-green-400">ACTIVE</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Surveillance:</span>
            <span className="text-green-400">ONLINE</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Threat Level:</span>
            <span className="text-yellow-400">MODERATE</span>
          </div>
        </div>
      </div>

      {/* Authorized Users Panel */}
      <div className="absolute left-8 top-8 w-64 bg-black/80 border border-primary/30 rounded-lg p-4 z-20 shadow-xl">
        <h3 className="text-sm font-orbitron font-bold text-primary mb-3">
          AUTHORIZED PERSONNEL
        </h3>
        <div className="space-y-1 text-xs font-mono">
          {authorizedUsers.map((user) => (
            <div key={user.username} className="flex items-center justify-between">
              <span className="text-muted-foreground">{user.rank}. {user.username.toUpperCase()}</span>
              <span className="text-accent">{user.clearance}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-2 border-t border-primary/30">
          <div className="text-xs text-muted-foreground">
            Default Password: rakshak2024
          </div>
        </div>
      </div>
    </div>
  );
};