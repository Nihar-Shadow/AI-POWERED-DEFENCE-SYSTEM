import React from 'react';
import RiskPredictor from '../components/RiskPredictor';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const RiskPredictorPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Risk Predictor Tool</h1>
          <Link to="/">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
        
        <RiskPredictor />
      </div>
    </div>
  );
};

export default RiskPredictorPage;