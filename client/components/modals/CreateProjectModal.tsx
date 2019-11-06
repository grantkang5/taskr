import React, { useCallback, useEffect } from "react";
import { Modal, Form, Input, Icon, message } from "antd";
import { useModal } from ".";
import { FormComponentProps } from "antd/lib/form";
import {
  GetUserProjectsDocument,
  useCreateProjectMutation
} from "../../generated/graphql";
import { errorMessage } from "../../lib/messageHandler";

const CreateProjectModal: React.FC<FormComponentProps> = ({ form }) => {
  const { hideModal } = useModal();
  const [createProject, { loading }] = useCreateProjectMutation({
    onCompleted: () => {
      message.success(
        `Your project ${form.getFieldValue("name")} has been created`
      );
      unmount();
    },
    onError: err => errorMessage(err),
    refetchQueries: [{ query: GetUserProjectsDocument }]
  });
  const unmount = () => hideModal();

  const handleEnterPress = useCallback(e => {
    const { keyCode } = e;
    if (keyCode === 13 && form.isFieldTouched("name")) {
      handleSubmit();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleEnterPress);

    return () => {
      window.removeEventListener("keydown", handleEnterPress);
    };
  }, [handleEnterPress]);

  const handleSubmit = () => {
    const { validateFields } = form;
    validateFields(async (validationErrors, { name, desc }) => {
      if (!validationErrors) {
        await createProject({
          variables: {
            name,
            desc
          }
        });
      }
    });
  };

  const { getFieldDecorator } = form;
  return (
    <Modal
      title="Create a Project"
      visible={true}
      confirmLoading={loading}
      onOk={handleSubmit}
      onCancel={unmount}
      okText={"Create project"}
    >
      <Form>
        <Form.Item hasFeedback label="Team name" required>
          {getFieldDecorator("name", {
            rules: [{ required: true, message: "Project name is required" }]
          })(
            <Input
              prefix={
                <Icon type="project" style={{ color: "rgba(0,0,0,.25" }} />
              }
              placeholder="Project name"
            />
          )}
        </Form.Item>

        <Form.Item label="Project description">
          {getFieldDecorator("desc", {})(<Input.TextArea />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Form.create({ name: "createProject" })(CreateProjectModal);
