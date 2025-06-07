import axios from 'axios';
import type { E1SearchParams, E1SearchResponse, E1DetailResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL;

// Convert frontend params to backend format
const convertSearchParams = (params: E1SearchParams) => {
  const { fromDate, toDate } = params;
  // Convert date from DD/MM/YYYY to YYYYMMDD for backend
  const convertDate = (date: string) => {
    const [day, month, year] = date.split('/');
    return `${year}${month}${day}`;
  };
  return {
    ...params,
    fromDate: convertDate(fromDate),
    toDate: convertDate(toDate),
    // Convert empty strings to undefined for optional params
    mabcDong: params.mabcDong || undefined,
    mabcNhan: params.mabcNhan || undefined,
    khoiluong: params.khoiluong || undefined
  };
};

export const searchE1 = (params: E1SearchParams) =>
  axios.post<E1SearchResponse>(`${API_URL}/e1/search`, convertSearchParams(params));

export const getE1Details = (mae1: string) =>
  axios.get<E1DetailResponse>(`${API_URL}/e1/details/${mae1}`);

export const exportE1ToExcel = (params: E1SearchParams) =>
  axios.post(`${API_URL}/e1/export`, convertSearchParams(params), {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }
  });
