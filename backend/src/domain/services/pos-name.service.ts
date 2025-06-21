import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PosEntity } from '../../shared/pos/pos.entity';
import { IPosRepository } from '../../shared/pos/pos.repository.interface';

@Injectable()
export class PosNameService {
    private posNameCache: Map<string, string> = new Map();

    constructor(
        @InjectRepository(PosEntity)
        private readonly posRepository: Repository<PosEntity>,
        @InjectRepository(IPosRepository)
        private readonly posRepositoryInterface: IPosRepository
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

    async getPosNames(posCodes: string[]): Promise<Record<string, string>> {
        const uniquePosCodes = [...new Set(posCodes)];
        const namesMap: Record<string, string> = {};
        
        const promises = uniquePosCodes.map(async (code) => {
            const name = await this.getPosName(code);
            namesMap[code] = name;
        });

        await Promise.all(promises);
        return namesMap;
    }

    async clearCache(): Promise<void> {
        this.posNameCache.clear();
    }
} 