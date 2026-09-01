import { Request, Response } from "express";
import { AsignacionRecursoService } from "../services/asignacion_recurso.service";
import { validarCrearAsignacionRecurso, validarActualizarAsignacionRecurso } from "../validators/asignacion_recurso.validator";

export class AsignacionRecursoController {

    // GET /api/asignaciones-recurso
    static async listar(req: Request, res: Response) {
        const respuesta = await AsignacionRecursoService.obtenerTodas();
        res.status(respuesta.success ? 200 : 400).json(respuesta);
    }

    // GET /api/asignaciones-recurso/:id
    static async buscarPorId(req: Request, res: Response) {
        const id = parseInt(req.params.id as string);
        if (isNaN(id)) return res.status(400).json({ success: false, message: "ID inválido" });

        const respuesta = await AsignacionRecursoService.obtenerPorId(id);
        res.status(respuesta.success ? 200 : 404).json(respuesta);
    }

    // POST /api/asignaciones-recurso
    static async crear(req: Request, res: Response) {
        // Validar datos de entrada
        const validacion = validarCrearAsignacionRecurso(req.body);
        
        if (!validacion.valido) {
            return res.status(400).json({
                success: false,
                message: "Datos inválidos",
                errores: validacion.errores,
            });
        }

        const respuesta = await AsignacionRecursoService.crear(req.body);
        res.status(respuesta.success ? 201 : 400).json(respuesta);
    }

    // PUT /api/asignaciones-recurso/:id
    static async actualizar(req: Request, res: Response) {
        const id = parseInt(req.params.id as string);
        if (isNaN(id)) return res.status(400).json({ success: false, message: "ID inválido" });

        // Validar datos de entrada
        const validacion = validarActualizarAsignacionRecurso(req.body);
        
        if (!validacion.valido) {
            return res.status(400).json({
                success: false,
                message: "Datos inválidos",
                errores: validacion.errores,
            });
        }

        const respuesta = await AsignacionRecursoService.actualizar(id, req.body);
        res.status(respuesta.success ? 200 : 404).json(respuesta);
    }

    // DELETE /api/asignaciones-recurso/:id
    static async eliminar(req: Request, res: Response) {
        const id = parseInt(req.params.id as string);
        if (isNaN(id)) return res.status(400).json({ success: false, message: "ID inválido" });

        const respuesta = await AsignacionRecursoService.eliminar(id);
        res.status(respuesta.success ? 200 : 404).json(respuesta);
    }
}