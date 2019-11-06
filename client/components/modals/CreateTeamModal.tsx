import React, { useCallback, useEffect } from "react";
import { Modal, Form, Input, Icon, message } from "antd";
import { useModal } from ".";
import { FormComponentProps } from "antd/lib/form";
import { useCreateTeamMutation, GetUserTeamsDocument } from "../../generated/graphql";
import { errorMessage } from "../../lib/messageHandler";


const CreateTeamModal: React.FC<FormComponentProps> = ({ form }) => {
  const { hideModal } = useModal();
  const [createTeam, { loading }] = useCreateTeamMutation();
  const unmount = () => hideModal();

  const handleEnterPress = useCallback(e => {
    const { keyCode } = e;
    if (keyCode === 13 && form.isFieldTouched('name')) {
      handleSubmit()
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
    validateFields(async (validationErrors, { name }) => {
      if (!validationErrors) {
        try {
          const response = await createTeam({
            variables: {
              name
            },
            refetchQueries: [{ query: GetUserTeamsDocument }]
          })
          if (response && response.data) {
            message.success(`Your team ${name} has been created`)
          }
          unmount();
        } catch (err) {
          errorMessage(err)
        }
      }
    })
  }

  const { getFieldDecorator } = form;
  return (
    <Modal
      title="Create a Team"
      visible={true}
      confirmLoading={loading}
      onOk={handleSubmit}
      onCancel={unmount}
      okText={'Create team'}
    >
      <Form>
        <Form.Item hasFeedback label="Team name" required>
          {getFieldDecorator("name", {
            rules: [{ required: true, message: "Team name is required" }]
          })(
            <Input
              prefix={<Icon type="team" style={{ color: "rgba(0,0,0,.25" }} />}
              placeholder="Team name"
            />
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Form.create({ name: "createTeam" })(CreateTeamModal);
