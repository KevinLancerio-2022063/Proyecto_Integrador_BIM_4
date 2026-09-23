import { Router } from 'express';
import { UsuarioController } from '../controllers/usuario.controller';
import { validateUsuario } from '../validators/usuario.validator';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const controller = new UsuarioController();

router.get('/', authMiddleware, controller.findAll.bind(controller));
router.get('/:id', authMiddleware, controller.findById.bind(controller))
router.post('/', authMiddleware, roleMiddleware('ADMIN'), validateUsuario, controller.create.bind(controller));
router.put('/:id', authMiddleware, roleMiddleware('ADMIN'), validateUsuario, controller.update.bind(controller));
router.delete('/:id', authMiddleware, roleMiddleware('ADMIN'), controller.delete.bind(controller));

export default router;