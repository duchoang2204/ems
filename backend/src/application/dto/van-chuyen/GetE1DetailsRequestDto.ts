import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class GetE1DetailsRequestDto {
  @IsString()
  @IsNotEmpty()
  mae1!: string;

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
} 