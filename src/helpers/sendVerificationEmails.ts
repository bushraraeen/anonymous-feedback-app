import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail"; // Path check kar lena apne folder ke hisaab se
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    // Resend API ka use karke email bhej rahe hain
    await resend.emails.send({
      from: 'onboarding@resend.dev', // Initial testing ke liye yahi default domain use karein
      to: email,
      subject: 'Mystery Message | Verification Code',
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    return { success: true, message: "Verification email sent successfully" };
  } catch (emailError) {
    console.error("Error sending verification email", emailError);
    return { success: false, message: "Failed to send verification email" };
  }
}