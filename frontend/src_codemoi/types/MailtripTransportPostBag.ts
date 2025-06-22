export interface MailtripTransportPostBag {
    PostBagIndex: number;
    FromPOSCode: string;
    ToPOSCode: string;
    MailtripType: string;
    ServiceCode: string;
    Year: string;
    MailTripNumber: string;
    Status: number;
    BC37Index: number;
    BC37FromPOSCode: string;
    BC37Date: string;
    BC37ToPOSCode: string;
    TransportTypeCode: string;
    BC37Order?: number | null;
    ConfirmUser?: string | null;
    ConfirmPOSCode?: string | null;
    CreateUser?: string | null;
    CreatePOSCode?: string | null;
    ConfirmDate?: Date | null;
    CreateTime?: Date | null;
    LastUpdatedTime?: Date | null;
  }
  