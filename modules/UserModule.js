import pool from '../db/connectionPool.js';
import {
    setResponseOk,
    setResponseBadRequest,
    setResponseInternalError,
} from '../utilites/response.js';

const UserModule = {
    addNewUser: async (UserName, pwd, email) => {
        const db = await pool.getConnection();
        try {
            // Check if username already exists
            const [rows] = await db.query(
                'SELECT * FROM User WHERE UserName = ?',
                [UserName]
            );

            if (rows.length > 0) {
                await db.query('UNLOCK TABLES');
                return setResponseBadRequest('Username already exists.');
            }

            // Lock table for write
            await db.query('LOCK TABLES User WRITE');

            // Insert new user
            await db.query(
                `INSERT INTO User 
          (UserName, Password, Email, isActive, CreatedAt, RoleID)
         VALUES (?, ?, ?, FALSE, NOW(), 5)`,
                [UserName, pwd, email]
            );

            await db.query('UNLOCK TABLES');

            return setResponseOk('User added successfully.');
        } catch (error) {
            console.error('Error adding user:', error);
            await db.query('UNLOCK TABLES');
            return setResponseInternalError({ error: error.message });
        } finally {
            db.release();
        }
    },

    updateUser: async (userId, updates) => {
        const db = await pool.getConnection();
        try {
            const fields = Object.keys(updates);
            const values = Object.values(updates);

            if (fields.length === 0) {
                return setResponseBadRequest('No fields to update.');
            }

            const setClause =
                fields.map((field) => `${field} = ?`).join(', ') +
                ', UpdatedAt = NOW()';
            values.push(userId); // For WHERE clause

            const query = `UPDATE User SET ${setClause} WHERE UserID = ?`;
            await db.query('LOCK TABLES User WRITE');
            await db.query(query, values);
            await db.query('UNLOCK TABLES');
            return setResponseOk('User updated successfully');
        } catch (error) {
            console.error('Error updating user:', error);
            await db.query('UNLOCK TABLES');
            return setResponseInternalError({ error: error.message });
        } finally {
            db.release();
        }
    },

    getUserById: async (userId) => {
        const db = await pool.getConnection();
        try {
            const [rows] = await db.query(
                'SELECT * FROM User WHERE UserID = ?',
                [userId]
            );

            if (rows.length === 0) {
                return setResponseBadRequest('User not found.');
            }

            return setResponseOk(rows[0]);
        } catch (error) {
            console.error('Error fetching user:', error);
            return setResponseInternalError({ error: error.message });
        } finally {
            db.release();
        }
    },

    getAllUsers: async () => {
        const db = await pool.getConnection();
        try {
            const [rows] = await db.query('SELECT * FROM User');
            return setResponseOk(rows);
        } catch (error) {
            console.error('Error fetching users:', error);
            return setResponseInternalError({ error: error.message });
        } finally {
            db.release();
        }
    },

    deleteUser: async (userId) => {
        const db = await pool.getConnection();
        try {
            await db.query('LOCK TABLES User WRITE');
            const [result] = await db.query(
                'DELETE FROM User WHERE UserID = ?',
                [userId]
            );

            if (result.affectedRows === 0) {
                return setResponseBadRequest('User not found.');
            }

            await db.query('UNLOCK TABLES');
            return setResponseOk('User deleted successfully.');
        } catch (error) {
            console.error('Error deleting user:', error);
            await db.query('UNLOCK TABLES');
            return setResponseInternalError({ error: error.message });
        } finally {
            db.release();
        }
    },

     isActive: async (UserID) => {
        const db = await pool.getConnection();
        try {
            await db.query('LOCK TABLES User READ');
            const [results] = await db.query(
                'SELECT isActive FROM User WHERE UserID = ?',
                [UserID]
            );
            await db.query('UNLOCK TABLES');

            if (results.length === 0) {
                return setResponseBadRequest("User not found.");
            }

            return setResponseOk("User active status fetched successfully", results[0].isActive);
        } catch (error) {
            await db.query('UNLOCK TABLES');
            return setResponseInternalError({ error: error.message });
        } finally {
            db.release();
        }
    },

};

export default UserModule;
