import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProjectLayout from '../../components/layouts/ProjectLayout';
import styles from './Project.module.less';
import {
  useGetUserProjectQuery,
  useCreateListMutation,
  useOnListAddedSubscription
} from '../../generated/graphql';
import { errorMessage } from '../../lib/messageHandler';
import { Card, Button } from 'antd';
import { useModal } from '../../components/modals';
import gql from 'graphql-tag';

const ProjectPage: React.FC = () => {
  const router = useRouter();
  const { showModal } = useModal();
  const showCreateListModal = () => showModal('createList');
  const { data, loading, subscribeToMore } = useGetUserProjectQuery({
    variables: { id: router.query.projectId as string },
    onError: err => errorMessage(err)
  });
  if (!data && loading) {
    return <div>loading</div>;
  }

  const LIST_SUBSCRIPTION = gql`
    subscription onListAdded {
      listAdded {
        id
        name
        pos
      }
    }
  `;

  const subscribeToNewLists = () => {
    subscribeToMore({
      document: LIST_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }: { subscriptionData: any }) => {
        if (!subscriptionData.data) {
          return prev;
        }
        const newProj = {
          ...prev.getUserProject,
          lists: [...prev.getUserProject.lists, subscriptionData.data.listAdded]
        };
        return { ...prev, getUserProject: newProj };
      },
      variables: { id: router.query.projectId as string }
    });
  };

  useEffect(() => {
    subscribeToNewLists();
  }, []);

  return (
    <ProjectLayout title={data!.getUserProject.name}>
      <Button onClick={showCreateListModal}>Create List</Button>
      <div className={styles.listsContainer}>
        {data &&
          data.getUserProject.lists.map((list: any, index: number) => (
            <Card style={{ width: '200px' }} key={list.id}>
              {list.name}
            </Card>
          ))}
      </div>
    </ProjectLayout>
  );
};

export default ProjectPage;
