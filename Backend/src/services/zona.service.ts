import { ZonaRepository } from '../repositories/zona.repository';
import { Zona, ZonaResponse } from '../models/zona.model';

export class ZonaService {
    private repository: ZonaRepository;

    constructor() {
        this.repository = new ZonaRepository();
    }

    async findAll(): Promise<ZonaResponse[]> {
        return await this.repository.findAll();
    }

    async findById(id: number): Promise<ZonaResponse | null> {
        const zona = await this.repository.findById(id);
        if (!zona) {
            throw new Error('Zona no encontrada');
        }
        return zona;
    }

    async create(zona: Zona): Promise<void> {
        await this.repository.create(zona);
    }

    async update(id: number, zona: Partial<Zona>): Promise<void> {
        await this.repository.update(id, zona);
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete(id);
    }
}