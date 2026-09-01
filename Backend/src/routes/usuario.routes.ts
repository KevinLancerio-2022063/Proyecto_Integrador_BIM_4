import { Router } from 'express';
import { UsuarioController } from '../controllers/usuario.controller';
import { validateUsuario } from '../validators/usuario.validator';

const router = Router();
const controller = new UsuarioController();

router.get('/', controller.findAll.bind(controller));
router.get('/:id', controller.findById.bind(controller));
router.post('/', validateUsuario, controller.create.bind(controller));
router.put('/:id', validateUsuario, controller.update.bind(controller));
router.delete('/:id', controller.delete.bind(controller));

export default router;