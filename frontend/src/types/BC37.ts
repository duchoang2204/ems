export interface BC37 {
    BC37Index: number;
    FromPOSCode: string;
    ToPOSCode: string;
    TransportTypeCode: string;
    Status: number;
    BC37Date: string;
    ConfirmUser?: string | null;
    ConfirmPOSCode?: string | null;
    CreateUser?: string | null;
    CreatePOSCode?: string | null;
    BC37Code?: string | null;
    ConfirmDate?: Date | null;
    TransferMachine?: string | null;
    TransferUser?: string | null;
    TransferPOSCode?: string | null;
    TransferDate?: Date | null;
    TransferStatus?: boolean | null;
    TransferTimes?: number | null;
    TotalOtherPostBag?: number | null;
    TotalWeightOtherPostBag?: number | null;
    TotalPHBCPostBag?: number | null;
    TotalWeightPHBCPostBag?: number | null;
    MailRouteCode?: string | null;
    MailRouteFromPOSCode?: string | null;
    MailRouteScheduleCode?: string | null;
    SendingTime?: Date | null;
    CreateTime?: Date | null;
    LastUpdatedTime?: Date | null;
  }
  