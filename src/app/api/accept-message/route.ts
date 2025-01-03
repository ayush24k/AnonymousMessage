import { getServerSession } from "next-auth";

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";

import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";


export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, {
            status: 401
        })
    }

    const userID = user._id;
    const { acceptMessages } = await request.json();

    try {

        const updatedUser = await UserModel.findByIdAndUpdate(
            userID,
            { isAcceptingMessage: acceptMessages },
            { new: true }
        )

        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "faield to toggle accept messages"
            }, {
                status: 401
            })
        } else {
            return Response.json({
                success: true,
                message: `Message Accepting is toggled to ${acceptMessages}`,
                updatedUser
            }, {
                status: 200
            })
        }

    } catch (err) {
        console.log("Failed to update user status to accept messages")
        return Response.json({
            success: false,
            message: "failed to update user status to accept messages"
        }, {
            status: 500
        })
    }
}

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, {
            status: 401
        })
    }

    const userID = user._id;

    try {
        const foundUser = await UserModel.findById(userID);

        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {
                status: 401
            })
        } else {
            return Response.json({
                success: true,
                isAcceptingMessages: foundUser.isAcceptingMessage
            }, {
                status: 200
            })
        }
    } catch (err) {
        console.log("Failed to ")
        return Response.json({
            success: false,
            message: "Error in fetcging Accepting Messages Status"
        }, {
            status: 500
        })
    }
}