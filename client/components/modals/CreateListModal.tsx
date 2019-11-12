import React from 'react';
import { Modal, Form, Input, Icon } from 'antd';
import { useModal } from '.';
import { useCreateListMutation } from '../../generated/graphql';
import { useRouter } from 'next/router';
import { FormComponentProps } from 'antd/lib/form';
import { errorMessage } from '../../lib/messageHandler';

const CreateListModal: React.FC<FormComponentProps> = ({ form }) => {
  const { getFieldDecorator, validateFields } = form;
  const { hideModal } = useModal();
  const unmount = () => hideModal();
  const [createList] = useCreateListMutation({
    onCompleted: () => unmount(),
    onError: err => errorMessage(err)
  });
  const router = useRouter();

  const handleSubmit = () => {
    const projectId = router.query.projectId as string;
    validateFields((validationErrors, { name }) => {
      if (!validationErrors) {
        createList({ variables: { name, projectId } });
      }
    });
  };

  return (
    <Modal
      visible={true}
      title="Create List"
      onOk={handleSubmit}
      onCancel={unmount}
    >
      <Form>
        <Form.Item>
          {getFieldDecorator('name', {
            rules: [{ required: true, message: 'List name is required' }]
          })(
            <Input
              prefix={
                <Icon type="align-center" style={{ color: 'rgba(0,0,0,.25' }} />
              }
              placeholder="List name"
            />
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Form.create({ name: 'createList' })(CreateListModal);
