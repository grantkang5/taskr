import React, { useState } from "react";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import {
  useSendTeamInviteLinkMutation,
  useGetUserTeamQuery
} from "../../../generated/graphql";
import { useRouter } from "next/router";
import { Button, Input, message, Skeleton } from "antd";
import { errorMessage } from "../../../lib/messageHandler";
import { decode } from "../../../lib/hashids";
import { Card, DropLayout, DropLayout2 } from "../../../components/common/Card";

const Team: React.FC = () => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const { data, loading } = useGetUserTeamQuery({
    variables: {
      id: decode(router.query.teamId as string)
    }
  });
  const [sendTeamInviteLink] = useSendTeamInviteLinkMutation({
    onCompleted: () => {
      message.success(`A team invitation has been sent to ${value}`);
    },
    onError: err => errorMessage(err)
  });

  const handleInviteMember = async () => {
    await sendTeamInviteLink({
      variables: {
        teamId: router.query.teamId as string,
        email: value
      }
    });
  };

  if (!loading && !data) {
    return null;
  }
  if (loading || !data) {
    return (
      <DashboardLayout>
        <Skeleton active />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Input value={value} onChange={e => setValue(e.currentTarget.value)} />
      <Button onClick={handleInviteMember}>Invite member</Button>
      <DropLayout />
      <DropLayout2 />
    </DashboardLayout>
  );
};

export default Team;
