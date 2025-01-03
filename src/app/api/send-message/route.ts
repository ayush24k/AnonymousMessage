import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";

import { Message } from "@/model/user";

export async function POST(request: Request) {
    await dbConnect();

    const { username, content } = await request.json();

    try {
        const user = await UserModel.findOne({
            username
        })

        if (!user) {
            return Response.json({
                success: false,
                message: "User Not Found"
            }, {
                status: 404
            })
        }

        // is user accepting messages?
        if (!user.isAcceptingMessage) {
            return Response.json({
                success: false,
                message: "User is not accepting messages"
            }, {
                status: 403
            })
        }

        const newMessage = { content, createdAt: new Date() };
        user.messages.push(newMessage as Message);
        const success = await user.save();

        if (!success) {
            return Response.json({
                success: false,
                message: "Message Not sent"
            }, {
                status: 401
            })
        }

        return Response.json({
            success: true,
            message: "Message Sent Succefully"
        }, {
            status: 401
        })

    } catch (err) {
        console.log("Error sending Messages", err)
        return Response.json({
            success: false,
            message: "Internal Server Error"
        }, {
            status: 500
        })
    }
}