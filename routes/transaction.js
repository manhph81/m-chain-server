import express from 'express';

import { getTransactions, getTransaction, createTransaction, createTransactionB2B } from '../controllers/transaction.js';
import auth from '../middleware/auth.js'

const router = express.Router();

router.get('/', getTransactions);
router.get('/:id', getTransaction);
router.post('/',auth, createTransaction);
// router.post('/B2B',auth, createTransaction);
router.post('/B2B',auth, createTransactionB2B);


export default router;