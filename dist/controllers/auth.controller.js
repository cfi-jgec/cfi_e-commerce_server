"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allUsers = exports.updateUserDetails = exports.getUserDetails = exports.updatePassword = exports.verifyOtp = exports.resendOtp = exports.createUser = exports.userLogout = exports.userLogin = exports.adminLogin = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const mailer_1 = require("../utils/mailer");
const email_format_1 = require("../utils/email-format");
const creteCookies = (val) => {
    return jsonwebtoken_1.default.sign(val, process.env.JWT_SECRET, { expiresIn: '1D' });
};
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000);
};
// admin login
exports.adminLogin = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
}));
// user login
exports.userLogin = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!(email && password)) {
        return res.status(400).json({
            message: "All fields are required",
            error: true,
            success: false
        });
    }
    // check if user exists or not
    const user = yield prisma_1.default.users.findFirst({ where: { email } });
    if (!user) {
        return res.status(404).json({
            message: "User not found",
            error: true,
            success: false
        });
    }
    // check if password is correct or not
    const isMatch = yield bcrypt_1.default.compare(password, user.password);
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
}));
// user logout
exports.userLogout = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie('token');
    return res.status(200).json({
        message: "Logout successful",
        error: false,
        success: true
    });
}));
// create user account
exports.createUser = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name } = req.body;
    if (!(email && password && name)) {
        return res.status(400).json({
            message: "All fields are required",
            error: true,
            success: false
        });
    }
    // check if user exists or not
    const isExist = yield prisma_1.default.users.findFirst({ where: { email } });
    if (isExist) {
        return res.status(409).json({
            message: "User already exists",
            error: true,
            success: false
        });
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const otp = String(generateOtp());
    const user = yield prisma_1.default.users.create({
        data: {
            email,
            password: hashedPassword,
            name,
            otp
        }
    });
    yield (0, mailer_1.mailer)(email, "Verify your email", (0, email_format_1.verificationEmailFormat)(otp));
    return res.status(201).json({
        user,
        message: "Verification code sent to your email",
        error: false,
        success: true
    });
}));
// resend otp
exports.resendOtp = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, isForgetPass } = req.body;
    if (!email) {
        return res.status(400).json({
            message: "Email is required",
            error: true,
            success: false
        });
    }
    const user = yield prisma_1.default.users.findFirst({ where: { email } });
    if (!user) {
        return res.status(404).json({
            message: "User not found",
            error: true,
            success: false
        });
    }
    const otp = String(generateOtp());
    yield prisma_1.default.users.update({
        where: { email },
        data: {
            otp
        }
    });
    if (isForgetPass) {
        yield (0, mailer_1.mailer)(email, "Reset your password", (0, email_format_1.verificationEmailFormat)(otp, true));
    }
    else {
        yield (0, mailer_1.mailer)(email, "Verify your email", (0, email_format_1.verificationEmailFormat)(otp));
    }
    return res.status(200).json({
        message: "Verification code sent to your email",
        error: false,
        success: true
    });
}));
// verify otp
exports.verifyOtp = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    if (!(email && otp)) {
        return res.status(400).json({
            message: "All fields are required",
            error: true,
            success: false
        });
    }
    const user = yield prisma_1.default.users.findFirst({ where: { email } });
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
    yield prisma_1.default.users.update({
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
}));
// update password
exports.updatePassword = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, otp } = req.body;
    if (!(email && password && otp)) {
        return res.status(400).json({
            message: "All fields are required",
            error: true,
            success: false
        });
    }
    const user = yield prisma_1.default.users.findFirst({ where: { email } });
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
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    yield prisma_1.default.users.update({
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
}));
// get user details
exports.getUserDetails = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json({
            message: "User id is required",
            error: true,
            success: false
        });
    }
    const user = yield prisma_1.default.users.findFirst({ where: { id: userId } });
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
}));
// update user details
exports.updateUserDetails = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { name } = req.body;
    if (!(userId && name)) {
        return res.status(400).json({
            message: "All fields are required",
            error: true,
            success: false
        });
    }
    const user = yield prisma_1.default.users.findFirst({ where: { id: userId } });
    if (!user) {
        return res.status(404).json({
            message: "User not found",
            error: true,
            success: false
        });
    }
    yield prisma_1.default.users.update({
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
}));
exports.allUsers = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit } = req.query;
    const users = yield prisma_1.default.users.findMany({
        skip: page && limit ? +page * +limit : 10,
        take: limit ? +limit : 10
    });
    const count = yield prisma_1.default.users.count();
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
}));
