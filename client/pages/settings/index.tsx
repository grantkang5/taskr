import React, { useState } from "react";
import { message } from "antd";
import { useRouter } from "next/router";
import ChangePassword from "../../components/layouts/SettingsLayout/ChangePassword";
import SettingsLayout from "../../components/layouts/SettingsLayout";
import { SubText, LinkText } from "../../components/common/Text";
import {
  useMeQuery,
  useUpdateUsernameMutation,
} from "../../generated/graphql";
import { EditButton } from "../../components/common/Input";

import styles from "./Settings.module.less";

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
    }
  });

  const handleUpdateUsername = async () => {
    try {
      const response = await updateUsername();
      if (response && response.data) {
        setValues({
          ...values,
          username: response.data.updateUsername.username
        });
        message.success(`Your username has been changed successfully`);
      }
    } catch (err) {
      err.graphQLErrors
        ? message.error(err.graphQLErrors[0].message, 2.5)
        : message.error("An unknown error has occurred", 2);
    }
  };

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
