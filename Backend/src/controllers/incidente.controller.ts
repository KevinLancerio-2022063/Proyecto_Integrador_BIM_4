import { Request, Response } from "express";
import { IncidenteService } from "../service/incidente.service";

export class IncidenteController {

    // Funciona para listar todos los incidentes (GET /api/incidentes)
    static async listar(req: Request, res: Response) {
        const respuesta = await IncidenteService.obtenerTodos();
        res.status(respuesta.success ? 200 : 400).json(respuesta);
    }

    // Funciona para buscar un incidente por ID (GET /api/incidentes/:id)
    static async buscarPorId(req: Request, res: Response) {
        const id = parseInt(req.params.id as string);
        if (isNaN(id)) return res.status(400).json({ success: false, message: "ID inválido" });

        const respuesta = await IncidenteService.obtenerPorId(id);
        res.status(respuesta.success ? 200 : 404).json(respuesta);
    }

    // Funciona para crear un nuevo incidente (POST /api/incidentes)
    static async crear(req: Request, res: Response) {
        const { 
            tipo, 
            titulo, 
            descripcion, 
            nivel_emergencia, 
            zona_id, 
            reportado_por, 
            latitud, 
            longitud, 
            cantidad_personas_afectadas, 
            observaciones 
        } = req.body;

        if (!tipo || !titulo || !zona_id || !reportado_por) {
            return res.status(400).json({ 
                success: false, 
                message: "Tipo, Título, Zona ID y Reportado Por son obligatorios" 
            });
        }

        const respuesta = await IncidenteService.crear({ 
            tipo, 
            titulo, 
            descripcion, 
            nivel_emergencia, 
            zona_id, 
            reportado_por, 
            latitud, 
            longitud, 
            cantidad_personas_afectadas, 
            observaciones 
        });
        
        res.status(respuesta.success ? 201 : 400).json(respuesta);
    }

    // Funciona para actualizar un incidente existente (PUT /api/incidentes/:id)
    static async actualizar(req: Request, res: Response) {
        const id = parseInt(req.params.id as string);
        const { 
            tipo, 
            titulo, 
            descripcion, 
            nivel_emergencia, 
            estado, 
            fecha_cierre, 
            latitud, 
            longitud, 
            cantidad_personas_afectadas, 
            observaciones 
        } = req.body;

        if (isNaN(id)) return res.status(400).json({ success: false, message: "ID inválido" });

        const respuesta = await IncidenteService.actualizar(id, { 
            tipo, 
            titulo, 
            descripcion, 
            nivel_emergencia, 
            estado, 
            fecha_cierre, 
            latitud, 
            longitud, 
            cantidad_personas_afectadas, 
            observaciones 
        });

        res.status(respuesta.success ? 200 : 404).json(respuesta);
    }

    // Funciona para eliminar un incidente (DELETE /api/incidentes/:id)
    static async eliminar(req: Request, res: Response) {
        const id = parseInt(req.params.id as string);
        if (isNaN(id)) return res.status(400).json({ success: false, message: "ID inválido" });

        const respuesta = await IncidenteService.eliminar(id);
        res.status(respuesta.success ? 200 : 404).json(respuesta);
    }
}