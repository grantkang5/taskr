import { fromEmail } from "./transporter"
import { emailTemplate } from "./template"

export const forgotPasswordEmail = (email: string, forgotPasswordLink: string) => {
  return {
    from: fromEmail,
    to: email,
    subject: "Forgot password | Taskr",
    html: emailTemplate({
      header: 'Looks like you forgot your password',
      body: `You're receiving this email because you've requested
      to reset your password for Taskr. All your sessions have
      been invalidated but your old password will still be valid
      until you successfully change your password. Once you click
      the link we will redirect you to change your password.`,
      cta: 'Change password',
      link: `${process.env.CLIENT_URL}/forgot-password/success?email=${email}&id=${forgotPasswordLink}`,
      footer: 'This email will be invalid after 1 hour from being sent'
    })
  }
}

