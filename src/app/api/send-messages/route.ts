import dbConnect from "@/lib/dbConnect";
import UserModel from "@/app/model/User";
import { Message } from "@/app/model/User";

// ✅ SAHI: Sirf 'export async function POST' hona chahiye
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

        user.messages.push(newMessage as Message);
        await user.save();

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

// ❌ GALAT: Yahan niche 'export default ...' KUCH BHI NAHI hona chahiye