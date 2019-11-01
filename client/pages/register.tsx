import React from "react";
import Router, { useRouter } from "next/router";
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

import "./App.module.less";
import { setAccessToken } from "../lib/accessToken";

const Register: React.FC<FormComponentProps> = ({ form }) => {
  const router = useRouter();
  const [getMe] = useMeLazyQuery();
  const [sendVerificationLink, { loading }] = useSendVerificationLinkMutation();
  const [register, { loading: registerLoading }] = useRegisterMutation();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const { validateFields } = form;
    validateFields(async (validationErrors, { email, password }) => {
      if (validationErrors) {
        return null;
      }

      if (router.query.returnUrl) {
        const { returnUrl, ...queryParams } = router.query;
        try {
          const response = await register({
            variables: {
              email,
              verificationLink: queryParams.id as string,
              registerKey: "team-invite",
              password
            }
          });

          setAccessToken(response.data!.register.accessToken);
          await getMe();
          message.success(`Congratulations! Welcome to Taskr`, 2.5);
          router.push({
            pathname: router.query.returnUrl as string,
            query: { ...queryParams }
          });
        } catch (err) {
          err.graphQLErrors
            ? message.error(err.graphQLErrors[0].message, 2)
            : message.error(err.message, 2);
        }
      } else {
        try {
          const response = await sendVerificationLink({
            variables: {
              email,
              password
            }
          });
          if (response && response.data) {
            router.push({
              pathname: "/email-verification",
              query: { email, id: response.data.sendVerificationLink }
            });
          }
        } catch (err) {
          err.graphQLErrors
            ? message.error(err.graphQLErrors[0].message, 2)
            : message.error(err.message, 2);
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
    <Layout dark={1} title="Signup | Taskr">
      <AuthLayout>
        <Form onSubmit={handleSubmit}>
          <Form.Item hasFeedback>
            {getFieldDecorator("email", {
              initialValue: router.query.email ? router.query.email : '',
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
              loading={loading}
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
