import * as React from "react";
import { render, mount } from "enzyme";
import { MockedProvider, wait } from "@apollo/react-testing";
import {
  AcceptTeamInviteLinkDocument,
  MeDocument
} from "../../../../generated/graphql";
import TeamInviteSuccessPage from "../../../../pages/invite/team/success";
import { act } from "react-dom/test-utils";

describe("Pages", () => {
  describe("TeamInviteSuccessPage", () => {
    const mockQuery = {
      id: 1,
      email: "dev@email.com",
      username: "dev",
      teamInviteLink: "abc"
    };
    const useRouter = jest.spyOn(require("next/router"), "useRouter");
    useRouter.mockImplementation(() => ({
      route: "/email-verification/success",
      query: {
        email: mockQuery.email,
        id: mockQuery.teamInviteLink
      },
      // tslint:disable-next-line: no-empty
      push: () => {}
    }));

    it("fires acceptTeamInvite mutation on mount", async () => {
      let acceptTeamInviteLinkCalled = false;
      const mocks = [
        {
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
        },
        {
          request: {
            query: AcceptTeamInviteLinkDocument,
            variables: {
              email: mockQuery.email,
              teamInviteLink: mockQuery.teamInviteLink
            }
          },
          result: () => {
            acceptTeamInviteLinkCalled = true;
            return {
              data: {
                acceptTeamInviteLink: mockQuery.teamInviteLink
              }
            };
          }
        }
      ];
      const wrapper = mount(
        <MockedProvider mocks={mocks} addTypename={false}>
          <TeamInviteSuccessPage />
        </MockedProvider>
      );

      await act(async () => {
        await wait(10);
      });

      expect(acceptTeamInviteLinkCalled).toBe(true);
      wrapper.unmount();
    });

    it("should render an auth form if user is not authenticated", async () => {
      const wrapper = mount(
        <MockedProvider mocks={[]}>
          <TeamInviteSuccessPage />
        </MockedProvider>
      );

      await act(async () => {
        await wait(0);
      });

      expect(wrapper.contains(<button>Sign up</button>));
    });
  });
});
