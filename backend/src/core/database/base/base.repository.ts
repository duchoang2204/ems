// BaseRepository: Repository cha cho các repository khác kế thừa
export abstract class BaseRepository<T> {
  abstract findById(id: number): Promise<T | null>;
  abstract findAll(): Promise<T[]>;
  // ... các hàm CRUD chung
} 