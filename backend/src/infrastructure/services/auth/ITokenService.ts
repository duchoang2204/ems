export interface TokenPayload {
  manv: number;
  mucdo: number;
  ketoan: number;
  g_mabc: string;
}

export interface ITokenService {
  generateToken(payload: TokenPayload): string;
} 