import { E1Model } from "../models/e1.model";
import { E1SearchRequest, E1SearchResponse, E1DetailResponse } from "../types/e1.types";

export class E1Service {
  static async search(params: E1SearchRequest): Promise<E1SearchResponse> {
    const { page = 1, limit = 10 } = params;
    const { rows, totalCount, totalWeight } = await E1Model.search(params);

    // Format response data
    const data = rows.map(row => ({
      mae1: row.MAE1,
      ngay: row.NGAY,
    }));

    return {
      data,
      totalCount,
      totalWeight,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  }

  static async getDetails(mae1: string): Promise<E1DetailResponse> {
    return await E1Model.getDetails(mae1);
  }

  static async exportToExcel(params: E1SearchRequest): Promise<Buffer> {
    // TODO: Implement Excel export
    throw new Error("Not implemented");
  }
} 