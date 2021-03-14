import express from 'express';

import { getProducts, getProduct, createProduct, updateProduct, likeProduct, deleteProduct } from '../controllers/products.js';
import auth from '../middleware/auth.js'

const router = express.Router();

router.get('/', getProducts);
router.post('/',auth, createProduct);
router.get('/:id',auth, getProduct);
router.patch('/:id',auth, updateProduct);
router.delete('/:id',auth, deleteProduct);
router.patch('/:id/likeProduct',auth, likeProduct);



export default router;