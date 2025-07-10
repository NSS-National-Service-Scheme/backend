import pool from '../db/connectionPool.js';
import { decrypt } from '../utilites/encryption.js';
import {
    setResponseInternalError,
    setResponseUnauth,
    setResponseOk,
} from '../utilites/response.js';

const LoginModule = {
    login: async (username, passwordInput) => {
        const db = await pool.getConnection();

        try {
            await db.query('LOCK TABLES User READ, Student READ, Staff READ');
            const [userRows] = await db.query(
                'SELECT UserID, Username, Password, RoleID FROM User WHERE Username = ?',
                [username]
            );

            if (userRows.length === 0) {
                return setResponseUnauth({ reason: 'User not found' });
            }

            const user = userRows[0];
            const decryptedPassword = decrypt(user.Password);
            if (decryptedPassword !== passwordInput) {
                return setResponseUnauth({ reason: 'Incorrect password' });
            }

            // Upgrade lock to WRITE (optional optimization)
            await db.query('UNLOCK TABLES');
            await db.query('LOCK TABLES User WRITE, Student READ, Staff READ');

            await db.query(
                'UPDATE User SET LastLogin = NOW(), isActive = TRUE WHERE UserID = ?',
                [user.UserID]
            );

            // Continue reading user type
            let userType = null;
            let userTypeID = null;

            if (user.RoleID === 2) {
                const [staffRows] = await db.query(
                    'SELECT StaffID FROM Staff WHERE UserID = ?',
                    [user.UserID]
                );
                if (staffRows.length > 0) {
                    userType = 'staff';
                    userTypeID = staffRows[0].StaffID;
                }
            } else {
                const [studentRows] = await db.query(
                    'SELECT StudentID FROM Student WHERE UserID = ?',
                    [user.UserID]
                );
                if (studentRows.length > 0) {
                    userType = 'student';
                    userTypeID = studentRows[0].StudentID;
                }
            }

            return setResponseOk('User authenticated', {
                UserID: user.UserID,
                Username: user.Username,
                RoleID: user.RoleID,
                userType,
                userTypeID,
            });
        } catch (error) {
            return setResponseInternalError({ error: error.message });
        } finally {
            await db.query('UNLOCK TABLES');
            db.release();
        }
    },
};

export default LoginModule;
