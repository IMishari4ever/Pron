import express from 'express'
const router = express.Router()
import { verifyToken } from '../middleware/jwt.js'
import authorize from '../middleware/roleChecker.js'
import {
  approveWithdrawal,
  withdrawAmount,
} from '../controllers/withdraw.controller.js'

router.post('/', verifyToken, authorize('user'), withdrawAmount)
router.put('/approve/:id', verifyToken, authorize('admin'), approveWithdrawal)

export default router
