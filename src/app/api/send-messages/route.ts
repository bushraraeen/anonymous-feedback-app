import dbConnect from "@/lib/dbConnect";
import UserModel from "@/app/model/User";
import { Message } from "@/app/model/User";
import { AnyARecord } from "dns";


export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, content } = await request.json();

        const user = await UserModel.findOne({ username });

        if (!user) {
            return Response.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        if (!user.isAcceptingMessage) {
            return Response.json(
                { success: false, message: "User is not accepting messages" },
                { status: 403 }
            );
        }

        const newMessage = { content, createdAt: new Date() };

     const updatedUser = user as any;
updatedUser.messages.push(newMessage);
await updatedUser.save();
       

        return Response.json(
            { success: true, message: "Message sent successfully" },
            { status: 201 }
        );

    } catch (error) {
        console.error("Error in sending message:", error);
        return Response.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}

