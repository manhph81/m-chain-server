import express from 'express';

import { signin, signup, updateUser } from '../controllers/user.js';

import auth from '../middleware/auth.js'
const router = express.Router();


router.post('/signin', signin);
router.post('/signup', signup);
router.patch('/:id',auth, updateUser);

export default router;