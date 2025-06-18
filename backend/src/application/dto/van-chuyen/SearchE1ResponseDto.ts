export class E1Info {
  mae1!: string;
  ngay!: string;
  mabcDong!: string;
  mabcNhan!: string;
  chthu!: string;
  tuiso!: string;
  khoiluong!: string;
}

export class SearchE1ResponseDto {
  data!: E1Info[];
  totalCount!: number;
  totalWeight!: number;
  currentPage!: number;
  totalPages!: number;
} 