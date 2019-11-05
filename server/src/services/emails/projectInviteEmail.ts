import { fromEmail } from "./transporter";
import { emailTemplate } from "./template";

interface emailArgs {
  sender: string;
  email: string;
  projectName: string;
  link: string;
}

export const projectInviteEmail = ({
  sender,
  email,
  projectName,
  link
}: emailArgs) => {
    return {
        from: fromEmail,
        to: email,
        subject: "Project Invite | Taskr",
        html: emailTemplate({
            header: `${sender} has sent you a project invite to ${projectName}`,
            body: `You've been invited as a project member to ${projectName}. You will have access to all tasks and messages shared in the project.`,
            cta: 'Accept project invitation',
            link: `${process.env.CLIENT_URL}/invite/project/success?email=${email}&id=${link}`,
            footer: 'This email will be invalid after 1 hour from being sent'
        })
    };
};
