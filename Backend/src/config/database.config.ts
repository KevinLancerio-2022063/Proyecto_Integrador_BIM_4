import { Pool, PoolConfig } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

let poolConfig: PoolConfig;

// Prioridad 1: Usar DATABASE_URL si existe (Recomendado para Render)
if (process.env.DATABASE_URL) {
    console.log('🔧 Usando DATABASE_URL para conectar a PostgreSQL');
    poolConfig = {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        },
        max: parseInt(process.env.DB_POOL_MAX || '10', 10),
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000, // Aumentar timeout
    };
} 
// Prioridad 2: Variables separadas
else if (process.env.DB_HOST && process.env.DB_PASSWORD) {
    console.log('🔧 Usando variables separadas para conectar a PostgreSQL');
    poolConfig = {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432', 10),
        database: process.env.DB_NAME || 'siged',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD,
        ssl: process.env.NODE_ENV === 'production' 
            ? { rejectUnauthorized: false } 
            : false,
        max: parseInt(process.env.DB_POOL_MAX || '10', 10),
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
    };
} 
// Fallback: localhost (solo desarrollo)
else {
    console.log('⚠️  No hay configuración de DB. Usando localhost (desarrollo)');
    poolConfig = {
        host: 'localhost',
        port: 5432,
        database: 'siged',
        user: 'postgres',
        password: '',
    };
}

export const pool = new Pool(poolConfig);

// Logging detallado
pool.on('connect', () => {
    console.log('✅ Nueva conexión establecida con PostgreSQL');
});

pool.on('error', (err) => {
    console.error('❌ Error en el pool de PostgreSQL:', err);
    console.error('Error code:', err.code);
    console.error('Error message:', err.message);
});

export const testConnection = async (): Promise<void> => {
    console.log('🔄 Intentando conectar a PostgreSQL...');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('DATABASE_URL configurada:', process.env.DATABASE_URL ? 'Sí' : 'No');
    console.log('DB_HOST:', process.env.DB_HOST || 'No configurado');
    console.log('DB_USER:', process.env.DB_USER || 'No configurado');
    console.log('DB_NAME:', process.env.DB_NAME || 'No configurado');
    
    let client;
    try {
        client = await pool.connect();
        console.log('✅ Conexión exitosa a PostgreSQL');
        
        const result = await client.query('SELECT NOW()');
        console.log(' Fecha del servidor:', result.rows[0].now);
        
        // Verificar conexión adicional
        const dbInfo = await client.query(`
            SELECT version(), current_database(), current_user
        `);
        console.log('🗄️  Versión PostgreSQL:', dbInfo.rows[0].version.split(' ')[0]);
        console.log('📦 Base de datos:', dbInfo.rows[0].current_database);
        console.log('👤 Usuario:', dbInfo.rows[0].current_user);
        
        client.release();
        console.log('✅ Conexión liberada correctamente');
    } catch (error) {
        console.error('❌ Error al conectar con PostgreSQL:', error);
        if (client) {
            client.release();
        }
        throw error;
    }
};

export const closePool = async (): Promise<void> => {
    await pool.end();
    console.log('Pool de conexiones cerrado');
};