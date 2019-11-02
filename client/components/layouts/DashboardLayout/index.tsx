import { useModal } from "../../modals";
import { useGetUserTeamsQuery } from "../../../generated/graphql";
import { Menu, Icon, Skeleton } from "antd";
import { MenuItemIcon } from "../../common/Menu";
import Layout from "../Layout";
import { useRouter } from "next/router";

const DashboardLayout: React.FC = ({ children }) => {
  const router = useRouter();
  const { showModal } = useModal();
  const { data, loading } = useGetUserTeamsQuery();
  const showCreateTeamModal = () => showModal("createTeam");

  const handleTeamClick = (teamId: string | number) => () => {
    router.push({ pathname: `/team/${teamId}` })
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
              <Menu.Item>
                <Icon type="project" /> Project 1
              </Menu.Item>
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
              {loading || !data ? (
                <Skeleton active />
              ) : (
                data.getUserTeams.map(team => (
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
      {children}
    </Layout>
  );
};

export default DashboardLayout;
