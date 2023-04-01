import express from "express";
const router = express.Router();
import {createPost, getPostById, getPosts} from "../controllers/community.controller.js"
import { verifyToken } from "../middleware/jwt.js";
import authorize from '../middleware/roleChecker.js'


router.post('/', verifyToken, createPost);
router.get('/:id', verifyToken, getPostById);
router.get('/', verifyToken, getPosts);

export default router;