export interface POS {
    POSCode: string;
    POSName: string;
    Address?: string;
    AddressCode?: string;
    Tel?: string;
    Fax?: string;
    IP?: string;
    DatabaseServer?: string;
    DatabaseUsername?: string;
    DatabasePassword?: string;
    POSTypeCode: string;
    ProvinceCode: string;
    ServiceServer?: string;
    ServicePort?: number;
    POSLevelCode: string;
    CommuneCode: string;
    IsOffline?: boolean;
    UnitCode?: string;
    Status?: number;         // tinyint ~ number
    LastUpdate?: string;     // datetime thường map với string (ISO) hoặc Date nếu xử lý
  }
  