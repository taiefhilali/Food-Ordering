// routes/invoice.js
import express from 'express';
import { saveInvoice,getInvoicesByRestaurant,getAllInvoices,getInvoicesByUser,getInvoicesByRestaurantid,notifyOrderReady,getinfosid,getUserRecommendations,generateInvoicePDF,exportpdf} from '../controllers/InvoiceController'; // Adjust the path
const { verifyToken } = require('../middleware/verifyToken');

const router = express.Router();

router.post('/checkout', verifyToken,saveInvoice);
router.get('/all', getAllInvoices);
router.get('/user/:userId', verifyToken,getInvoicesByUser);
router.get('/:invoiceId',getinfosid);
router.get('/restaurant/:restaurantId', getInvoicesByRestaurantid);
router.get('/generate-pdf/:id',exportpdf)
router.get('/:restaurantName', getInvoicesByRestaurant);
router.post('/:invoiceId/notify', notifyOrderReady);
router.get('/recommendations', getUserRecommendations);

export default router;
