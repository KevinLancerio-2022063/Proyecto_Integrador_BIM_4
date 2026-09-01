import { Request, Response } from "express";
import { RecursoService } from "../services/recurso.service";
import { validarCrearRecurso, validarActualizarRecurso } from "../validators/recurso.validator";

export class RecursoController {

    // GET /api/recursos
    static async listar(req: Request, res: Response) {
        const respuesta = await RecursoService.obtenerTodos();
        res.status(respuesta.success ? 200 : 400).json(respuesta);
    }

    // GET /api/recursos/:id
    static async buscarPorId(req: Request, res: Response) {
        const id = parseInt(req.params.id as string);
        if (isNaN(id)) return res.status(400).json({ success: false, message: "ID inválido" });

        const respuesta = await RecursoService.obtenerPorId(id);
        res.status(respuesta.success ? 200 : 404).json(respuesta);
    }

    // POST /api/recursos
    static async crear(req: Request, res: Response) {
        // Validar datos de entrada
        const validacion = validarCrearRecurso(req.body);
        
        if (!validacion.valido) {
            return res.status(400).json({
                success: false,
                message: "Datos inválidos",
                errores: validacion.errores,
            });
        }

        const respuesta = await RecursoService.crear(req.body);
        res.status(respuesta.success ? 201 : 400).json(respuesta);
    }

    // PUT /api/recursos/:id
    static async actualizar(req: Request, res: Response) {
        const id = parseInt(req.params.id as string);
        if (isNaN(id)) return res.status(400).json({ success: false, message: "ID inválido" });

        // Validar datos de entrada
        const validacion = validarActualizarRecurso(req.body);
        
        if (!validacion.valido) {
            return res.status(400).json({
                success: false,
                message: "Datos inválidos",
                errores: validacion.errores,
            });
        }

        const respuesta = await RecursoService.actualizar(id, req.body);
        res.status(respuesta.success ? 200 : 404).json(respuesta);
    }

    // DELETE /api/recursos/:id
    static async eliminar(req: Request, res: Response) {
        const id = parseInt(req.params.id as string);
        if (isNaN(id)) return res.status(400).json({ success: false, message: "ID inválido" });

        const respuesta = await RecursoService.eliminar(id);
        res.status(respuesta.success ? 200 : 404).json(respuesta);
    }
}
