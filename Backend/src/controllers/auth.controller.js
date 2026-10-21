import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";


/**
 * @desc Register a new user
 * @route POST /api/auth/register
 * @access Public
 * @body { username, email, password }
 */
export async function register(req, res) {
    try {
        const { username, email, password } = req.body;

        const isUserAlreadyExists = await userModel.findOne({
            $or: [{ email }, { username }]
        })

        if (isUserAlreadyExists) {
            return res.status(400).json({
                message: "User with this email or username already exists",
                success: false,
                err: "User already exists"
            })
        }

        const user = await userModel.create({ username, email, password })

        const emailVerificationToken = jwt.sign({
            email: user.email,
        }, process.env.JWT_SECRET)

        const backendUrl = process.env.BACKEND_URL || "https://perplexity-backend-n6u5.onrender.com";

        let emailSent = false;
        try {
            if (process.env.GOOGLE_USER && process.env.GOOGLE_REFRESH_TOKEN) {
                await Promise.race([
                    sendEmail({
                        to: email,
                        subject: "Welcome to Perplexity!",
                        html: `
                                <p>Hi ${username},</p>
                                <p>Thank you for registering at <strong>Perplexity</strong>. We're excited to have you on board!</p>
                                <p>Please verify your email address by clicking the link below:</p>
                                <a href="${backendUrl}/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
                                <p>If you did not create an account, please ignore this email.</p>
                                <p>Best regards,<br>The Perplexity Team</p>
                        `
                    }),
                    new Promise((_, reject) => setTimeout(() => reject(new Error("Email timeout")), 5000))
                ]);
                emailSent = true;
            }
        } catch (emailErr) {
            console.error("Email sending failed or timed out:", emailErr.message);
        }

        // If email could not be sent (e.g. credentials missing or timed out), auto-verify user so they can log in
        if (!emailSent) {
            user.verified = true;
            await user.save();
        }

        return res.status(201).json({
            message: emailSent
                ? "User registered successfully! Please check your email to verify your account."
                : "User registered successfully! You can now log in.",
            success: true,
            verified: user.verified,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        console.error("Registration error:", err);
        return res.status(500).json({
            message: err.message || "Registration failed",
            success: false,
            err: err.message
        });
    }
}

/**
 * @desc Login user and return JWT token
 * @route POST /api/auth/login
 * @access Public
 * @body { email, password }
 */
export async function login(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password",
            success: false,
            err: "User not found"
        })
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
        return res.status(400).json({
            message: "Invalid email or password",
            success: false,
            err: "Incorrect password"
        })
    }

    if (!user.verified) {
        return res.status(400).json({
            message: "Please verify your email before logging in",
            success: false,
            err: "Email not verified"
        })
    }

    const token = jwt.sign({
        id: user._id,
        username: user.username,
    }, process.env.JWT_SECRET, { expiresIn: '7d' })

    const isProduction = process.env.NODE_ENV === "production" || !req.get("host")?.includes("localhost");
    res.cookie("token", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
        message: "Login successful",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

}


/**
 * @desc Get current logged in user's details
 * @route GET /api/auth/get-me
 * @access Private
 */
export async function getMe(req, res) {
    const userId = req.user.id;

    const user = await userModel.findById(userId).select("-password");

    if (!user) {
        return res.status(404).json({
            message: "User not found",
            success: false,
            err: "User not found"
        })
    }

    res.status(200).json({
        message: "User details fetched successfully",
        success: true,
        user
    })
}


/**
 * @desc Verify user's email address
 * @route GET /api/auth/verify-email
 * @access Public
 * @query { token }
 */
export async function verifyEmail(req, res) {
    const { token } = req.query;

    try {


        const decoded = jwt.verify(token, process.env.JWT_SECRET);


        const user = await userModel.findOne({ email: decoded.email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid token",
                success: false,
                err: "User not found"
            })
        }

        user.verified = true;

        await user.save();

        const frontendUrl = process.env.FRONTEND_URL || "https://perplexity-red.vercel.app";

        const html =
            `
        <h1>Email Verified Successfully!</h1>
        <p>Your email has been verified. You can now log in to your account.</p>
        <a href="${frontendUrl}/login">Go to Login</a>
    `

        return res.send(html);
    } catch (err) {
        return res.status(400).json({
            message: "Invalid or expired token",
            success: false,
            err: err.message
        })
    }
}