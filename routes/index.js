import { Router } from 'express'
import User from'./user'

const router = Router()

router.use('/users', User)

export default router
