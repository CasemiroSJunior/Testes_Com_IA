import { Router } from 'express'
import usersRouter from './users.routes'
import aiRouter from './ai.routes'

const router = Router()

router.use('/users', usersRouter);
router.use('/ai', aiRouter);

export default router
