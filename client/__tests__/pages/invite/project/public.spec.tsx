import * as React from "react";
import { mount } from "enzyme";
import { MockedProvider, wait } from "@apollo/react-testing";
import {
  MeDocument,
  ValidatePublicProjectLinkDocument,
  AcceptPublicProjectLinkDocument
} from "../../../../generated/graphql";
import PublicProjectInvitePage from "../../../../pages/invite/project/public";
import { act } from "react-dom/test-utils";
import { GraphQLError } from "graphql";
import ErrorLayout from "../../../../components/layouts/ErrorLayout";
import AnonLayout from "../../../../components/layouts/AnonLayout";

describe("Pages", () => {
  describe("PublicProjectInvitePage", () => {
    const mockQuery = {
      email: "dev@email.com",
      id: 123,
      projectId: 1241,
      projectInviteLink: "abc",
      username: "dev"
    };

    const useRouter = jest.spyOn(require("next/router"), "useRouter");
    useRouter.mockImplementation(() => ({
      route: "/invite/project/public",
      query: {
        id: mockQuery.projectInviteLink,
        project: mockQuery.projectId
      },
      // tslint:disable-next-line: no-empty
      push: () => {}
    }));
    let acceptProjectLinkCalled = false;
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

    const validateQuery = {
      request: {
        query: ValidatePublicProjectLinkDocument,
        variables: {
          projectId: mockQuery.projectId,
          link: mockQuery.projectInviteLink
        }
      },
      result: {
        data: {
          validatePublicProjectLink: true
        }
      }
    };

    const acceptProjectLinkQuery = {
      request: {
        query: AcceptPublicProjectLinkDocument,
        variables: {
          link: mockQuery.projectInviteLink,
          projectId: mockQuery.projectId
        }
      },
      result: () => {
        acceptProjectLinkCalled = true;
        return {
          data: {
            acceptPublicProjectLink: true
          }
        }
      }
    }

    it("fires acceptPublicProjectLink mutation on mount", async () => {
      const wrapper = mount(
        <MockedProvider
          mocks={[meQuery, validateQuery, acceptProjectLinkQuery]}
          addTypename={false}
        >
          <PublicProjectInvitePage />
        </MockedProvider>
      )

      await act(async () => {
        await wait(10);
      });

      expect(acceptProjectLinkCalled).toBe(true);
      wrapper.unmount();
    })

    it("should render an error layout if the link has expired", async () => {
      const errorQuery = {
        ...validateQuery,
        result: {
          errors: [new GraphQLError(`This link has expired`)]
        }
      };

      const wrapper = mount(
        <MockedProvider mocks={[errorQuery]} addTypename={false}>
          <PublicProjectInvitePage />
        </MockedProvider>
      );

      await act(async () => {
        await wait(0);
      });

      expect(wrapper.contains(<ErrorLayout />));
    });

    it("should render an auth form if user is not authenticated", async () => {
      const wrapper = mount(
        <MockedProvider mocks={[validateQuery]} addTypename={false}>
          <PublicProjectInvitePage />
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
