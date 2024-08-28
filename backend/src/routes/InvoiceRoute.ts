// routes/invoice.js
import express from 'express';
import { saveInvoice,getInvoicesByRestaurant,getAllInvoices } from '../controllers/InvoiceController'; // Adjust the path
const { verifyToken } = require('../middleware/verifyToken');

const router = express.Router();

router.post('/checkout', verifyToken,saveInvoice);
router.get('/all', getAllInvoices);
router.get('/:restaurantName', getInvoicesByRestaurant); // Add this route

export default router;
