import React from 'react';
import { useGetUserProjectsQuery } from '../../../generated/graphql';

const DashboardProjects: React.FC = () => {
  const { data } = useGetUserProjectsQuery();
  return (
    <div>
      {data!.getUserProjects.map(project => {
        return (
          <div key={project.id}>{project.name}</div>
        )
      })}
    </div>
  )
}

export default DashboardProjects;