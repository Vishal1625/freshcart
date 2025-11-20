import express from 'express';
import { adminAuth } from '../middleware/adminAuth.js';
import { getAllOrdersAdmin } from '../controllers/adminOrderController.js';


const router = express.Router();
router.get('/', adminAuth, getAllOrdersAdmin);
import express from 'express';
import { adminLogin } from '../controllers/adminAuthController.js';

router.post('/login', adminLogin);
export default router;