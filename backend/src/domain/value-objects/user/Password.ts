export class ValueObject {
  private constructor(private readonly value: string) {}

  public static create(password: string): ValueObject {
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    return new ValueObject(password);
  }

  public verify(password: string): boolean {
    return this.value === password;
  }

  public getValue(): string {
    return this.value;
  }
} 