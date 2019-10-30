import { fromEmail } from "./transporter";
import { emailTemplate } from "./template";


export const invitationEmail = (email: string, invitationLink: string, inviter: string, projectId: number) => {
    return {
        from: fromEmail,
        to: email,
        subject: "You have been invited to join a board on Taskr.",
        html: emailTemplate({
            header: 'Hey there! You ',
            body: `We're happy you've signed up for Taskr to help develop your projects. You can get started right away by creating a new project and inviting other people.`,
            cta: 'Accept Invitation',
            link: `${process.env.CLIENT_URL}/board-invitation/success?email=${email}&id=${invitationLink}&boardid=`,
            footer: 'This email will be invalid after 1 hour from being sent'
        })
    };
};
