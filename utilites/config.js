import { availableParallelism } from 'os';


import dotenv from 'dotenv';
dotenv.config();

const numCPU = availableParallelism();

const appConfig = {
    numCPU: numCPU,
    PORT: process.env.SERVER_PORT,
    db: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PWD,
        database: process.env.DB_DATABASE,
        waitForConnections: true,
        connectionLimit: numCPU,
        queueLimit: 0,
        multipleStatements: true,
        ssl: {
            rejectUnauthorized: true,
        },
    },
    JWTSecretKey: process.env.JWT_SECRET_KEY,
    cloudinary: {
        cloud_name:process.env.CLOUD_NAME,
        api_key:process.env.CLOUD_API_KEY,
        api_secret:process.env.CLOUD_API_SECRET,
    },
};

export default appConfig;
