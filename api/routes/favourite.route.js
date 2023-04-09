import express from 'express'
import {
  create,
  getAll,
  deleteSingle,
  deleteAll,
} from '../controllers/favourite.controller.js'
import { verifyToken } from '../middleware/jwt.js'
const router = express.Router()

// Following/Followers Routes:
router.post('/add/:id', verifyToken, create)
router.put('/remove/:id', verifyToken, getAll)
router.delete('/destroy', verifyToken, deleteSingle)
router.get('/', verifyToken, deleteAll)

export default router
