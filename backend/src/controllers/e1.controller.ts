import { Request, Response } from "express";
import { E1Service } from "../services/e1.service";
import { E1SearchRequest } from "../types/e1.types";

export class E1Controller {
  static async search(req: Request, res: Response) {
    try {
      const params = req.body as E1SearchRequest;
      const result = await E1Service.search(params);
      return res.json(result);
    } catch (err) {
      console.error("Error /api/e1/search:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async getDetails(req: Request, res: Response) {
    try {
      const { mae1 } = req.params;
      const result = await E1Service.getDetails(mae1);
      return res.json(result);
    } catch (err) {
      console.error("Error /api/e1/details:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async exportToExcel(req: Request, res: Response) {
    try {
      const params = req.body as E1SearchRequest;
      const buffer = await E1Service.exportToExcel(params);
      
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", "attachment; filename=e1_search.xlsx");
      return res.send(buffer);
    } catch (err) {
      console.error("Error /api/e1/export:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
} 