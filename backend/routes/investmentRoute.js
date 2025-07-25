import express from 'express'
const router = express.Router();
import { getRecommendation, handleChat } from '../controllers/investmentController.js'
import authUser from '../middlewares/authUser.js'

router.get('/recommendation', authUser, getRecommendation);
router.post('/chat', authUser, handleChat);

export default router