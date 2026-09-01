import { UsuarioRepository } from '../repositories/usuario.repository';
import { Usuario, UsuarioResponse } from '../models/usuario.model';
import * as bcrypt from 'bcryptjs';

export class UsuarioService {
    private repository: UsuarioRepository;

    constructor() {
        this.repository = new UsuarioRepository();
    }

    async findAll(): Promise<UsuarioResponse[]> {
        return await this.repository.findAll();
    }

    async findById(id: number): Promise<UsuarioResponse | null> {
        const usuario = await this.repository.findById(id);
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }
        return usuario;
    }

    async create(usuario: Usuario): Promise<void> {
        if (usuario.password_hash) {
            usuario.password_hash = await bcrypt.hash(usuario.password_hash, 10);
        }
        await this.repository.create(usuario);
    }

    async update(id: number, usuario: Partial<Usuario>): Promise<void> {
        await this.repository.update(id, usuario);
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete(id);
    }
}