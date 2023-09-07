import express from 'express'
const router = express.Router()
import {
  createTicket,
  getTicketById,
  getTickets,
} from '../controllers/ticket.controller.js'
import { verifyToken } from '../middleware/jwt.js'
import authorize from '../middleware/roleChecker.js'

router.post('/', verifyToken, createTicket)
router.get('/:id', verifyToken, getTicketById)
router.get('/', verifyToken, getTickets)

export default router
