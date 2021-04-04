import express from 'express';

import { getProcess, getPro , createProcess, updateProcess, deleteProcess } from '../controllers/process.js';
import auth from '../middleware/auth.js'

const router = express.Router();

router.get('/', getProcess);
router.get('/:id',auth, getPro);
router.post('/',auth, createProcess);
router.patch('/:id',auth, updateProcess);
router.delete('/:id',auth, deleteProcess);

export default router;