import { Request, Response } from "express";
import { RefugioService } from "../services/refugio.service";
import { validarCrearRefugio, validarActualizarRefugio } from "../validators/refugio.validator";

export class RefugioController {

    // GET /api/refugios
    static async listar(req: Request, res: Response) {
        const respuesta = await RefugioService.obtenerTodos();
        res.status(respuesta.success ? 200 : 400).json(respuesta);
    }

    // GET /api/refugios/:id
    static async buscarPorId(req: Request, res: Response) {
        const id = parseInt(req.params.id as string);
        if (isNaN(id)) return res.status(400).json({ success: false, message: "ID inválido" });

        const respuesta = await RefugioService.obtenerPorId(id);
        res.status(respuesta.success ? 200 : 404).json(respuesta);
    }

    // POST /api/refugios
    static async crear(req: Request, res: Response) {
        // Validar datos de entrada
        const validacion = validarCrearRefugio(req.body);
        
        if (!validacion.valido) {
            return res.status(400).json({
                success: false,
                message: "Datos inválidos",
                errores: validacion.errores,
            });
        }

        const respuesta = await RefugioService.crear(req.body);
        res.status(respuesta.success ? 201 : 400).json(respuesta);
    }

    // PUT /api/refugios/:id
    static async actualizar(req: Request, res: Response) {
        const id = parseInt(req.params.id as string);
        if (isNaN(id)) return res.status(400).json({ success: false, message: "ID inválido" });

        // Validar datos de entrada
        const validacion = validarActualizarRefugio(req.body);
        
        if (!validacion.valido) {
            return res.status(400).json({
                success: false,
                message: "Datos inválidos",
                errores: validacion.errores,
            });
        }

        const respuesta = await RefugioService.actualizar(id, req.body);
        res.status(respuesta.success ? 200 : 404).json(respuesta);
    }

    // DELETE /api/refugios/:id
    static async eliminar(req: Request, res: Response) {
        const id = parseInt(req.params.id as string);
        if (isNaN(id)) return res.status(400).json({ success: false, message: "ID inválido" });

        const respuesta = await RefugioService.eliminar(id);
        res.status(respuesta.success ? 200 : 404).json(respuesta);
    }
}