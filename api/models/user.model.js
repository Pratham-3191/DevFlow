const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        default: "", 
    },
    location: {
        type: String,
        default: "",
    },
    bio: {
        type: String,
        default: "",
    },
    refreshToken: {
        type: String,
    },
    avatar: {
        type: String, 
        default: "",
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
