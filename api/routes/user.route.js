import express from 'express'
import { allUser, deleteUser, getUser } from '../controllers/user.controller.js'
import { verifyToken } from '../middleware/jwt.js'
import authorize from './../middleware/roleChecker.js'

const router = express.Router()

router.delete('/:id', verifyToken, deleteUser)
router.get('/:id', getUser)
router.get('/', verifyToken, authorize(['admin']), allUser)

// router.get('/', allUser)

export default router
