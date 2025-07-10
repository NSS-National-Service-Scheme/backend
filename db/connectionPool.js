import mysql from 'mysql2/promise';
import appConfig from '../utilites/config.js';

const pool = mysql.createPool(appConfig.db);

(async () => {
    try {
        const connection = await pool.getConnection();
        await connection.ping(); // OR: await connection.query('SELECT 1');
        console.log('✅ MySQL Pool connected successfully.');
        connection.release();
    } catch (err) {
        console.error('❌ Failed to connect to MySQL pool:');
        console.error(err); // Print full error object
        process.exit(1);
    }
})();

export default pool;
