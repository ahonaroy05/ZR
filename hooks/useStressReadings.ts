import { useState, useEffect } from 'react';

export interface StressReading {
  id: string;
  timestamp: Date;
  level: number; // 1-10 stress level
  notes?: string;
}

export function useStressReadings() {
  const [readings, setReadings] = useState<StressReading[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addReading = (level: number, notes?: string) => {
    const newReading: StressReading = {
      id: Date.now().toString(),
      timestamp: new Date(),
      level,
      notes,
    };
    
    setReadings(prev => [newReading, ...prev]);
  };

  const removeReading = (id: string) => {
    setReadings(prev => prev.filter(reading => reading.id !== id));
  };

  const getAverageStress = () => {
    if (readings.length === 0) return 0;
    const sum = readings.reduce((acc, reading) => acc + reading.level, 0);
    return sum / readings.length;
  };

  return {
    readings,
    loading,
    error,
    addReading,
    removeReading,
    getAverageStress,
  };
}