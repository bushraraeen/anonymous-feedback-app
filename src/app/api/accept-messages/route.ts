import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/app/model/User";

// ✅ SAHI: Har method ke aage 'export' hona chahiye aur 'default' keyword kahin nahi hona chahiye
export async function POST(request: Request) {
    await dbConnect();
    const session = await auth();
    const user = session?.user;

    if (!session || !user) {
        return Response.json({ success: false, message: "Not Authenticated" }, { status: 401 });
    }

    const userId = user.id || (user as any)._id;
    const { acceptMessages } = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessages },
            { new: true }
        );

        return Response.json({ success: true, message: "Updated", updatedUser }, { status: 200 });
    } catch (error) {
        return Response.json({ success: false, message: "Error" }, { status: 500 });
    }
}

export async function GET(request: Request) {
    await dbConnect();
    const session = await auth();
    const user = session?.user;

    if (!session || !user) {
        return Response.json({ success: false, message: "Not Authenticated" }, { status: 401 });
    }

    const userId = user.id || (user as any)._id;

    try {
        const foundUser = await UserModel.findById(userId);
        return Response.json({
            success: true,
            isAcceptingMessages: foundUser?.isAcceptingMessage 
        }, { status: 200 });
    } catch (error) {
        return Response.json({ success: false, message: "Error" }, { status: 500 });
    }
}

// ❌ GALAT: Neeche aisa kuch 'export default' mat likhna