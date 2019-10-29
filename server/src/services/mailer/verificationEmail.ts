import { fromEmail } from "./transporter"

export const verificationEmail = (email: string, verificationLink: string) => {
  return {
    from: fromEmail,
    to: email,
    subject: "Please confirm your account registration",
    html: `
      <p>Click the <a href='${process.env.CLIENT_URL}/email-verification/success?email=${email}&id=${verificationLink}'>link</a> to confirm your account:</p>
    `
  }
}

