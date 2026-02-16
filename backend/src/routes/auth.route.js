
import express from 'express'
import { login, signup } from '../controllers/auth.controller.js'
import { validateSignup, validateLogin } from '../middleware/validateInput.middleware.js'

const router = express.Router()

router.post("/signup", validateSignup, signup)
router.post("/login", validateLogin, login)

export default router