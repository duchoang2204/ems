export class E1Detail {
  constructor(
    public stt: number,
    public ngayCT: string,
    public gioCT: string,
    public buuCucDong: string,
    public buuCucNhan: string,
    public thongTinCT: string,
    public isSpecialTable: boolean,
    public tableType: 'LIEN_TINH' | 'NOI_TINH',
    public direction: 'DEN' | 'DI'
  ) {}

  static create(
    stt: number,
    ngayCT: string,
    gioCT: string,
    buuCucDong: string,
    buuCucNhan: string,
    thongTinCT: string,
    isSpecialTable: boolean,
    tableType: 'LIEN_TINH' | 'NOI_TINH',
    direction: 'DEN' | 'DI'
  ): E1Detail {
    return new E1Detail(
      stt,
      ngayCT,
      gioCT,
      buuCucDong,
      buuCucNhan,
      thongTinCT,
      isSpecialTable,
      tableType,
      direction
    );
  }
} 