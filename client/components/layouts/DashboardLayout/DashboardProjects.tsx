import React from "react";
import { useGetUserProjectsQuery } from "../../../generated/graphql";
import { useRouter } from "next/router";
import { encode } from "../../../lib/hashids";

const DashboardProjects: React.FC = () => {
  const router = useRouter();
  const { data } = useGetUserProjectsQuery();

  const handleClick = (id: string | number) => () => {
    router.push({
      pathname: `/project/${encode(id)}`
    });
  };
  return (
    <div>
      {data!.getUserProjects.map(project => {
        return (
          <div
            style={{ cursor: "pointer" }}
            key={project.id}
            onClick={handleClick(project.id)}
          >
            {project.name}
          </div>
        );
      })}
    </div>
  );
};

export default DashboardProjects;
