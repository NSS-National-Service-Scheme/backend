import pool from '../db/connectionPool.js';
import {
    setResponseInternalError,
    setResponseUnauth,
    setResponseOk,
    setResponseBadRequest,
} from '../utilites/response.js';
const AdminModule = {
    getDepts: async () => {
        let db;
        try {
            db = await pool.getConnection();
            console.log('Here 1');

            await db.query('LOCK TABLES Department READ');
            const results = await db.query('SELECT * FROM Department');
            await db.query('UNLOCK TABLES');

            if (results.length === 0) {
                return setResponseBadRequest(
                    'No Department records found for this event'
                );
            }
            return setResponseOk(
                'Departments records retrieved successfully',
                results
            );
        } catch (error) {
            if (db) {
                await db.query('UNLOCK TABLES');
            }
            return setResponseInternalError(error);
        } finally {
            if (db) db.release();
        }
    },

    getSchools: async () => {
        let db;
        try {
            db = await pool.getConnection();
            await db.query('LOCK TABLES School READ');
            const results = await db.query('SELECT * FROM School');
            await db.query('UNLOCK TABLES');

            if (results.length === 0) {
                return setResponseBadRequest(
                    'No School records found for this event'
                );
            }
            return setResponseOk(
                'School records retrieved successfully',
                results
            );
        } catch (error) {
            if (db) {
                await db.query('UNLOCK TABLES');
            }
            return setResponseInternalError(
                'Failed to retrieve School records',
                error
            );
        } finally {
            if (db) db.release();
        }
    },
};

export default AdminModule;
