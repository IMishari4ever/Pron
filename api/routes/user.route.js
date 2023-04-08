import express from 'express'
import {
  allUser,
  deleteUser,
  followersList,
  followingList,
  follow,
  getUser,
  unfollow,
} from '../controllers/user.controller.js'
import { verifyToken } from '../middleware/jwt.js'
import authorize from './../middleware/roleChecker.js'

const router = express.Router()

// Following/Followers Routes:
router.post('/:id/follow', verifyToken, follow)
router.put('/:id/unfollow', verifyToken, unfollow)
router.get('/:id/followers', verifyToken, followersList)
router.get('/:id/followings', verifyToken, followingList)

// User CRUD Functionalities
router.delete('/:id', verifyToken, deleteUser)
router.get('/', verifyToken, authorize(['admin']), allUser)
router.get('/:id', getUser)

export default router
