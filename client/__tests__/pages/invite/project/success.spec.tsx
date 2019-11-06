import * as React from "react";
import { mount } from "enzyme";
import { MockedProvider, wait } from "@apollo/react-testing";
import {
  MeDocument,
  ValidateLinkDocument,
  AcceptProjectInviteLinkDocument
} from "../../../../generated/graphql";
import ProjectInviteSuccessPage from "../../../../pages/invite/project/success";
import { act } from "react-dom/test-utils";
import { GraphQLError } from "graphql";
import ErrorLayout from "../../../../components/layouts/ErrorLayout";
import AnonLayout from "../../../../components/layouts/AnonLayout";

describe("Pages", () => {
  describe("ProjectInviteSuccessPage", () => {
    const mockQuery = {
      email: "dev2@email.com",
      username: "dev",
      projectInviteLink: "qwe",
      id: 123,
      key: "project-invite-dev2@email.com"
    };

    const useRouter = jest.spyOn(require("next/router"), "useRouter");
    useRouter.mockImplementation(() => ({
      route: "/invite/project/success",
      query: {
        email: mockQuery.email,
        id: mockQuery.projectInviteLink
      },
      // tslint:disable-next-line: no-empty
      push: () => {}
    }));
    let acceptProjectInviteLinkCalled = false;
    const meQuery = {
      request: {
        query: MeDocument
      },
      result: {
        data: {
          me: {
            id: mockQuery.id,
            email: mockQuery.email,
            username: mockQuery.username
          }
        },
        loading: false
      }
    };
    const validateLinkQuery = {
      request: {
        query: ValidateLinkDocument,
        variables: {
          key: mockQuery.key,
          link: mockQuery.projectInviteLink
        }
      },
      result: {
        data: {
          validateLink: true
        },
        loading: false
      }
    };
    const acceptProjectLinkQuery = {
      request: {
        query: AcceptProjectInviteLinkDocument,
        variables: {
          email: mockQuery.email,
          projectInviteLink: mockQuery.projectInviteLink
        }
      },
      result: () => {
        acceptProjectInviteLinkCalled = true;
        return {
          data: {
            acceptProjectInviteLink: mockQuery.projectInviteLink
          }
        };
      }
    };

    it("fires acceptProjectInviteLink mutation on mount", async () => {
      const wrapper = mount(
        <MockedProvider
          mocks={[meQuery, validateLinkQuery, acceptProjectLinkQuery]}
          addTypename={false}
        >
          <ProjectInviteSuccessPage />
        </MockedProvider>
      );

      await act(async () => {
        await wait(10);
      });

      expect(acceptProjectInviteLinkCalled).toBe(true);
      wrapper.unmount();
    });

    it("should render an error layout if the link has expired", async () => {
      const errorQuery = {
        ...validateLinkQuery,
        result: {
          errors: [new GraphQLError(`This link has expired`)]
        }
      };

      const wrapper = mount(
        <MockedProvider mocks={[errorQuery]} addTypename={false}>
          <ProjectInviteSuccessPage />
        </MockedProvider>
      );

      await act(async () => {
        await wait(0);
      });

      expect(wrapper.contains(<ErrorLayout />));
    });

    it("should render an auth form if user is not authenticated", async () => {
      const wrapper = mount(
        <MockedProvider mocks={[validateLinkQuery]} addTypename={false}>
          <ProjectInviteSuccessPage />
        </MockedProvider>
      );

      await act(async () => {
        await wait(0);
      });

      expect(
        wrapper.contains(
          <AnonLayout handleSignup={() => null} handleLogin={() => null} />
        )
      );
    });
  });
});
