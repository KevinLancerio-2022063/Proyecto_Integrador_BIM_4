import { Request, Response } from "express";
import { RefugioService } from "../services/refugio.service";

export class RefugioController {

    // Funciona para listar todos los refugios (GET /api/refugios)
    static async listar(req: Request, res: Response) {
        const respuesta = await RefugioService.obtenerTodos();
        res.status(respuesta.success ? 200 : 400).json(respuesta);
    }

    // Funciona para buscar un refugio por ID (GET /api/refugios/:id)
    static async buscarPorId(req: Request, res: Response) {
        const id = parseInt(req.params.id as string);
        if (isNaN(id)) return res.status(400).json({ success: false, message: "ID inválido" });

        const respuesta = await RefugioService.obtenerPorId(id);
        res.status(respuesta.success ? 200 : 404).json(respuesta);
    }

    // Funciona para crear un nuevo refugio (POST /api/refugios)
    static async crear(req: Request, res: Response) {
        const { nombre, capacidad_total, direccion, zona_id, latitud, longitud, responsable_id, telefono_contacto } = req.body;

        if (!nombre || !capacidad_total) {
            return res.status(400).json({ success: false, message: "Nombre y capacidad_total son obligatorios" });
        }

        if (capacidad_total <= 0) {
            return res.status(400).json({ success: false, message: "La capacidad total debe ser mayor a 0" });
        }

        const respuesta = await RefugioService.crear({
            nombre,
            capacidad_total,
            direccion,
            zona_id,
            latitud,
            longitud,
            responsable_id,
            telefono_contacto,
        });
        res.status(respuesta.success ? 201 : 400).json(respuesta);
    }

    // Funciona para actualizar un refugio existente (PUT /api/refugios/:id)
    static async actualizar(req: Request, res: Response) {
        const id = parseInt(req.params.id as string);
        const {
            nombre,
            direccion,
            zona_id,
            latitud,
            longitud,
            capacidad_total,
            ocupacion_actual,
            estado,
            responsable_id,
            telefono_contacto,
            observaciones,
        } = req.body;

        if (isNaN(id)) return res.status(400).json({ success: false, message: "ID inválido" });
        if (!nombre || !estado || capacidad_total === undefined || ocupacion_actual === undefined) {
            return res.status(400).json({ success: false, message: "Faltan campos obligatorios" });
        }

        if (ocupacion_actual > capacidad_total) {
            return res.status(400).json({ success: false, message: "La ocupación no puede exceder la capacidad total" });
        }

        const respuesta = await RefugioService.actualizar(id, {
            nombre,
            direccion: direccion || "",
            zona_id: zona_id || 0,
            latitud: latitud || 0,
            longitud: longitud || 0,
            capacidad_total,
            ocupacion_actual,
            estado,
            responsable_id: responsable_id || 0,
            telefono_contacto: telefono_contacto || "",
            observaciones: observaciones || "",
        });
        res.status(respuesta.success ? 200 : 404).json(respuesta);
    }

    // Funciona para eliminar un refugio (DELETE /api/refugios/:id)
    static async eliminar(req: Request, res: Response) {
        const id = parseInt(req.params.id as string);
        if (isNaN(id)) return res.status(400).json({ success: false, message: "ID inválido" });

        const respuesta = await RefugioService.eliminar(id);
        res.status(respuesta.success ? 200 : 404).json(respuesta);
    }
}