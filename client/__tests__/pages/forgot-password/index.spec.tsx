import * as React from "react";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { MockedProvider, wait } from "@apollo/react-testing";
import { SendForgotPasswordLinkDocument } from "../../../generated/graphql";
import ForgotPasswordPage from "../../../pages/forgot-password";

describe("Pages", () => {
  describe("ForgotPasswordPage", () => {
    let sendForgotPasswordLinkCalled = false;
    const mockQuery = {
      email: "qjwrwqr@email.com"
    };
    const mocks = [
      {
        request: {
          query: SendForgotPasswordLinkDocument,
          variables: {
            email: mockQuery.email
          }
        },
        result: () => {
          sendForgotPasswordLinkCalled = true;
          return {
            data: {
              sendForgotPasswordLink: "asdasda"
            }
          };
        }
      }
    ];

    const useRouter = jest.spyOn(require("next/router"), "useRouter");
    useRouter.mockImplementation(() => ({
      route: "/forgot-password",
      push: () => null
    }));

    it("fires sendForgotPasswordLink mutation on submit button", async () => {
      const wrapper = mount(
        <MockedProvider mocks={mocks} addTypename={false}>
          <ForgotPasswordPage />
        </MockedProvider>
      );

      await act(async () => {
        wrapper
          .find(`input[type="text"]`)
          .simulate("change", {
            target: { name: "email", value: mockQuery.email }
          });
        wrapper.find("form").simulate("submit");
        await wait(0);
      });

      expect(sendForgotPasswordLinkCalled).toBe(true);
    });
  });
});
