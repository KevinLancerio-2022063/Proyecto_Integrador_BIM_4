import { testConnection, closePool } from './config/database.config';
 
async function main() {
    try {
        await testConnection();
        console.log('Conexión exitosa');
    } catch (error) {
        console.error('Error de conexión:', error);
    } finally {
        await closePool();
        process.exit(0);
    }
}
 
main();