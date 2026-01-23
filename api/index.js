const { config } = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRouter = require('./routes/auth.route');
const userRouter = require('./routes/user.route');
const cors= require('cors');
config(dotenv);

const app = express();
const PORT = 3000;
const MONGO_URL = process.env.MONGO_URL;

async function connectDB() {
    await mongoose.connect(MONGO_URL)
        .then(() => console.log('Mongodb connected'))
        .catch((err) => console.log('MongoDB connection error:', err));;
}
connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
corsConfig=[
    origin=process.env.CLIENT_URL,
    methods=['GET','POST'],
    credentials=true,
]
app.use(cors(corsConfig))
app.use('/auth', authRouter);
app.use('/user',userRouter);

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});



app.listen(PORT, () => console.log('server is Running'));