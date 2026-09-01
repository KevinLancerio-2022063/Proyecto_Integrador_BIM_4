import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateLogin } from '../validators/auth.validator';

const router = Router();
const controller = new AuthController();

router.post('/login', validateLogin, controller.login.bind(controller));
router.get('/verify', controller.verifyToken.bind(controller));

export default router;