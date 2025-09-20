import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Slider } from './ui/slider';
import { Label } from './ui/label';

const RiskPredictor: React.FC = () => {
  // State for input values
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [windSpeed, setWindSpeed] = useState<number>(50);
  const [temperature, setTemperature] = useState<number>(20);
  const [lastThreatCount, setLastThreatCount] = useState<number>(5);
  
  // State for results
  const [riskScore, setRiskScore] = useState<number>(0);
  const [riskLevel, setRiskLevel] = useState<string>('LOW');
  const [riskColor, setRiskColor] = useState<string>('bg-green-500');
  const [showResults, setShowResults] = useState<boolean>(false);

  // Calculate risk score and level
  const calculateRisk = () => {
    // Formula: risk_score = (0.3 * wind_speed/100) + (0.2 * (temperature+10)/50) + (0.5 * last_threat_count/10)
    const score = (0.3 * windSpeed / 100) + (0.2 * (temperature + 10) / 50) + (0.5 * lastThreatCount / 10);
    const roundedScore = Math.round(score * 100) / 100;
    
    setRiskScore(roundedScore);
    
    // Determine risk level
    let level = 'LOW';
    let color = 'bg-green-500';
    
    if (roundedScore > 0.7) {
      level = 'HIGH';
      color = 'bg-red-500';
    } else if (roundedScore > 0.3) {
      level = 'MEDIUM';
      color = 'bg-orange-500';
    }
    
    setRiskLevel(level);
    setRiskColor(color);
    setShowResults(true);
  };

  // Auto-calculate when any input changes
  useEffect(() => {
    calculateRisk();
  }, [windSpeed, temperature, lastThreatCount]);

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg">
      <CardHeader className="bg-slate-800 text-white">
        <CardTitle className="text-2xl">Risk Predictor</CardTitle>
        <CardDescription className="text-slate-300">
          Calculate threat risk based on environmental and historical factors
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Location Inputs */}
          <div className="space-y-3">
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              type="number"
              value={latitude}
              onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
              placeholder="Enter latitude"
              className="w-full"
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              type="number"
              value={longitude}
              onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
              placeholder="Enter longitude"
              className="w-full"
            />
          </div>
        </div>
        
        {/* Sliders for numeric inputs */}
        <div className="space-y-6 pt-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="wind-speed">Wind Speed</Label>
              <span className="text-sm font-medium">{windSpeed} km/h</span>
            </div>
            <Slider
              id="wind-speed"
              min={0}
              max={200}
              step={1}
              value={[windSpeed]}
              onValueChange={(value) => setWindSpeed(value[0])}
              className="w-full"
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="temperature">Temperature</Label>
              <span className="text-sm font-medium">{temperature}°C</span>
            </div>
            <Slider
              id="temperature"
              min={-20}
              max={50}
              step={1}
              value={[temperature]}
              onValueChange={(value) => setTemperature(value[0])}
              className="w-full"
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="threat-count">Last Threat Count</Label>
              <span className="text-sm font-medium">{lastThreatCount}</span>
            </div>
            <Slider
              id="threat-count"
              min={0}
              max={20}
              step={1}
              value={[lastThreatCount]}
              onValueChange={(value) => setLastThreatCount(value[0])}
              className="w-full"
            />
          </div>
        </div>
        
        {/* Results Section */}
        <motion.div 
          className="mt-8 p-6 rounded-lg border"
          initial={{ opacity: 0 }}
          animate={{ opacity: showResults ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-lg font-semibold mb-4">Risk Assessment Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Risk Score</p>
              <motion.p 
                className="text-3xl font-bold"
                key={riskScore}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {riskScore.toFixed(2)}
              </motion.p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Risk Level</p>
              <motion.div 
                className={`inline-block px-4 py-2 rounded-full text-white font-semibold ${riskColor}`}
                key={riskLevel}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {riskLevel}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </CardContent>
      
      <CardFooter className="flex justify-end bg-slate-50 border-t">
        <Button 
          onClick={calculateRisk}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Predict Risk
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RiskPredictor;