import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import pool from './connectionPool.js';

// ES Module workaround for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db_conn = await pool.getConnection();
try {
    const data = readFileSync(join(__dirname, 'NSS_DB_Schema.sql'), 'utf-8');
    await db_conn.query(data);
    console.log('✅ Database Initialized Successfully');
} catch (err) {
    console.error('❌ Error initializing database:', err);
} finally {
    db_conn.release();
}
