import React, { useState } from "react";
import { message } from "antd";
import { useRouter } from "next/router";
import ChangePassword from "../../components/layouts/SettingsLayout/ChangePassword";
import SettingsLayout from "../../components/layouts/SettingsLayout";
import { SubText, LinkText } from "../../components/common/Text";
import { useMeQuery, useUpdateUsernameMutation } from "../../generated/graphql";
import { EditButton } from "../../components/common/Input";

import styles from "./Settings.module.less";
import { errorMessage } from "../../lib/messageHandler";

const SettingsPage: React.FC = () => {
  const { data } = useMeQuery();
  const router = useRouter();
  const initialValues = {
    username: data!.me.username
  };
  const [values, setValues] = useState(initialValues);
  const [changePassword, showChangePassword] = useState(false);
  const [updateUsername] = useUpdateUsernameMutation({
    variables: {
      username: values.username
    },
    onCompleted: userNameData => {
      setValues({
        ...values,
        username: userNameData.updateUsername.username
      });
    },
    onError: err => errorMessage(err)
  });

  const handleUpdateUsername = async () => updateUsername();

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setValues({
      ...values,
      [name]: value
    });
  };

  const clearValue = (e: React.FormEvent<HTMLInputElement>) => {
    const { name } = e.currentTarget;
    setValues({
      ...values,
      [name]: (initialValues as any)[name]
    });
  };

  if (!data) {
    return <></>;
  }

  const handleChangePassword = () => {
    showChangePassword(!changePassword);
  };

  return (
    <SettingsLayout>
      <div className={styles.settingsContent}>
        <div>
          <SubText>Email</SubText>
          <p>{data.me.email}</p>
        </div>
        <div className={styles.dataContent}>
          <div className={styles.labels}>
            <SubText>Username</SubText>
            <EditButton
              name="username"
              value={values.username}
              submit={handleUpdateUsername}
              onChange={handleInputChange}
              clearValue={clearValue}
              defaultValue={data.me.username}
            />
          </div>

          <div className={styles.labels}>
            <LinkText
              onClick={handleChangePassword}
              style={{ marginBottom: "15px" }}
            >
              Change password
            </LinkText>
            {changePassword && <ChangePassword />}
          </div>
        </div>
      </div>
    </SettingsLayout>
  );
};

export default SettingsPage;
