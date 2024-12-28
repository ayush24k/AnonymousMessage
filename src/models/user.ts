import mongoose, {Schema, Document} from "mongoose";


export interface Message extends Document {
    content: string;
    createdAt: Date;
}

const messageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[];
}

const userSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is Required!"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is Required"],
        unique: true,
        match: [/.+\@.+\..+/, "please use a valid Email Address"]
    },
    password: {
        type: String,
        required: true
    },
    verifyCode: {
        type: String,
        required: [true, "Verify code is required"]
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "verify code expiry is required"]
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true
    },
    messages: [messageSchema]
})


const MessageModel = (mongoose.models.Message as mongoose.Model<Message>) || (mongoose.model<Message>("Message", messageSchema));
const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User", userSchema));

export default {
    MessageModel,
    UserModel
}
