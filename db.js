import pkg from 'pg';
const { Pool } = pkg;


// Configura la conexión usando la URL externa de PostgreSQL proporcionada por Render
const pool = new Pool({
  connectionString: 'postgresql://vitalsignsdb_67jh_user:pvS4QwnYl0uQmqGKU0IZEmEqfyo9u8qJ@dpg-ct295ml2ng1s73ec9sm0-a.oregon-postgres.render.com/vitalsignsdb_67jh',
  ssl: { rejectUnauthorized: false } // Esto es necesario para conexiones seguras con Render
});

// Exportamos la configuración para usarla en otros archivos
export default pool;
