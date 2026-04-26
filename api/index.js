const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const authRouter = require('./routes/auth.route');
const userRouter = require('./routes/user.route');
const projectRouter = require('./routes/project.route');
const taskRouter = require('./routes/task.route');

dotenv.config();

const app = express();
const PORT = 3000;
const MONGO_URL = process.env.MONGO_URL;

// DB
mongoose
  .connect(MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);

// Routes
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/projects', projectRouter);
app.use('/tasks', taskRouter);

// Health check
app.get('/', (req, res) => {
  res.status(200).send('Server is running');
});

// Global error handler
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
