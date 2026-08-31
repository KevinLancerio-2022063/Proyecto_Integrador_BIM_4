import { Request, Response } from "express";
import { RecursoService } from "../services/recurso.service";

export class RecursoController {

    // Funciona para listar todos los recursos (GET /api/recursos)
    static async listar(req: Request, res: Response) {
        const respuesta = await RecursoService.obtenerTodos();
        res.status(respuesta.success ? 200 : 400).json(respuesta);
    }

    // Funciona para buscar un recurso por ID (GET /api/recursos/:id)
    static async buscarPorId(req: Request, res: Response) {
        const id = parseInt(req.params.id as string);
        if (isNaN(id)) return res.status(400).json({ success: false, message: "ID inválido" });

        const respuesta = await RecursoService.obtenerPorId(id);
        res.status(respuesta.success ? 200 : 404).json(respuesta);
    }

    // Funciona para crear un nuevo recurso (POST /api/recursos)
    static async crear(req: Request, res: Response) {
        const { nombre, tipo, unidad_medida, cantidad_total, descripcion } = req.body;

        if (!nombre || !tipo) {
            return res.status(400).json({ success: false, message: "Nombre y Tipo son obligatorios" });
        }

        const respuesta = await RecursoService.crear({ nombre, tipo, unidad_medida, cantidad_total, descripcion });
        res.status(respuesta.success ? 201 : 400).json(respuesta);
    }

    // Funciona para actualizar un recurso existente (PUT /api/recursos/:id)
    static async actualizar(req: Request, res: Response) {
        const id = parseInt(req.params.id as string);
        const { nombre, tipo, unidad_medida, cantidad_total, descripcion } = req.body;

        if (isNaN(id)) return res.status(400).json({ success: false, message: "ID inválido" });
        if (!nombre || !tipo || !unidad_medida || cantidad_total === undefined) {
            return res.status(400).json({ success: false, message: "Faltan campos obligatorios" });
        }

        const respuesta = await RecursoService.actualizar(id, { nombre, tipo, unidad_medida, cantidad_total, descripcion });
        res.status(respuesta.success ? 200 : 404).json(respuesta);
    }

    // Funciona para eliminar un recurso (DELETE /api/recursos/:id)
    static async eliminar(req: Request, res: Response) {
        const id = parseInt(req.params.id as string);
        if (isNaN(id)) return res.status(400).json({ success: false, message: "ID inválido" });

        const respuesta = await RecursoService.eliminar(id);
        res.status(respuesta.success ? 200 : 404).json(respuesta);
    }
}