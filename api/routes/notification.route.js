import express from 'express'
import { verifyToken } from '../middleware/jwt.js'
import {
  getNotifications,
  readNotification,
} from './../controllers/notification.controller.js'

const router = express.Router()

router.get('/', verifyToken, getNotifications)
router.put('/:id', verifyToken, readNotification)

export default router
