import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PosEntity } from '../shared/pos/pos.entity';
import { PosNameService } from '../shared/pos/pos-name.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([PosEntity])
    ],
    providers: [PosNameService],
    exports: [PosNameService]
})
export class PosModule {} 