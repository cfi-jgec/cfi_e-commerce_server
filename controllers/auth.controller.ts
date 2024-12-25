
import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from 'jsonwebtoken';
import prisma from "../prisma";
import bcrypt from 'bcrypt';
import { mailer } from "../utils/mailer";
import { verificationEmailFormat } from "../utils/email-format";

const creteCookies = (val: any) => {
    return jwt.sign(val, process.env.JWT_SECRET as string, { expiresIn: '1D' });
}

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000);
}

// admin login
export const adminLogin = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body; 
    if (!(email && password)) {
        return res.status(400).json({
            message: "All fields are required",
            error: true,
            success: false
        });
    }
    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({
            message: "Invalid credentials",
            error: true,
            success: false
        });
    }
    res.cookie('token', creteCookies({ email }), { httpOnly: true });
    return res.status(200).json({
        message: "Login successful",
        error: false,
        success: true
    });
});

// user login
export const userLogin = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!(email && password)) {
        return res.status(400).json({
            message: "All fields are required",
            error: true,
            success: false
        });
    }
    // check if user exists or not
    const user = await prisma.users.findFirst({ where: { email } });
    if (!user) {
        return res.status(404).json({
            message: "User not found",
            error: true,
            success: false
        });
    }

    // check if password is correct or not
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({
            message: "Invalid credentials",
            error: true,
            success: false
        });
    }
    res.cookie('token', creteCookies({ email, userId: user.id }), { httpOnly: true });
    return res.status(200).json({
        message: "Login successful",
        error: false,
        success: true
    });
});

// user logout
export const userLogout = asyncHandler(async (req: Request, res: Response) => {
    res.clearCookie('token');
    return res.status(200).json({
        message: "Logout successful",
        error: false,
        success: true
    });
});

// create user account
export const createUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password, name } = req.body;
    if (!(email && password && name)) {
        return res.status(400).json({
            message: "All fields are required",
            error: true,
            success: false
        });
    }
    // check if user exists or not
    const isExist = await prisma.users.findFirst({ where: { email } });
    if (isExist) {
        return res.status(409).json({
            message: "User already exists",
            error: true,
            success: false
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = String(generateOtp());
    const user = await prisma.users.create({
        data: {
            email,
            password: hashedPassword,
            name,
            otp
        }
    });
    await mailer(email, "Verify your email", verificationEmailFormat(otp));
    return res.status(201).json({
        user,
        message: "Verification code sent to your email",
        error: false,
        success: true
    });
});

// resend otp
export const resendOtp = asyncHandler(async (req: Request, res: Response) => {
    const { email, isForgetPass } = req.body;
    if (!email) {
        return res.status(400).json({
            message: "Email is required",
            error: true,
            success: false
        });
    }
    const user = await prisma.users.findFirst({ where: { email } });
    if (!user) {
        return res.status(404).json({
            message: "User not found",
            error: true,
            success: false
        });
    }
    const otp = String(generateOtp());
    await prisma.users.update({
        where: { email },
        data: {
            otp
        }
    });
    if (isForgetPass) {
        await mailer(email, "Reset your password", verificationEmailFormat(otp, true));
    } else {
        await mailer(email, "Verify your email", verificationEmailFormat(otp));
    }
    return res.status(200).json({
        message: "Verification code sent to your email",
        error: false,
        success: true
    });
});

// verify otp
export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    if (!(email && otp)) {
        return res.status(400).json({
            message: "All fields are required",
            error: true,
            success: false
        });
    }
    const user = await prisma.users.findFirst({ where: { email } });
    if (!user) {
        return res.status(404).json({
            message: "User not found",
            error: true,
            success: false
        });
    }
    if (user.otp !== otp) {
        return res.status(401).json({
            message: "Invalid OTP",
            error: true,
            success: false
        });
    }
    await prisma.users.update({
        where: { email },
        data: {
            isVerified: true
        }
    });
    res.cookie('token', creteCookies({ email, userId: user.id }), { httpOnly: true });
    return res.status(200).json({
        message: "User registered successfully",
        error: false,
        success: true
    });
});

// update password
export const updatePassword = asyncHandler(async (req: Request, res: Response) => {
    const { email, password, otp } = req.body;
    if (!(email && password && otp)) {
        return res.status(400).json({
            message: "All fields are required",
            error: true,
            success: false
        });
    }
    const user = await prisma.users.findFirst({ where: { email } });
    if (!user) {
        return res.status(404).json({
            message: "User not found",
            error: true,
            success: false
        });
    }
    if (user.otp !== otp) {
        return res.status(401).json({
            message: "Invalid OTP",
            error: true,
            success: false
        });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.users.update({
        where: { email },
        data: {
            password: hashedPassword
        }
    });
    return res.status(200).json({
        message: "Password updated successfully",
        error: false,
        success: true
    });
});

// get user details
export const getUserDetails = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json({
            message: "User id is required",
            error: true,
            success: false
        });
    }
    const user = await prisma.users.findFirst({ where: { id: userId } });
    if (!user) {
        return res.status(404).json({
            message: "User not found",
            error: true,
            success: false
        });
    }
    return res.status(200).json({
        user,
        message: "User details fetched successfully",
        error: false,
        success: true
    });
});

// update user details
export const updateUserDetails = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { name } = req.body;
    if (!(userId && name)) {
        return res.status(400).json({
            message: "All fields are required",
            error: true,
            success: false
        });
    }
    const user = await prisma.users.findFirst({ where: { id: userId } });
    if (!user) {
        return res.status(404).json({
            message: "User not found",
            error: true,
            success: false
        });
    }
    await prisma.users.update({
        where: { id: userId },
        data: {
            name
        }
    });
    return res.status(200).json({
        message: "User details updated successfully",
        error: false,
        success: true
    });
});

export const allUsers = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = req.query;
    const users = await prisma.users.findMany({
        skip: page && limit ? +page * +limit : 10,
        take: limit ? +limit : 10
    });
    const count = await prisma.users.count();

    return res.status(200).json({
        users,
        count,
        limit: limit ? +limit : 10,
        page: page ? +page : 1,
        totalPage: Math.ceil(count / (limit ? +limit : 10)),
        message: "All users fetched successfully",
        error: false,
        success: true
    });
});