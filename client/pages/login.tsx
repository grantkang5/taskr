import React, { useEffect } from 'react';
import {
  useLoginMutation,
  useGoogle_OAuthLazyQuery,
} from '../generated/graphql';
import { useRouter } from 'next/router';
import { setAccessToken } from '../lib/accessToken';
import Layout from '../components/common/Layout';
import { Form, Icon, Input, Button, message } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import AuthLayout from '../components/auth/AuthLayout';

const Login: React.FC<FormComponentProps> = ({ form }) => {
  const router = useRouter()
  const [useGoogleURL, { data, called, error, loading: lazyLoading }] = useGoogle_OAuthLazyQuery()
  const [login, { loading }] = useLoginMutation();

  useEffect(() => {
    if (called && !error && !lazyLoading && data && data.login_googleOAuth) {
      window.location.href = data.login_googleOAuth
    }
  }, [data])

  const handleGoogleLogin = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    await useGoogleURL();
  }


  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const { validateFields } = form;
    validateFields(async (err, { email, password }) => {
      if (!err) {
        try {
          const response = await login({
            variables: {
              email,
              password
            }
          });
          if (response && response.data) {
            setAccessToken(response.data.login.accessToken);
          }
          router.push('/');
        } catch (err) {
          err.graphQLErrors
            ? message.error(err.graphQLErrors[0].message, 2)
            : message.error(err.message, 2);
        }
      }
    });
  };

  const { getFieldDecorator } = form;

  return (
    <Layout dark={1}>
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
            <Button
              htmlType="submit"
              type="primary"
              style={{ width: '100%' }}
              loading={loading}
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
          <Button onClick={handleGoogleLogin}>
            Sign in with google the wrong way!
          </Button>
      </AuthLayout>
    </Layout>
  );
};

export default Form.create({ name: 'login' })(Login);
