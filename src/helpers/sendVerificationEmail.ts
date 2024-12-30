import { resend } from "@/lib/resendEmail";
import VerificationEmail from "../../emails/VerificationEmail";


import { ApiResponse } from "@/types/ApiResponse";


export async function sendVerificationEmail(
    email: string,
    username: string, 
    verifyCode: string
): Promise<ApiResponse> {
   try {
    const { data, error } = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'AnonymouseMessage | Verification Code',
        react: VerificationEmail({ username: username, otp: verifyCode }),
      });

    return {success: false, message: "Failed to send Verification Code"}
   } catch (emailError) {
    console.error("Error sending verififcation Email", emailError);

    return {success: false, message: "Failed to send Verification Code"}
   } 
}