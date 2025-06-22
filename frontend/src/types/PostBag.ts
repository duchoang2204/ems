export interface PostBag {
    PostBagIndex: number;
    PostBagTypeCode: string;
    F: boolean;
    FromPOSCode: string;
    ToPOSCode: string;
    MailTripType: string;
    ServiceCode: string;
    Year: string;
    MailTripNumber: string;
    PostBagNumber?: string | null;
    Weight: number;
    Status?: number | null;
    Quantity?: number | null;
    IsPrinted?: boolean | null;
    BC37Date?: Date | null;
    PackagingTime?: Date | null;
    PackagingUser?: string | null;
    PackagingMachine?: string | null;
    OpeningTime?: Date | null;
    OpeningMachine?: string | null;
    OpeningUser?: string | null;
    IncomingDate?: Date | null;
    CaseWeight?: number | null;
    IsDiscrete?: boolean | null;
    IsDeliveryRoute?: boolean | null;
    PostBagCode?: string | null;
    Note?: string | null;
    CreateTime?: Date | null;
    LastUpdatedTime?: Date | null;
    PostBagWeightConvert?: number | null;
  }
  