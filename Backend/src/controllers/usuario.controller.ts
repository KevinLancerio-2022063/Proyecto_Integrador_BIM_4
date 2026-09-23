import { Request, Response } from 'express';
import { UsuarioService } from '../services/usuario.service';

export class UsuarioController {
    private service: UsuarioService;

    constructor() {
        this.service = new UsuarioService();
    }

    async findAll(req: Request, res: Response): Promise<void> {
        try {
            const usuarios = await this.service.findAll();
            res.json(usuarios);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener usuarios', error });
        }
    }

    async findById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id as string);
            const usuario = await this.service.findById(id);
            res.json(usuario);
        } catch (error) {
            if (error instanceof Error && error.message === 'Usuario no encontrado') {
                res.status(404).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Error al obtener usuario', error });
            }
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            await this.service.create(req.body);
            res.status(201).json({ message: 'Usuario creado exitosamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al crear usuario', error });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id as string);
            await this.service.update(id, req.body);
            res.json({ message: 'Usuario actualizado exitosamente' });
        } catch (error) {
            if (error instanceof Error && error.message === 'Usuario no encontrado') {
                res.status(404).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Error al actualizar usuario', error });
            }
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id as string);
            await this.service.delete(id);
            res.json({ message: 'Usuario eliminado exitosamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar usuario', error });
        }
    }
}