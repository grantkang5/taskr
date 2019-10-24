import * as React from "react";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { MockedProvider, wait } from "@apollo/react-testing";
import { ResendVerificationLinkDocument } from "../../../generated/graphql";
import EmailVerificationPage from "../../../pages/email-verification";

describe("Pages", () => {
  describe("EmailVerificationPage", () => {
    let resendVerificationLinkCalled = false;
    const mockQuery = { email: "qwjwlqqwrq@email.com", verificationLink: 'abc' };
    const mocks = [
      {
        request: {
          query: ResendVerificationLinkDocument,
          variables: {
            email: mockQuery.email
          }
        },
        result: () => {
          resendVerificationLinkCalled = true;
          return {
            data: {
              resendVerificationLink: mockQuery.verificationLink
            }
          };
        }
      }
    ];

    const useRouter = jest.spyOn(require("next/router"), "useRouter");
    useRouter.mockImplementation(() => ({
      route: "/email-verification",
      query: { email: mockQuery.email, verificationLink: mockQuery.verificationLink }
    }));

    it("fires resendVerificationLink mutation on clicking resend link", async () => {
      const wrapper = mount(
        <MockedProvider mocks={mocks} addTypename={false}>
          <EmailVerificationPage />
        </MockedProvider>
      );
      await act(async () => {
        wrapper.find(`button[type="button"]`).simulate("click");
        await wait(0);
      });

      expect(resendVerificationLinkCalled).toBe(true);
    });
  });
});
