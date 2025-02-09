import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { User } from "next-auth";
import UserModel from "@/model/user";

export async function DELETE(
    request: Request,
    { params }: { params: { messageId: string } }
) {
    const messageId = params.messageId;
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, {
            status: 401
        })
    }

    try {
        const updatedUser = await UserModel.updateOne(
            {_id: user._id}, // matcher 
            {$pull: {messages: {_id: messageId}}}
        )

        if (updatedUser.modifiedCount === 0) {
            return Response.json({
                success: false,
                message: "Message not found or already deleted"
            }, {
                status: 404
            })
        }

        return Response.json({
            success: true,
            message: "Message Deleted Successfully"
        }, {
            status: 200
        })
    } catch (error) {
        console.error("Error Deletd the message", error)
        return Response.json({
            success: false,
            message: "unable to delete the message"
        }, {
            status: 404
        })
    }
}