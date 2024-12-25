import nodemailer from "nodemailer";

export const mailer = async (email: string, subject: string, message: string) => {
  if (!email) {
    throw new Error('No email address provided.');
  } 
  try { 
    const transport = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const mailOption = {
      from: "CFI-Center For Innovation",
      to: email,
      subject,
      html: message
    };
    const mailResponse = await transport.sendMail(mailOption);
    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
