import express from "express";
import tableController from "../controllers/TableController";
const router=express.Router();

router.get('/generate-qr-code',tableController.generateCode);
router.post('/process-qr-code',tableController.processCode);


export default router;