import dbConnect from "@/lib/dbConnect";
import UserModel from "@/app/model/User";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, code } = await request.json();
        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({ username: decodedUsername });

        if (!user) {
            return Response.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        // ✅ Change yahan hai: Hum check kar rahe hain ki kya code "123456" hai YA database wala code sahi hai
        const isStaticCode = code === "123456";
        const isCodeValid = user.verifyCode === code || isStaticCode;
        
        // Agar static code use kiya hai toh expiry check karne ki zaroorat nahi
        const isCodeNotExpired = isStaticCode || new Date(user.verifyCodeExpiry) > new Date();

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();

            return Response.json(
                { success: true, message: "Account verified successfully" },
                { status: 200 }
            );
        } else if (!isCodeNotExpired) {
            return Response.json(
                { success: false, message: "Code expired. Please sign up again." },
                { status: 400 }
            );
        } else {
            return Response.json(
                { success: false, message: "Incorrect verification code" },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error("Error verifying user:", error);
        return Response.json(
            { success: false, message: "Error verifying user" },
            { status: 500 }
        );
    }
}