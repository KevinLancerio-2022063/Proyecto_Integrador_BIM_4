import { Request, Response } from "express";
import { HistorialIncidenteService } from "../service/historial_incidente.service";

export class HistorialIncidenteController {

    
    static async obtenerPorIncidente(req: Request, res: Response) {
        const incidenteId = parseInt(req.params.incidenteId as string);
        if (isNaN(incidenteId)) {
            return res.status(400).json({ success: false, message: "ID de incidente inválido" });
        }

        const respuesta = await HistorialIncidenteService.obtenerPorIncidenteId(incidenteId);
        res.status(respuesta.success ? 200 : 404).json(respuesta);
    }

    static async crear(req: Request, res: Response) {
        const { incidente_id, estado_anterior, estado_nuevo, comentario, usuario_id } = req.body;

        if (!incidente_id || !estado_nuevo) {
            return res.status(400).json({ 
                success: false, 
                message: "El ID del incidente y el estado nuevo son obligatorios" 
            });
        }

        const respuesta = await HistorialIncidenteService.crear({ 
            incidente_id, 
            estado_anterior, 
            estado_nuevo, 
            comentario, 
            usuario_id 
        });

        res.status(respuesta.success ? 201 : 400).json(respuesta);
    }
}