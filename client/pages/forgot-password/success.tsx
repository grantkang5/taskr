import React, { useEffect } from "react";
import { Form, Input, Icon, Button, message } from "antd";
import Layout from "../../components/layouts/Layout";
import AuthLayout from "../../components/auth/AuthLayout";
import { FormComponentProps } from "antd/lib/form";
import { useForgotPasswordMutation } from "../../generated/graphql";
import { SubText } from "../../components/common/Text";
import { useRouter } from "next/router";
import { errorMessage } from "../../lib/messageHandler";

const ForgotPasswordSuccessPage: React.FC<FormComponentProps> = ({ form }) => {
  const router = useRouter();
  const [forgotPassword, { loading }] = useForgotPasswordMutation();

  useEffect(() => {
    if (!router.query.id || !router.query.email) {
      router.push("/error", "/");
    }
  }, []);
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const { validateFields } = form;

    validateFields(async (validationErrors, { password }) => {
      if (!validationErrors) {
        try {
          const response = await forgotPassword({
            variables: {
              email: router.query.email as string,
              password,
              forgotPasswordLink: router.query.id as string
            }
          });

          if (response && response.data) {
            message.success(`Your password has been changed`, 2.5);
            router.push("/login");
          }
        } catch (err) {
          errorMessage(err)
        }
      }
    });
  };

  const compareOriginalPassword = (_: any, value: string, callback: any) => {
    const { getFieldValue } = form;
    if (value && value !== getFieldValue("password")) {
      callback("Passwords do not match");
    } else {
      callback();
    }
  };

  const { getFieldDecorator } = form;
  return (
    <Layout dark={1} title="Forgot Password | Taskr">
      <AuthLayout>
        <Form onSubmit={handleSubmit}>
          <SubText style={{ marginBottom: "25px" }}>
            Enter and confirm your new password. You will be able to login to
            your account with the new password right away.
          </SubText>

          <Form.Item hasFeedback>
            {getFieldDecorator("password", {
              rules: [
                { required: true, message: "Password field is required" },
                { min: 6, message: "Password must be at least 6 characters" }
              ]
            })(
              <Input.Password
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="New password"
              />
            )}
          </Form.Item>
          <Form.Item hasFeedback>
            {getFieldDecorator("confirmPassword", {
              rules: [
                { required: true, message: "Please confirm your password" },
                { validator: compareOriginalPassword }
              ]
            })(
              <Input.Password
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="Confirm password"
              />
            )}
          </Form.Item>

          <Form.Item>
            <Button
              htmlType="submit"
              type="primary"
              style={{ width: "100%" }}
              loading={loading}
            >
              Reset password
            </Button>
          </Form.Item>
        </Form>
      </AuthLayout>
    </Layout>
  );
};

export default Form.create({ name: "forgotPasswordSuccess" })(
  ForgotPasswordSuccessPage
);
