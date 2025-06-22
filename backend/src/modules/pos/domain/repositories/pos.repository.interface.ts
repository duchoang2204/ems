export interface IPosRepository {
  findNameByCode(posCode: string): Promise<string | null>;
}

export const IPosRepository = Symbol('IPosRepository'); 