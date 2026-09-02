import { Request, Response } from "express";
import { HistorialIncidenteService } from "../service/historial_incidente.service";
import { validarActualizarHistorialIncidente } from "../validators/historial_incidente.validator";

export class HistorialIncidenteController {

    
    // Funciona para listar todos los historiales (GET /api/historial-incidentes)
        static async listarHistorial(req: Request, res: Response) {
            const respuesta = await HistorialIncidenteService.obtenerTodos();
            res.status(respuesta.success ? 200 : 400).json(respuesta);
        }

         // Funciona para buscar un historial por su ID (GET /api/historial-incidentes/:id)
    static async buscarHistorialPorId(req: Request, res: Response) {
        const id = parseInt(req.params.id as string);
        if (isNaN(id)) return res.status(400).json({ success: false, message: "ID inválido" });
 
        const respuesta = await HistorialIncidenteService.obtenerPorId(id);
        res.status(respuesta.success ? 200 : 404).json(respuesta);
    }

    // Funciona para crear un nuevo historial (POST /api/historial-incidentes)
    static async crearHistorial(req: Request, res: Response) {
        const {
            incidente_id,   
            estado_nuevo,
            estado_anterior,
            comentario,
            usuario_id
        } = req.body;
 
        if (!incidente_id || !estado_nuevo || !estado_anterior || !comentario || !usuario_id) {
            return res.status(400).json({
                success: false,
                message: "Incidente id, Estado nuevo, Estado anterior, Comentario y Usuario id son obligatorios"
            });
        }
 
        const respuesta = await HistorialIncidenteService.crear({
            incidente_id,
            estado_nuevo,
            estado_anterior,
            comentario,
            usuario_id
        });
       
        res.status(respuesta.success ? 201 : 400).json(respuesta);
    }

     // Funciona para actualizar un incidente existente (PUT /api/historial-incidentes/:id)
        static async actualizarHistorial(req: Request, res: Response) {
        const id = parseInt(req.params.id as string);
        if (isNaN(id)) return res.status(400).json({ success: false, message: "ID inválido" });
    
        
     const validacion = validarActualizarHistorialIncidente(req.body);
            
            if (!validacion.valido) {
                return res.status(400).json({
                    success: false,
                    message: "Datos inválidos",
                    errores: validacion.errores,
                });
            
            }
            const respuesta = await HistorialIncidenteService.actualizar(id, req.body);
    
        res.status(respuesta.success ? 200 : 404).json(respuesta);
    }

    // Funciona para eliminar un historial (DELETE /api/historial-incidentes/:id)
        static async eliminarHistorial(req: Request, res: Response) {
            const id = parseInt(req.params.id as string);
            if (isNaN(id)) return res.status(400).json({ success: false, message: "ID inválido" });
     
            const respuesta = await HistorialIncidenteService.eliminar(id);
            res.status(respuesta.success ? 200 : 404).json(respuesta);
        }
}