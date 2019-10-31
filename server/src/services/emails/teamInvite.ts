import { fromEmail } from "./transporter";
import { emailTemplate } from "./template";

interface emailArgs {
  sender: string;
  email: string;
  teamName: string;
  teamInviteLink: string;
}

export const teamInviteEmail = ({
  sender,
  email,
  teamName,
  teamInviteLink
}: emailArgs) => {
  return {
    from: fromEmail,
    to: email,
    subject: "Team Invite | Taskr",
    html: emailTemplate({
      header: `${sender} has sent you a team invite to ${teamName}`,
      body: `You've been invited as a team member to ${teamName}. All team projects will be shared across team members.`,
      cta: "Accept team invitation",
      link: `${process.env.CLIENT_URL}/team-invitation/success?email=${email}&id=${teamInviteLink}`,
      footer: "This email will be invalid after 1 hour from being sent"
    })
  };
};
