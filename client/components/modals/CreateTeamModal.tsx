import React from "react";
import { Modal, Form, Input, Icon, message } from "antd";
import { useModal } from ".";
import { FormComponentProps } from "antd/lib/form";
import { useCreateTeamMutation, GetUserTeamsDocument } from "../../generated/graphql";

const CreateTeamModal: React.FC<FormComponentProps> = ({ form }) => {
  const { hideModal } = useModal();
  const [createTeam, { loading }] = useCreateTeamMutation();
  const unmount = () => hideModal();

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
      title="Create a Team"
      visible={true}
      confirmLoading={loading}
      onOk={handleSubmit}
      onCancel={unmount}
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
