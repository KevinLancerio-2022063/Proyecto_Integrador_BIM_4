import { Router } from 'express';
import { AlertaController } from '../controllers/alerta.controller';

const router = Router();

// GET /api/alertas
router.get('/', AlertaController.listar);

// GET /api/alertas/:id
router.get('/:id', AlertaController.buscarPorId);

// POST /api/alertas
router.post('/', AlertaController.crear);

// PUT /api/alertas/:id
router.put('/:id', AlertaController.actualizar);

// DELETE /api/alertas/:id
router.delete('/:id', AlertaController.eliminar);

export default router;