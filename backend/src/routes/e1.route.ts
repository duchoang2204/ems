import express from "express";
import { E1Controller } from "../controllers/e1.controller";

const router = express.Router();

router.post("/search", E1Controller.search);
router.get("/details/:mae1", E1Controller.getDetails);
router.post("/export", E1Controller.exportToExcel);

export default router; 