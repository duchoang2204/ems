import { useMemo } from 'react';
import { subDays } from 'date-fns';

export const useDefaultDates = () => {
  return useMemo(() => {
    const toDate = new Date();
    const searchDays = parseInt(localStorage.getItem('e1_search_days') || '7');
    const fromDate = subDays(toDate, searchDays);

    return {
      fromDate,
      toDate,
    };
  }, []);
};
