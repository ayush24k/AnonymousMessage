import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";

import { z } from 'zod'

export async function POST(request: Request) {
    await dbConnect();

    try {

        const { username, verifyCode } = await request.json();

        const decodedUsername = decodeURIComponent(username);

        const user = await UserModel.findOne({
            username: decodedUsername
        })

        if (!user) {
            return Response.json({
                success: false,
                message: "User Not Found"
            }, {
                status: 500
            })
        }

        const isCodeValid = user.verifyCode === verifyCode;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();

            return Response.json({
                success: true,
                message: "User Verified Successfully"
            }, {
                status: 200
            })
        } else if (!isCodeValid) {
            return Response.json({
                success: false,
                message: "Incorrect Verification Code!"
            }, {
                status: 400
            })
        } else if (!isCodeNotExpired) {
            return Response.json({
                success: true,
                message: "Verification code has expired! Please Sign-Up Again to get New Code"
            }, {
                status: 400
            })
        }
 
    } catch (err) {
        console.error("Error Verifying user", err)
        return Response.json({
            success: false,
            message: "Error Verifying User"
        }, {
            status: 500
        })
    }
}