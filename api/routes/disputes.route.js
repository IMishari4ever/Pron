import express from 'express'
const router = express.Router()
import {
  create,
  singleData,
  allData,
  updateOne,
} from '../controllers/disputes.controller.js'
import { verifyToken } from '../middleware/jwt.js'

router.post('/', verifyToken, create)
router.get('/:disputeID', verifyToken, singleData)
router.get('/', verifyToken, allData)
router.get('/:disputeID', verifyToken, updateOne)

export default router
