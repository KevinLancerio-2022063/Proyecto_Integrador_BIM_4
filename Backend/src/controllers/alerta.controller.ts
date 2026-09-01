import { Request, Response } from 'express';
import { AlertaService } from '../services/alerta.service';

export class AlertaController {

    // GET /api/alertas
    static async listar(req: Request, res: Response) {
        const respuesta = await AlertaService.obtenerTodos();

        res.status(respuesta.success ? 200 : 400).json(respuesta);
    }

    // GET /api/alertas/:id
    static async buscarPorId(req: Request, res: Response) {
        const id = parseInt(req.params.id as string, 10);

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido',
            });
        }

        const respuesta = await AlertaService.obtenerPorId(id);

        res.status(respuesta.success ? 200 : 404).json(respuesta);
    }

    // POST /api/alertas
    static async crear(req: Request, res: Response) {
        const {
            incidente_id,
            zona_id,
            refugio_id,
            tipo,
            nivel,
            mensaje,
            estado,
            fecha,
        } = req.body;

        if (!tipo || !nivel || !mensaje) {
            return res.status(400).json({
                success: false,
                message: 'Tipo, nivel y mensaje son obligatorios',
            });
        }

        const tieneDestino =
            incidente_id !== undefined ||
            zona_id !== undefined ||
            refugio_id !== undefined;

        if (!tieneDestino) {
            return res.status(400).json({
                success: false,
                message:
                    'Debe indicar un incidente_id, zona_id o refugio_id',
            });
        }

        const respuesta = await AlertaService.crear({
            incidente_id,
            zona_id,
            refugio_id,
            tipo,
            nivel,
            mensaje,
            estado,
            fecha,
        });

        res.status(respuesta.success ? 201 : 400).json(respuesta);
    }

    // PUT /api/alertas/:id
    static async actualizar(req: Request, res: Response) {
        const id = parseInt(req.params.id as string, 10);

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido',
            });
        }

        const {
            incidente_id,
            zona_id,
            refugio_id,
            tipo,
            nivel,
            mensaje,
            estado,
            fecha,
        } = req.body;

        const respuesta = await AlertaService.actualizar(id, {
            incidente_id,
            zona_id,
            refugio_id,
            tipo,
            nivel,
            mensaje,
            estado,
            fecha,
        });

        res.status(respuesta.success ? 200 : 404).json(respuesta);
    }

    // DELETE /api/alertas/:id
    static async eliminar(req: Request, res: Response) {
        const id = parseInt(req.params.id as string, 10);

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido',
            });
        }

        const respuesta = await AlertaService.eliminar(id);

        res.status(respuesta.success ? 200 : 404).json(respuesta);
    }
}