import React from "react";
import Layout from "../../components/layouts/Layout";
import AuthLayout from "../../components/auth/AuthLayout";
import { Form, Input, Icon, Button, message } from "antd";
import { FormComponentProps } from "antd/lib/form";
import { SubText } from "../../components/common/Text";
import { useSendForgotPasswordLinkMutation } from "../../generated/graphql";
import { errorMessage } from "../../lib/messageHandler";

const ForgotPasswordPage: React.FC<FormComponentProps> = ({ form }) => {
  const [
    sendForgotPasswordLink,
    { loading }
  ] = useSendForgotPasswordLinkMutation({
    onCompleted: () => {
      message.success("An email has been sent to reset your password");
    },
    onError: err => errorMessage(err)
  });

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const { validateFields } = form;
    validateFields(async (validationErrors, { email }) => {
      if (!validationErrors) {
        await sendForgotPasswordLink({
          variables: {
            email
          }
        });
      }
    });
  };

  const { getFieldDecorator } = form;
  return (
    <Layout dark={1} title="Forgot password | Taskr">
      <AuthLayout>
        <Form onSubmit={handleSubmit}>
          <SubText style={{ marginBottom: "25px" }}>
            Submit your email address and we'll send you a link to reset your
            password
          </SubText>
          <Form.Item hasFeedback>
            {getFieldDecorator("email", {
              rules: [
                { required: true, message: "Email field is required" },
                { type: "email", message: "Not a valid email address" }
              ]
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25" }} />
                }
                placeholder="example@email.com"
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
              Send link
            </Button>
          </Form.Item>
        </Form>
      </AuthLayout>
    </Layout>
  );
};

export default Form.create({ name: "forgotPassword" })(ForgotPasswordPage);
