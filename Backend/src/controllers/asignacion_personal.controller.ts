import { Request, Response } from 'express';
import { AsignacionPersonalService } from '../services/asignacion_personal.service';

export class AsignacionPersonalController {

    // GET /api/asignaciones-personal
    static async listar(req: Request, res: Response) {
        const respuesta =
            await AsignacionPersonalService.obtenerTodos();

        res.status(respuesta.success ? 200 : 400).json(respuesta);
    }

    // GET /api/asignaciones-personal/:id
    static async buscarPorId(req: Request, res: Response) {
        const id = parseInt(req.params.id as string, 10);

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido',
            });
        }

        const respuesta =
            await AsignacionPersonalService.obtenerPorId(id);

        res.status(respuesta.success ? 200 : 404).json(respuesta);
    }

    // POST /api/asignaciones-personal
    static async crear(req: Request, res: Response) {
        const {
            usuario_id,
            rol_asignado,
            estado,
            incidente_id,
            refugio_id,
            observaciones,
        } = req.body;

        if (usuario_id == null) {
            return res.status(400).json({
                success: false,
                message: 'El usuario_id es obligatorio',
            });
        }

        const tieneIncidente = incidente_id != null;
        const tieneRefugio = refugio_id != null;

        if (tieneIncidente === tieneRefugio) {
            return res.status(400).json({
                success: false,
                message:
                    'Debe indicar exactamente un incidente_id o un refugio_id',
            });
        }

        const respuesta = await AsignacionPersonalService.crear({
            usuario_id,
            rol_asignado,
            estado,
            incidente_id,
            refugio_id,
            observaciones,
        });

        res.status(respuesta.success ? 201 : 400).json(respuesta);
    }

    // PUT /api/asignaciones-personal/:id
    static async actualizar(req: Request, res: Response) {
        const id = parseInt(req.params.id as string, 10);

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido',
            });
        }

        const {
            rol_asignado,
            estado,
            fecha_finalizacion,
            observaciones,
        } = req.body;

        const respuesta =
            await AsignacionPersonalService.actualizar(id, {
                rol_asignado,
                estado,
                fecha_finalizacion,
                observaciones,
            });

        res.status(respuesta.success ? 200 : 404).json(respuesta);
    }

    // DELETE /api/asignaciones-personal/:id
    static async eliminar(req: Request, res: Response) {
        const id = parseInt(req.params.id as string, 10);

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido',
            });
        }

        const respuesta =
            await AsignacionPersonalService.eliminar(id);

        res.status(respuesta.success ? 200 : 404).json(respuesta);
    }
}