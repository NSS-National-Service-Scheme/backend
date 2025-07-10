import pool  from '../../db/connectionPool.js';
import { verifyToken } from './Tokens.js'; // Make sure path is correct

export default function authorizeRoles(access_id, event_id = null) {
    return (req, res, next) => {
        verifyToken(req, res, async function runAuthorization() {
            if (!req.jwt) {
                return res.status(403).json({ MESSAGE: 'Not Authenticated' });
            }

            const userRoleId = req.jwt.RoleID;

            // Role-level check
            if (userRoleId > access_id) {
                return res
                    .status(403)
                    .json({ MESSAGE: 'Access Denied: Insufficient Role' });
            }

            // Special check for event coordinator (role_id = 4)
            if (userRoleId === 4 && event_id) {
                try {
                    const db = await pool.getConnection();
                    const [rows] = await db.query(
                        `SELECT * FROM EventCoordMapping 
                         WHERE EventID = ? AND StudentID = ? 
                         AND CoordinationRole = 'EventCoordinator'`,
                        [event_id, req.jwt.userTypeID]
                    );
                    db.release();

                    if (rows.length === 0) {
                        return res.status(403).json({
                            MESSAGE: 'Not an event coordinator for this event',
                        });
                    }
                } catch (err) {
                    console.error('DB error:', err);
                    return res.status(500).json({ MESSAGE: 'Database error' });
                }
            }

            next();
        });
    };
}
