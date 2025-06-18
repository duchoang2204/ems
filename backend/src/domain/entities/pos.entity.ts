import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('POS')
export class PosEntity {
    @PrimaryColumn('nvarchar', { length: 6 })
    POSCode: string;

    @Column('nvarchar', { length: 100 })
    POSName: string;

    @Column('nvarchar', { length: 200, nullable: true })
    Address: string | null;

    @Column('nvarchar', { length: 50, nullable: true })
    AddressCode: string | null;

    @Column('nvarchar', { length: 50, nullable: true })
    Tel: string | null;

    @Column('nvarchar', { length: 50, nullable: true })
    Fax: string | null;

    @Column('nvarchar', { length: 50, nullable: true })
    IP: string | null;

    @Column('nvarchar', { length: 50, nullable: true })
    DatabaseServer: string | null;

    @Column('nvarchar', { length: 255, nullable: true })
    DatabaseUsername: string | null;

    @Column('nvarchar', { length: 255, nullable: true })
    DatabasePassword: string | null;

    @Column('nvarchar', { length: 2 })
    POSTypeCode: string;

    @Column('nvarchar', { length: 3 })
    ProvinceCode: string;

    @Column('nvarchar', { length: 50, nullable: true })
    ServiceServer: string | null;

    @Column('int', { nullable: true })
    ServicePort: number | null;

    @Column('nvarchar', { length: 3 })
    POSLevelCode: string;

    @Column('nvarchar', { length: 6 })
    CommuneCode: string;

    @Column('bit', { nullable: true })
    IsOffline: boolean | null;

    @Column('nvarchar', { length: 6, nullable: true })
    UnitCode: string | null;

    @Column('tinyint', { nullable: true })
    Status: number | null;

    @Column('datetime', { nullable: true })
    LastUpdate: Date | null;

    constructor(partial: Partial<PosEntity> = {}) {
        this.POSCode = partial.POSCode || '';
        this.POSName = partial.POSName || '';
        this.Address = partial.Address || null;
        this.AddressCode = partial.AddressCode || null;
        this.Tel = partial.Tel || null;
        this.Fax = partial.Fax || null;
        this.IP = partial.IP || null;
        this.DatabaseServer = partial.DatabaseServer || null;
        this.DatabaseUsername = partial.DatabaseUsername || null;
        this.DatabasePassword = partial.DatabasePassword || null;
        this.POSTypeCode = partial.POSTypeCode || '';
        this.ProvinceCode = partial.ProvinceCode || '';
        this.ServiceServer = partial.ServiceServer || null;
        this.ServicePort = partial.ServicePort || null;
        this.POSLevelCode = partial.POSLevelCode || '';
        this.CommuneCode = partial.CommuneCode || '';
        this.IsOffline = partial.IsOffline || null;
        this.UnitCode = partial.UnitCode || null;
        this.Status = partial.Status || null;
        this.LastUpdate = partial.LastUpdate || null;
    }
} 