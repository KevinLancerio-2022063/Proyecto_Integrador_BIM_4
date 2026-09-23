import { Router } from 'express';
import { AsignacionPersonalController } from '../controllers/asignacion_personal.controller';

const router = Router();

// GET /api/asignaciones-personal
router.get('/', AsignacionPersonalController.listar);

// GET /api/asignaciones-personal/:id
router.get('/:id', AsignacionPersonalController.buscarPorId);

// POST /api/asignaciones-personal
router.post('/', AsignacionPersonalController.crear);

// PUT /api/asignaciones-personal/:id
router.put('/:id', AsignacionPersonalController.actualizar);

// DELETE /api/asignaciones-personal/:id
router.delete('/:id', AsignacionPersonalController.eliminar);

export default router;