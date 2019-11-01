import { fromEmail } from "./transporter";
import { emailTemplate } from "./template";

interface emailArgs {
  sender: string;
  email: string;
  teamName: string;
  link: string;
}

export const teamInviteEmail = ({
  sender,
  email,
  teamName,
  link
}: emailArgs) => {
  return {
    from: fromEmail,
    to: email,
    subject: "Team Invite | Taskr",
    html: emailTemplate({
      header: `${sender} has sent you a team invite to ${teamName}`,
      body: `You've been invited as a team member to ${teamName}. All team projects will be shared across team members.`,
      cta: "Accept team invitation",
      link: `${process.env.CLIENT_URL}/invite/team/success?email=${email}&id=${link}`,
      footer: "This email will be invalid after 1 hour from being sent"
    })
  };
};
