import { useModal } from "../../modals";
import { useGetUserTeamsQuery, useGetUserProjectsQuery } from "../../../generated/graphql";
import { Menu, Icon, Skeleton } from "antd";
import { MenuItemIcon } from "../../common/Menu";
import Layout from "../Layout";
import { useRouter } from "next/router";
import DashboardProjects from "./DashboardProjects";

const DashboardLayout: React.FC = ({ children }) => {
  const router = useRouter();
  const { showModal } = useModal();
  const { data: teamData, loading: teamLoading } = useGetUserTeamsQuery();
  const { data: projectData, loading: projectLoading } = useGetUserProjectsQuery();
  const showCreateTeamModal = () => showModal("createTeam");
  const showCreateProjectModal = () => showModal("createProject")

  const handleTeamClick = (teamId: string | number) => () => {
    router.push({ pathname: `/team/${teamId}` })
  }
  const handleProjectClick = (projectId: string | number) => () => {
    router.push({ pathname: `project/${projectId}` })
  }

  return (
    <Layout
      sider={
        <>
          <Menu
            style={{ height: "100%" }}
            mode="inline"
            defaultOpenKeys={["projects", "teams"]}
          >
            <Menu.SubMenu
              key="projects"
              title={
                <span>
                  <Icon type="project" />
                  <span>Projects</span>
                </span>
              }
            >
              {
                projectLoading || !projectData ? (
                  <Skeleton active />
                ) : (
                  projectData.getUserProjects.map(project => (
                    <Menu.Item key={project.id} onClick={handleProjectClick(project.id)}>
                      {project.name}
                    </Menu.Item>
                  ))
                )
              }
            </Menu.SubMenu>
            <Menu.SubMenu
              key="teams"
              title={
                <span>
                  <Icon type="team" />
                  <span>Teams</span>
                </span>
              }
            >
              {teamLoading || !teamData ? (
                <Skeleton active />
              ) : (
                teamData.getUserTeams.map(team => (
                  <Menu.Item key={team.id} onClick={handleTeamClick(team.id)}>
                    {team.name}
                  </Menu.Item>
                ))
              )}
            </Menu.SubMenu>
            <Menu.Divider />
            <Menu selectable={false} style={{ borderRight: 'none', paddingTop: '20px' }}>
              <MenuItemIcon
                label="Create Project"
                iconType="plus-square"
                leftIcon="project"
                onClick={showCreateProjectModal}
              />
              <MenuItemIcon
                label="Create Team"
                iconType="plus-square"
                leftIcon="team"
                onClick={showCreateTeamModal}
              />
            </Menu>
          </Menu>
        </>
      }
    >
      {
        !projectLoading && projectData && projectData.getUserProjects ? (
          <DashboardProjects />
        ) : <Skeleton active />
      }
    </Layout>
  );
};

export default DashboardLayout;
