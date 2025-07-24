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
import profileRoutes from './routes/ProfileRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import eventCoordRoutes from './routes/EventCoordRoutes.js';
import expenseRoutes from './routes/ExpenseRoutes.js';
import AdminRoutes from "./routes/AdminRoutes.js"

//Usage of routes
app.use('/api',AdminRoutes);
app.use('/api', profileRoutes);
app.use('/api', loginRoutes);
app.use('/api', userRoutes);
app.use('/api', eventRoutes);
app.use('/api', eventCoordRoutes);
app.use('/api', expenseRoutes);

app.listen(appConfig.PORT, () => {
    console.log(`Server is running on port ${appConfig.PORT}`);
});
