import { Router } from 'express';
import { ZonaController } from '../controllers/zona.controller';
import { validateZona } from '../validators/zona.validator';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const controller = new ZonaController();

router.get('/', authMiddleware, controller.findAll.bind(controller));
router.get('/:id', authMiddleware, controller.findById.bind(controller));

router.post('/', authMiddleware, roleMiddleware('ADMIN'), validateZona, controller.create.bind(controller));
router.put('/:id', authMiddleware, roleMiddleware('ADMIN'), validateZona, controller.update.bind(controller));
router.delete('/:id', authMiddleware, roleMiddleware('ADMIN'), controller.delete.bind(controller));

export default router;