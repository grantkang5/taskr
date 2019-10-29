import React from "react";
import { Form, Input, Icon, Button, message } from "antd";
import { FormComponentProps } from "antd/lib/form";
import { useChangePasswordMutation } from "../../../generated/graphql";

const ChangePassword: React.FC<FormComponentProps> = ({ form }) => {
  const [changePassword, { loading }] = useChangePasswordMutation();
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    const { validateFields, resetFields } = form;
    validateFields(
      async (validationErrors, { currentPassword, newPassword }) => {
        if (!validationErrors) {
          try {
            const response = await changePassword({
              variables: {
                currentPassword,
                newPassword
              }
            });

            if (response && response.data) {
              message.success(
                `Your password has changed for the next time you login`
              );
              resetFields();
            }
          } catch (err) {
            err.graphQLErrors
              ? message.error(err.graphQLErrors[0].message, 2.5)
              : message.error("An unknown error has occurred", 2);
          }
        }
      }
    );
  };

  const compareOriginalPassword = (_: any, value: string, callback: any) => {
    const { getFieldValue } = form;
    if (value && value !== getFieldValue("newPassword")) {
      callback("Passwords do not match");
    } else {
      callback();
    }
  };

  const { getFieldDecorator } = form;

  return (
    <Form onSubmit={handleSubmit} style={{ width: '350px' }}>
      <Form.Item hasFeedback>
        {getFieldDecorator("currentPassword", {
          rules: [
            { required: true, message: "Current password is required" },
            { min: 6, message: "Password must be at least 6 characters" }
          ]
        })(
          <Input.Password
            prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
            placeholder="Current password"
          />
        )}
      </Form.Item>
      <Form.Item hasFeedback>
        {getFieldDecorator("newPassword", {
          rules: [
            { required: true, message: "New password is required" },
            { min: 6, message: "New password must be at least 6 characters" }
          ]
        })(
          <Input.Password
            prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
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
            prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
            placeholder="Confirm password"
          />
        )}
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" type="primary" block loading={loading}>
          Change password
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Form.create({ name: "changePassword" })(ChangePassword);
