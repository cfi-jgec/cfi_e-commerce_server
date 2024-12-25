export const verificationEmailFormat = (otp: string, isForgetPass?: boolean) => {
    return (`
        <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
            <tr>
                <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                    <!-- Header Section -->
                    <tr>
                    <td align="center" style="padding: 20px; background-color: #03205e; color: #ffffff;">
                        <img
                        src="https://cfi-jgec-new.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo_light.861f5d4e.png&w=96&q=75"
                        alt="Center for Innovation Logo"
                        style="display: block; width: 80px; height: auto; margin-bottom: 10px;"
                        />
                        <h1 style="margin: 0; font-size: 24px;">${!isForgetPass && "Welcome to "}Center for Innovation Club</h1>
                    </td>
                    </tr>

                    <!-- Body Section -->
                    <tr>
                    <td style="padding: 30px; color: #333333; text-align: center;">
                        <p style="font-size: 16px; margin: 0 0 15px;">
                        ${isForgetPass ? "Your verification code is below: " : "Thank you for joining the Center for Innovation! Your verification code is below:"}
                        </p>
                        <p style="font-size: 24px; font-weight: bold; color: #4caf50; margin: 0 0 20px;">
                        ${otp}
                        </p>
                        <p style="font-size: 14px; margin: 0 0 15px;">
                        Please enter this code on the verification page to ${isForgetPass ? "reset your password." : "complete your registration."}
                        </p>
                        <p style="font-size: 14px; margin: 0;">
                        If you didn't request this email, please ignore it.
                        </p>
                    </td>
                    </tr>

                    <!-- Footer Section -->
                    <tr>
                    <td align="center" style="padding: 20px; background-color: #f4f4f4; color: #999999; font-size: 12px;">
                        <p style="margin: 0;">&copy; 2024 Center for Innovation. All rights reserved.</p>
                    </td>
                    </tr>
                </table>
                </td>
            </tr>
            </table>
        </body>`
    )
}