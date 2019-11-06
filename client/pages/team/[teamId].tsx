import React, { useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import {
  useSendTeamInviteLinkMutation,
  useGetUserTeamQuery
} from "../../generated/graphql";
import { useRouter } from "next/router";
import { Button, Input, message } from "antd";
import { errorMessage } from "../../lib/messageHandler";

const Team: React.FC = () => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const { data, loading } = useGetUserTeamQuery({
    variables: {
      id: router.query.teamId as string
    }
  });
  const [sendTeamInviteLink] = useSendTeamInviteLinkMutation();

  const handleInviteMember = async () => {
    try {
      const res = await sendTeamInviteLink({
        variables: {
          teamId: router.query.teamId as string,
          email: value
        }
      });
      if (res && res.data) {
        message.success(`A team invitation has been sent to ${value}`);
      }
    } catch (err) {
      errorMessage(err)
    }
  };

  if (loading && !data) {
    return null;
  }

  return (
    <DashboardLayout>
      <Input value={value} onChange={e => setValue(e.currentTarget.value)} />
      <Button onClick={handleInviteMember}>Invite member</Button>
    </DashboardLayout>
  );
};

export default Team;
