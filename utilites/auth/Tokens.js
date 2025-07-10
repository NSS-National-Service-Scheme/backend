import jwt from 'jsonwebtoken';
import appConfig from '../config.js';
const SECRET_KEY = appConfig.JWTSecretKey;

export const generateToken = (payload) => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' });
};

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.jwt = {
            RoleID: user.RoleID,
            UserID: user.UserID,
            Username: user.Username,
            userType: user.userType,
            userTypeID: user.userTypeID
        };

        next();
    });
};

