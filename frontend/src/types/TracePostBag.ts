export interface TracePostBag {
    PostBagIndex: number;
    FromPOSCode: string;
    ToPOSCode: string;
    MailTripType: string;
    ServiceCode: string;
    Year: string;
    MailTripNumber: string;
    POSCode: string;
    Status?: number | null;
    StatusDescription?: string | null;
    TraceDate?: Date | null;
    TraceIndex: number;
    TransferMachine?: string | null;
    TransferUser?: string | null;
    TransferPOSCode?: string | null;
    TransferDate?: Date | null;
    TransferStatus?: boolean | null;
    TransferTimes?: number | null;
    CreateTime?: Date | null;
    LastUpdatedTime?: Date | null;
  }
  