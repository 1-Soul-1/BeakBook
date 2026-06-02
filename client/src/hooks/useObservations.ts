import { useEffect, useState } from 'react';
import { Observation } from '../types/observation';
import { loadObservations, saveObservations } from '../utils/storage';
import { INITIAL_OBSERVATIONS } from '../utils/initialObservations';

export const useObservations = () => {
  const [observations, setObservations] = useState<Observation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      let data = await loadObservations();
      if (data.length === 0) {
        // При первом запуске заполняем начальными данными
        data = INITIAL_OBSERVATIONS;
        await saveObservations(data);
      }
      setObservations(data);
      setLoading(false);
    };
    init();
  }, []);

  const addObservation = async (newObs: Observation) => {
    const updated = [newObs, ...observations];
    setObservations(updated);
    await saveObservations(updated);
  };

  const updateObservation = async (id: number, updates: Partial<Observation>) => {
    const updated = observations.map(obs => (obs.id === id ? { ...obs, ...updates } : obs));
    setObservations(updated);
    await saveObservations(updated);
  };

  const deleteObservation = async (id: number) => {
    const updated = observations.filter(obs => obs.id !== id);
    setObservations(updated);
    await saveObservations(updated);
  };

  const toggleFavorite = async (id: number) => {
    const obs = observations.find(o => o.id === id);
    if (obs) await updateObservation(id, { favorite: !obs.favorite });
  };

  return { observations, loading, addObservation, updateObservation, deleteObservation, toggleFavorite };
};