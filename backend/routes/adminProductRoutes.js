import express from 'express';
import { adminAuth } from '../middleware/adminAuth.js';
import { addProduct, getProducts, updateProduct, deleteProduct } from '../controllers/Product Controller.js';


const router = express.Router();


router.post('/', adminAuth, addProduct);
router.get('/', adminAuth, getProducts);
router.put('/:id', adminAuth, updateProduct);
router.delete('/:id', adminAuth, deleteProduct);


export default router;