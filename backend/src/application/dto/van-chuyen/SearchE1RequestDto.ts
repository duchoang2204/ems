import { IsString, IsOptional, IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';

export class SearchE1RequestDto {
  @IsString()
  @IsOptional()
  fromDate?: string; // YYYYMMDD

  @IsString()
  @IsOptional()
  toDate?: string; // YYYYMMDD

  @IsString()
  @IsOptional()
  mabcDong?: string; // Mã bưu cục đóng

  @IsString()
  @IsOptional()
  mabcNhan?: string; // Mã bưu cục nhận

  @IsString()
  @IsNotEmpty()
  chthu!: string; // Chuyến thư

  @IsString()
  @IsNotEmpty()
  tuiso!: string; // Túi số

  @IsString()
  @IsOptional()
  khoiluong?: string; // Khối lượng

  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  limit?: number;

  @IsBoolean()
  @IsOptional()
  isPolling?: boolean;
} 