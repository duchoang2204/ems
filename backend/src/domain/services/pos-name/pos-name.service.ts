import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PosEntity } from '../../entities/pos.entity';



@Injectable()
export class PosNameService {
    private posNameCache: Map<string, string> = new Map();

    constructor(
        @InjectRepository(PosEntity)
        private readonly posRepository: Repository<PosEntity>
    ) {}

    async getPosName(posCode: string): Promise<string> {
        // Kiểm tra cache trước
        const cachedName = this.posNameCache.get(posCode);
        if (cachedName) {
            return cachedName;
        }

        // Nếu không có trong cache, query từ DB
        const pos = await this.posRepository.findOne({
            where: { POSCode: posCode },
            select: ['POSName']
        });

        if (!pos) {
            // Nếu không tìm thấy, trả về mã bưu cục
            return posCode;
        }

        // Lưu vào cache và trả về tên
        this.posNameCache.set(posCode, pos.POSName);
        return pos.POSName;
    }

    async clearCache(): Promise<void> {
        this.posNameCache.clear();
    }
} 