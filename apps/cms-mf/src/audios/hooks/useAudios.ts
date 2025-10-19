import { useEffect, useState } from 'react';
import { audioService } from '../services/audioService';
import type { Audio } from '../types/audio.types';

export const useAudios = () => {
  const [allAudios, setAllAudios] = useState<Audio[]>([]);
  const [filteredAudios, setFilteredAudios] = useState<Audio[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadAudios = async (params?: any) => {
    setLoading(true);
    try {
      const res = await audioService.getAudios(params);
      if (res?.data) {
        setAllAudios(res.data);
        setFilteredAudios(res.data);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load audios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAudios();
  }, []);

  return { allAudios, filteredAudios, setFilteredAudios, loading, error, loadAudios };
};

export default useAudios;
