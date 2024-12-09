import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // Cargar las variables de entorno

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Leer desde .env
  ssl: { rejectUnauthorized: false } // Configuración para conexiones seguras
});

export default pool;
