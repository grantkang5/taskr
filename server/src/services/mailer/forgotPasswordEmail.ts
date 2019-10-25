import { fromEmail } from "./transporter"

export const forgotPasswordEmail = (email: string, forgotPasswordLink: string) => {
  return {
    from: fromEmail,
    to: email,
    subject: "Please confirm your account registration",
    html: `
      <p>Looks like you forgot your password.</p>
      <p>Click the <a href='${process.env.CLIENT_URL}/forgot-password/success?email=${email}&id=${forgotPasswordLink}'>link</a> to make a new password</p>
    `
  }
}

