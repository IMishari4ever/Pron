import express from 'express'
import { verifyToken } from '../middleware/jwt.js'
import {
  getOrders,
  makePayment,
  purchaseGig,
} from '../controllers/order.controller.js'

const router = express.Router()

// router.post("/:gigId", verifyToken, createOrder);
router.get('/', verifyToken)
router.post('/create-payment/:id', verifyToken, purchaseGig)
router.put('/', verifyToken)

router.get('/pay', makePayment)
router.post('/payment-callback', makePayment)

export default router
