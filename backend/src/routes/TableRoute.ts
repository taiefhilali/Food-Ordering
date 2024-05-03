import express from "express";
import {generateCode,processCode} from "../controllers/TableController";
const router=express.Router();

router.get('/generate-qr-code', generateCode);
router.post('/process-qr-code',processCode);


export default router;