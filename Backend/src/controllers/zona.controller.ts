import { Request, Response } from 'express';
import { ZonaService } from '../services/zona.service';

export class ZonaController {
    private service: ZonaService;

    constructor() {
        this.service = new ZonaService();
    }

    async findAll(req: Request, res: Response): Promise<void> {
        try {
            const zonas = await this.service.findAll();
            res.json(zonas);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener zonas', error });
        }
    }

    async findById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.zonaid as string);
            const zona = await this.service.findById(id);
            res.json(zona);
        } catch (error) {
            if (error instanceof Error && error.message === 'Zona no encontrada') {
                res.status(404).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Error al obtener zona', error });
            }
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            await this.service.create(req.body);
            res.status(201).json({ message: 'Zona creada exitosamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al crear zona', error });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id as string);
            await this.service.update(id, req.body);
            res.json({ message: 'Zona actualizada exitosamente' });
        } catch (error) {
            if (error instanceof Error && error.message === 'Zona no encontrada') {
                res.status(404).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Error al actualizar zona', error });
            }
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id as string);
            await this.service.delete(id);
            res.json({ message: 'Zona eliminada exitosamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar zona', error });
        }
    }
}