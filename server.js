import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import appConfig from './utilites/config.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
import loginRoutes from './routes/loginRoutes.js';
import userRoutes from './routes/userRoutes.js';

app.use('/api', loginRoutes);
app.use('/api', userRoutes);

app.listen(appConfig.PORT, () => {
    console.log(`Server is running on port ${appConfig.PORT}`);
});
