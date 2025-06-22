import { useState, useEffect, useMemo } from 'react';
import axiosInstance from '../api/axiosConfig';

interface PosNamesMap {
  [key: string]: string;
}

export const usePosNames = (posCodes: (string | null | undefined)[]) => {
  const [posNames, setPosNames] = useState<PosNamesMap>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uniqueCodes = useMemo(() => {
    return [...new Set(posCodes.filter((code): code is string => !!code))];
  }, [posCodes]);

  useEffect(() => {
    const fetchPosNames = async () => {
      if (uniqueCodes.length === 0) {
        setPosNames({});
        return;
      }

      // Chỉ fetch những code chưa có trong state
      const codesToFetch = uniqueCodes.filter(code => !posNames[code]);
      
      if (codesToFetch.length === 0) {
        return;
      }
      
      setIsLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.post<PosNamesMap>('/pos/get-names', {
          posCodes: codesToFetch,
        });
        setPosNames(prevNames => ({ ...prevNames, ...response.data }));
      } catch (err: any) {
        setError(err.message || 'Failed to fetch post office names');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosNames();
  }, [uniqueCodes]); // Chỉ chạy lại khi uniqueCodes thay đổi

  return { posNames, isLoading, error };
}; 