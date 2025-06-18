import camelCase from "lodash.camelcase";

export function normalizeDbKeysCamel<T = any>(row: any): T {
  const out: any = {};
  Object.keys(row).forEach(key => {
    out[camelCase(key)] = row[key];
  });
  return out as T;
} 