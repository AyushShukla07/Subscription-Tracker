// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: [true, 'User name is required'],
//         trim: true,
//         minLength: 2,
//         maxLength: 50,
//     },
//     email: {
//         type: String,
//         required: [true, 'Email is required'],
//         unique: true,
//         trim: true,
//         lowercase: true,
//         match: [/.+\@.+\..+/, 'Please fill a valid email address'],
//     },
//     password: {
//         type: String,
//         required: [true, 'Password is required'],
//         minLength: 6,
//     }
// }, { timestamps: true });

// const User = mongoose.model('User', userSchema);

// export default User;

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User name is required'],
        trim: true,
        minLength: 2,
        maxLength: 50,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: 6,
        select: false,  // hide password in queries
    }
}, { timestamps: true });

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
