// BaseSPExecutor: Thực thi stored procedure chung cho các DB
export abstract class BaseSPExecutor {
  abstract executeSP(spName: string, params: any): Promise<any>;
} 