import express from 'express'
import {
  approveGig,
  createGig,
  deleteGig,
  getGig,
  getGigs,
  pinGig,
  pinned,
} from '../controllers/gig.controller.js'
import { verifyToken } from '../middleware/jwt.js'

const router = express.Router()

router.post('/', verifyToken, createGig)
router.delete('/:id', verifyToken, deleteGig)
router.get('/single/:id', getGig)
router.get('/', getGigs)
router.put('/:id/pin', pinGig)
router.get('/pinned', pinned)
router.put('/:gigID/approve/:notificationID', verifyToken, approveGig)
export default router
