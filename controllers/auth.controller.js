import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";


export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        //Logic to create a new user

        const { name, email, password } = req.body;

        //Check if user with the same email already exists
        const existingUser = await User.findOne({ email }).session(session);
        if (existingUser) {
            const error = new Error('User with this email already exists');
            error.status = 409;
            throw error;
        }

        //Hash the password before saving (you can use bcrypt or any other library)

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUsers = await User.create([{ name, email, password: hashedPassword }], { session });

        // newUser is an array → take first doc
        const createdUser = newUsers[0];

        //Generate JWT token
        const token = jwt.sign({ userId: createdUser._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

        //Commit the transaction
        await session.commitTransaction();
        session.endSession();

        //Send response
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                token,
                user: {
                    id: createdUser._id,
                    name: createdUser.name,
                    email: createdUser.email,
                }
            }
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}



export const signIn = async (req, res, next) => { }

export const signOut = async (req, res, next) => { }