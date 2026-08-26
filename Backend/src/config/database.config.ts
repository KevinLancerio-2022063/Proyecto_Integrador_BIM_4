import { Pool, PoolConfig } from 'pg';
import * as dotenv from 'dotenv';

// Configurar dotenv
dotenv.config();

const poolConfig: PoolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'siged',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    min: parseInt(process.env.DB_POOL_MIN || '2', 10),
    max: parseInt(process.env.DB_POOL_MAX || '10', 10),
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
};

export const pool = new Pool(poolConfig);

pool.on('connect', () => {
    console.log('Nueva conexión establecida con PostgreSQL');
});

pool.on('error', (err) => {
    console.error('Error inesperado en el pool de PostgreSQL:', err);
    process.exit(-1);
});

export const testConnection = async (): Promise<void> => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW()');
        console.log('Conexión exitosa a PostgreSQL');
        console.log('Fecha del servidor:', result.rows[0].now);
        client.release();
    } catch (error) {
        console.error('Error al conectar con PostgreSQL:', error);
        throw error;
    }
};

export const closePool = async (): Promise<void> => {
    await pool.end();
    console.log('Pool de conexiones cerrado');
};