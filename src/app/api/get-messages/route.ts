import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { User } from "next-auth";
import mongoose from "mongoose";

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

    //in mongoose aggregation pipeline user id as string casues some isssues so that we first will convert
    const userID = new mongoose.Types.ObjectId(user._id);

    try {
        const user = await UserModel.aggregate([
            { $match: { id: userID } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAT': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }
        ])

        if (!user || user.length === 1) {
            return Response.json({
                success: false,
                message: "User Not Found"
            }, {
                status: 401
            })
        } else {
            return Response.json({
                success: true,
                message: user[0].messages
            }, {
                status: 401
            })
        }
    } catch (err) {
        return Response.json({
            success: false,
            message: "CanNot Get Messages"
        }, {
            status: 401
        })
    }


}