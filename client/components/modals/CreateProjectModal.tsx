import React, { useCallback, useEffect } from "react";
import { Modal, Form, Input, Icon, message } from "antd";
import { useModal } from ".";
import { FormComponentProps } from "antd/lib/form";
import { GetUserProjectsDocument, useCreateProjectMutation } from "../../generated/graphql";


const CreateProjectModal: React.FC<FormComponentProps> = ({ form }) => {
  const { hideModal } = useModal();
  const [createProject, { loading }] = useCreateProjectMutation();
  const unmount = () => hideModal();

  const handleEnterPress = useCallback(e => {
    const {keyCode} = e;
    if (keyCode === 13 && form.isFieldTouched('name')) {
      handleSubmit();
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleEnterPress)

    return () => {
      window.removeEventListener('keydown', handleEnterPress)
    }
  }, [handleEnterPress])

  const handleSubmit = () => {
    const { validateFields } = form;
    validateFields(async (validationErrors, { name, desc }) => {
      if (!validationErrors) {
        try {
          const response = await createProject({
            variables: {
              name,
              desc
            },
            refetchQueries: [{ query: GetUserProjectsDocument }]
          })
          if (response && response.data) {
            message.success(`Your project ${name} has been created`)
          }
          unmount();
        } catch (err) {
          err.graphQLErrors
            ? message.error(err.graphQLErrors[0].message, 2.5)
            : message.error("An unknown error has occurred", 2);
        }
      }
    })
  }

  const { getFieldDecorator } = form;
  return (
    <Modal
      title="Create a Project"
      visible={true}
      confirmLoading={loading}
      onOk={handleSubmit}
      onCancel={unmount}
      okText={'Create project'}
    >
      <Form>
        <Form.Item hasFeedback label="Team name" required>
          {getFieldDecorator("name", {
            rules: [{ required: true, message: "Project name is required" }]
          })(
            <Input
              prefix={<Icon type="project" style={{ color: "rgba(0,0,0,.25" }} />}
              placeholder="Project name"
            />
          )}
        </Form.Item>

        <Form.Item label="Project description">
            {getFieldDecorator("desc", {
            })(
              <Input.TextArea />
            )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Form.create({ name: "createProject" })(CreateProjectModal);
