import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/app/model/User";
import mongoose from "mongoose";
import { User } from "next-auth";

export async function GET(request: Request) {
    await dbConnect();

    const session = await auth();
    const _user: User = session?.user as User;

    // Check if session exists
    if (!session || !_user) {
        return Response.json(
            { success: false, message: "Not Authenticated" },
            { status: 401 }
        );
    }

    // Safely convert string ID to Mongoose ObjectId
    // NextAuth sometimes uses .id and sometimes ._id
    const userId = new mongoose.Types.ObjectId(_user.id || (_user as any)._id);

    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } }, 
            { $unwind: { path: "$messages", preserveNullAndEmptyArrays: true } }, // 👈 Fix: Khali messages par crash nahi hoga
            { $sort: { "messages.createdAt": -1 } }, 
            { $group: { _id: "$_id", messages: { $push: "$messages" } } } 
        ]);

        // Agar user hi nahi mila (rare case if session exists)
        if (!user || user.length === 0) {
            return Response.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        // Agar messages khali hain (unwind fix ke baad empty array aayega)
        const userMessages = user[0].messages[0] === null ? [] : user[0].messages;

        return Response.json(
            { success: true, messages: userMessages },
            { status: 200 }
        );

    } catch (error) {
        console.error("An unexpected error occurred:", error);
        return Response.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}