import { IsString, IsNotEmpty } from 'class-validator';

export class GetE1DetailsRequestDto {
  @IsString()
  @IsNotEmpty()
  mae1!: string;

  @IsNotEmpty()
  fromDate!: Date;

  @IsNotEmpty()
  toDate!: Date;
} 