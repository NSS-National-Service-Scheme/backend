import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import appConfig from './utilites/config.js';

const app = express();


app.use(cors({
  origin: "http://localhost:3000", // allow your frontend
  credentials: true // allow cookies if you're using them
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
import loginRoutes from './routes/loginRoutes.js';
import userRoutes from './routes/userRoutes.js';
import profileRoutes from './routes/ProfileRoutes.js';
import EventRoutes from './routes/ER.js';
import EventCoordRoutes from './routes/EventCoordRoutes.js';
import expenseRoutes from './routes/ExpenseRoutes.js';
import AdminRoutes from './routes/AdminRoutes.js';
import AttendanceRoutes from './routes/AttendanceRoutes.js';
import expenseRouter from './routes/ExpenseRoutes.js';

//Usage of routes
app.use('/api', AdminRoutes);
app.use('/api', profileRoutes);
app.use('/api', loginRoutes);
app.use('/api', userRoutes);
app.use('/api', EventRoutes);
app.use('/api', EventCoordRoutes);
app.use('/api', expenseRoutes);
app.use('/api', AttendanceRoutes);
app.use('/api', expenseRouter);

app.listen(appConfig.PORT, () => {
    console.log(`Server is running on port ${appConfig.PORT}`);
});
