import React from 'react';
import Router from 'next/router';
import Layout from '../components/common/Layout';
import { useSendVerificationLinkMutation } from '../generated/graphql';
import { message, Form, Input, Icon, Button } from 'antd';
import AuthLayout from '../components/auth/AuthLayout';
import { FormComponentProps } from 'antd/lib/form';
import GoogleLogin from '../components/auth/GoogleLogin';

import './App.module.less'

const Register: React.FC<FormComponentProps> = ({ form }) => {
  const [sendVerificationLink, { loading }] = useSendVerificationLinkMutation();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const { validateFields } = form;
    validateFields(async (err, { email, password }) => {
      if (!err) {
        try {
          const response = await sendVerificationLink({
            variables: {
              email,
              password
            }
          });
          if (response && response.data) {
            Router.push({
              pathname: '/email-verification',
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
    if (value && value !== getFieldValue('password')) {
      callback('Passwords do not match');
    } else {
      callback();
    }
  };

  const { getFieldDecorator } = form;

  return (
    <Layout dark={1} title="Signup | Taskr">
      <AuthLayout>
        <Form onSubmit={handleSubmit}>
          <Form.Item>
            {getFieldDecorator('email', {
              rules: [
                { required: true, message: 'Email field is required' },
                { type: 'email', message: 'Not a a valid email address' }
              ]
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: 'rgba(0,0,0,.25' }} />
                }
                placeholder="example@email.com"
              />
            )}
          </Form.Item>

          <Form.Item>
            {getFieldDecorator('password', {
              rules: [
                { required: true, message: 'Password field is required' },
                { min: 6, message: 'Password must be at least 6 characters' }
              ]
            })(
              <Input.Password
                prefix={
                  <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                placeholder="Password"
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('confirmPassword', {
              rules: [
                { required: true, message: 'Please confirm your password' },
                { validator: compareOriginalPassword }
              ]
            })(
              <Input.Password
                prefix={
                  <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                placeholder="Confirm password"
              />
            )}
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="submit"
              type="primary"
              style={{ width: '100%' }}
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

export default Form.create({ name: 'register' })(Register);
