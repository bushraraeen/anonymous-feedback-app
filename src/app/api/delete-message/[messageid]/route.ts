import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/app/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ messageid: string }> } 
) {
  const { messageid } = await params; 
  await dbConnect();

  const session = await auth();
  const _user: User = session?.user as User;

  if (!session || !_user) {
    return Response.json(
      { success: false, message: "Not Authenticated" },
      { status: 401 }
    );
  }

  try {
    // FIX: User ID session mein 'id' ya '_id' ho sakti hai
    const userId = _user.id || (_user as any)._id;

    const updateResult = await UserModel.updateOne(
      { _id: userId }, // Yahan user ko dhoond rahe hain
      { 
        $pull: { 
          messages: { _id: messageid } // Yahan message ko remove kar rahe hain
        } 
      }
    );

    console.log("Update Result:", updateResult);

    if (updateResult.matchedCount === 0) {
        return Response.json(
          { success: false, message: "User not found" },
          { status: 404 }
        );
    }

    if (updateResult.modifiedCount === 0) {
      return Response.json(
        { success: false, message: "Message not found or already deleted" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: "Message deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete Error:", error);
    return Response.json(
      { success: false, message: "Error deleting message" },
      { status: 500 }
    );
  }
}