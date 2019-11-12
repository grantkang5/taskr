import React from 'react';
import { useRouter } from 'next/router';
import ProjectLayout from '../../components/layouts/ProjectLayout';
import styles from './Project.module.less';
import {
  useGetUserProjectQuery,
  useCreateListMutation
} from '../../generated/graphql';
import { errorMessage } from '../../lib/messageHandler';
import { Card, Button } from 'antd';
import { useModal } from '../../components/modals';

const ProjectPage: React.FC = () => {
  const router = useRouter();
  const { showModal, hideModal } = useModal();
  const showCreateListModal = () => showModal('createList');
  const { data, loading } = useGetUserProjectQuery({
    variables: { id: router.query.projectId as string },
    onError: err => errorMessage(err)
  });
  const [createList] = useCreateListMutation();

  if (!data && loading) {
    return <div>loading</div>;
  }

  return (
    <ProjectLayout title={data!.getUserProject.name}>
      <Button onClick={showCreateListModal}>Create List</Button>
      <div className={styles.listsContainer}>
        {data &&
          data.getUserProject.lists.map(list => (
            <Card style={{ width: '200px' }} key={list.id}>
              {list.name}
            </Card>
          ))}
      </div>
    </ProjectLayout>
  );
};

export default ProjectPage;
