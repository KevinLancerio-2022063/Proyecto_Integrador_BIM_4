import { Router } from 'express';
import { ZonaController } from '../controllers/zona.controller';
import { validateZona } from '../validators/zona.validator';

const router = Router();
const controller = new ZonaController();

router.get('/', controller.findAll.bind(controller));
router.get('/:id', controller.findById.bind(controller));
router.post('/', validateZona, controller.create.bind(controller));
router.put('/:id', validateZona, controller.update.bind(controller));
router.delete('/:id', controller.delete.bind(controller));

export default router;