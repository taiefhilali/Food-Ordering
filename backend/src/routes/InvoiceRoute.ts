// routes/invoice.js
import express from 'express';
import { saveInvoice } from '../controllers/InvoiceController'; // Adjust the path

const router = express.Router();

router.post('/save-invoice', saveInvoice);

export default router;
