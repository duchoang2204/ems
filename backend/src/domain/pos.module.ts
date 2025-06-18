import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PosEntity } from './entities/pos.entity';
import { PosNameService } from './services/pos-name.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([PosEntity])
    ],
    providers: [PosNameService],
    exports: [PosNameService]
})
export class PosModule {} 