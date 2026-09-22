const fs = require('fs');
const { Client } = require('pg');

// Configuración EXACTA de tu base de datos en Render
const client = new Client({
    host: 'dpg-dap6b1n40ujc73bnkte0-a.virginia-postgres.render.com',
    port: 5432,
    database: 'siged_db',
    user: 'siged_user',
    password: 'gUCT04uFV2KucyN84mJbT29pXEL8s7Ko', // Asegúrate que este es el password correcto
    ssl: {
        rejectUnauthorized: false // CRUCIAL para Render
    }
});

async function runSQL() {
    try {
        console.log('🔌 Conectando a PostgreSQL en Render...');
        await client.connect();
        console.log('✅ Conectado exitosamente a siged_db');

        // Leer el archivo SQL
        console.log('📂 Leyendo init.sql...');
        const sql = fs.readFileSync('init.sql', 'utf8');
        
        console.log('⚙️ Ejecutando script SQL (esto puede tardar unos segundos)...');
        await client.query(sql);
        console.log('✅ Script SQL ejecutado exitosamente');

        // Verificar tablas creadas
        console.log('\n📋 Verificando tablas creadas...');
        const result = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name;
        `);
        
        console.log(`   Total: ${result.rows.length} tablas`);
        result.rows.forEach(row => {
            console.log(`      - ${row.table_name}`);
        });

        // Verificar usuario admin
        console.log('\n Verificando usuario admin...');
        const userResult = await client.query(
            "SELECT id, nombre, email, rol FROM usuario WHERE email = 'admin@sigid.com'"
        );
        
        if (userResult.rows.length > 0) {
            console.log('✅ Usuario admin encontrado:');
            console.log('   ID:', userResult.rows[0].id);
            console.log('   Nombre:', userResult.rows[0].nombre);
            console.log('   Email:', userResult.rows[0].email);
            console.log('   Rol:', userResult.rows[0].rol);
        } else {
            console.log('❌ Usuario admin NO encontrado. Revisa el INSERT en init.sql');
        }

        console.log('\n🎉 ¡Base de datos inicializada correctamente!');

    } catch (error) {
        console.error('\n❌ ERROR DETALLADO:');
        console.error('   Mensaje:', error.message);
        console.error('   Código:', error.code);
        console.error('   Detalle:', error.detail || 'N/A');
        console.error('\n   Stack completo:', error.stack);
    } finally {
        try {
            await client.end();
            console.log('\n🔒 Conexión cerrada');
        } catch (e) {
            // Ignorar error al cerrar si ya estaba cerrada
        }
    }
}

runSQL();