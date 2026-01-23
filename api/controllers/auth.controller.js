const ErrorHandler = require('../utils/error');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs')

const generateAccessToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '15m' }
    );
}
const generateRefreshToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );
}

const signUp = async (req, res, next) => {
    try {
        const { name, email, password } = req.body
        console.log(name, email, password);
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({
            success: false,
            message: "User already exists"
        });
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        user.refreshToken = refreshToken;
        await user.save();

        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
        });
    } catch (error) {
        next(error);
    }
}

const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: 'Wrong credentials',
                success: false
            })
        }
        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) {
            return res.status(401).json({
                message: 'Incorrect password',
                success: false
            })
        }

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        user.refreshToken = refreshToken;
        await user.save();

        return res.status(200).json({
            message: 'Login Successful',
            success: true,
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        })

    } catch (error) {
        next(error)
    }

}

const refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'refresh token is required' });
    }
    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );
        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ message: 'invalid refresh token' })
        }
        const newAccessToken = generateAccessToken(user._id);
        return res.status(200).json({
            accessToken: newAccessToken
        });


    } catch (error) {
        return res.status(403).json({ message: 'invalid or expired refresh token' })
    }

}


module.exports = { signUp, signIn, refreshAccessToken }