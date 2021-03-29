import express from 'express';

import { getTransaction, createTransaction } from '../controllers/transaction.js';
import auth from '../middleware/auth.js'

const router = express.Router();

router.get('/', getTransaction);
router.post('/',auth, createTransaction);


export default router;