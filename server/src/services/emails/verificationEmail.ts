import { fromEmail } from "./transporter";
import { emailTemplate } from "./template";


export const verificationEmail = (email: string, verificationLink: string) => {
  return {
    from: fromEmail,
    to: email,
    subject: "Please confirm your account registration",
    html: emailTemplate({
      header: 'Welcome to Taskr',
      body: `We're happy you've signed up for Taskr to help develop your projects. You can get started right away by creating a new project and inviting other people.`,
      cta: 'Validate account',
      link: `${process.env.CLIENT_URL}/email-verification/success?email=${email}&id=${verificationLink}`,
      footer: 'This email will be invalid after 1 hour from being sent'
    })
  };
};
