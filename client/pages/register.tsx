import React from "react";
import { useRouter } from "next/router";
import Layout from "../components/layouts/Layout";
import {
  useSendVerificationLinkMutation,
  useRegisterMutation,
  useMeLazyQuery
} from "../generated/graphql";
import { message, Form, Input, Icon, Button } from "antd";
import AuthLayout from "../components/auth/AuthLayout";
import { FormComponentProps } from "antd/lib/form";
import GoogleLogin from "../components/auth/GoogleLogin";

import "./App.less";
import { setAccessToken } from "../lib/accessToken";
import { errorMessage } from "../lib/messageHandler";

const Register: React.FC<FormComponentProps> = ({ form }) => {
  const router = useRouter();
  const [sendVerificationLink, { loading }] = useSendVerificationLinkMutation({
    onCompleted: data => {
      router.push({
        pathname: "/email-verification",
        query: {
          email: form.getFieldValue("email"),
          id: data.sendVerificationLink
        }
      });
    },
    onError: err => errorMessage(err)
  });
  const [register, { loading: registerLoading }] = useRegisterMutation({
    onCompleted: data => {
      setAccessToken(data.register.accessToken);
      getMe();
    },
    onError: err => errorMessage(err)
  });
  const [getMe] = useMeLazyQuery({
    onCompleted: data => {
      const { returnUrl, ...queryParams } = router.query;
      message.success(`Congratulations! Welcome to Taskr`, 2.5);
      router.push({
        pathname: router.query.returnUrl as string,
        query: { ...queryParams }
      });
    }
  });

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const { validateFields } = form;
    validateFields(async (validationErrors, { email, password }) => {
      if (validationErrors) {
        return null;
      }

      if (router.query.returnUrl) {
        const { returnUrl, registerKey, ...queryParams } = router.query;
        register({
          variables: {
            email,
            verificationLink: queryParams.id as string,
            registerKey: registerKey as string,
            password
          }
        });
      } else {
        sendVerificationLink({
          variables: {
            email,
            password
          }
        });
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
    <Layout dark={1} title="Signup | Taskr">
      <AuthLayout>
        <Form onSubmit={handleSubmit}>
          <Form.Item hasFeedback>
            {getFieldDecorator("email", {
              initialValue: router.query.email ? router.query.email : "",
              rules: [
                { required: true, message: "Email field is required" },
                { type: "email", message: "Not a a valid email address" }
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
                placeholder="Password"
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
              loading={loading || registerLoading}
            >
              Sign up
            </Button>
          </Form.Item>
        </Form>
        <GoogleLogin />
      </AuthLayout>
    </Layout>
  );
};

export default Form.create({ name: "register" })(Register);
