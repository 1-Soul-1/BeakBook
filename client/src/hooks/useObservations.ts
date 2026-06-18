// src/hooks/useObservations.ts
import { useEffect, useState, useCallback, useRef } from 'react';
import { Observation } from '../types/observation';
import { loadObservations, saveObservations } from '../utils/storage';
import { INITIAL_OBSERVATIONS } from '../utils/initialObservations';

export const useObservations = () => {
  const [observations, setObservations] = useState<Observation[]>([]);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);

  // Загрузка данных
  const loadData = useCallback(async () => {
    try {
      let data = await loadObservations();
      if (data.length === 0) {
        data = INITIAL_OBSERVATIONS;
        await saveObservations(data);
      }
      if (isMounted.current) {
        setObservations(data);
        setLoading(false);
      }
      return data;
    } catch (error) {
      console.error('Failed to load observations:', error);
      if (isMounted.current) setLoading(false);
      return [];
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    loadData();

    return () => {
      isMounted.current = false;
    };
  }, [loadData]);

  const addObservation = useCallback(async (newObs: Observation) => {
    const updated = [newObs, ...observations];
    setObservations(updated);
    await saveObservations(updated);
    return updated;
  }, [observations]);

  const updateObservation = useCallback(async (id: number, updates: Partial<Observation>) => {
    const updated = observations.map(obs => (obs.id === id ? { ...obs, ...updates } : obs));
    setObservations(updated);
    await saveObservations(updated);
    return updated;
  }, [observations]);

  const deleteObservation = useCallback(async (id: number) => {
    const updated = observations.filter(obs => obs.id !== id);
    setObservations(updated);
    await saveObservations(updated);
    return updated;
  }, [observations]);

  const toggleFavorite = useCallback(async (id: number) => {
    const updated = observations.map(obs => 
      obs.id === id ? { ...obs, favorite: !obs.favorite } : obs
    );
    setObservations(updated);
    await saveObservations(updated);
    return updated;
  }, [observations]);

  // Принудительное обновление данных с диска
  const refreshObservations = useCallback(async () => {
    const freshData = await loadData();
    if (freshData.length > 0) {
      setObservations(freshData);
    }
    return freshData;
  }, [loadData]);

  return { 
    observations, 
    loading, 
    addObservation, 
    updateObservation, 
    deleteObservation, 
    toggleFavorite,
    refreshObservations 
  };
};