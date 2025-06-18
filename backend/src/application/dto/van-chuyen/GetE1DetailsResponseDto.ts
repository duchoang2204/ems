export class E1DetailInfo {
  stt!: number;
  ngayCT!: string;
  gioCT!: string;
  buuCucDong!: string;
  buuCucNhan!: string;
  thongTinCT!: string;
  isSpecialTable!: boolean;
  tableType!: 'LIEN_TINH' | 'NOI_TINH';
  direction!: 'DEN' | 'DI';
}

export class GetE1DetailsResponseDto {
  e1Details!: E1DetailInfo[];
} 