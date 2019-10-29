import * as React from "react";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { MockedProvider, wait } from "@apollo/react-testing";
import { ForgotPasswordDocument } from "../../../generated/graphql";
import ForgotPasswordSuccessPage from "../../../pages/forgot-password/success";

describe("Pages", () => {
  describe("ForgotPasswordSuccessPage", () => {
    let forgotPasswordCalled = false;
    const mockQuery = {
      email: "qjwrwqr@email.com",
      id: "qwewqrwqrq",
      password: "password"
    };
    const mocks = [
      {
        request: {
          query: ForgotPasswordDocument,
          variables: {
            email: mockQuery.email,
            forgotPasswordLink: mockQuery.id,
            password: mockQuery.password
          }
        },
        result: () => {
          forgotPasswordCalled = true;
          return {
            data: {
              forgotPassword: true
            }
          };
        }
      }
    ];

    const useRouter = jest.spyOn(require("next/router"), "useRouter");
    useRouter.mockImplementation(() => ({
      route: "/forgot-password/success",
      query: { email: mockQuery.email, id: mockQuery.id },
      push: () => null
    }));

    it("fires forgotPassword mutation on submit button", async () => {
      const wrapper = mount(
        <MockedProvider mocks={mocks} addTypename={false}>
          <ForgotPasswordSuccessPage />
        </MockedProvider>
      );

      await act(async () => {
        wrapper
          .find(`input#forgotPasswordSuccess_password`)
          .simulate("change", {
            target: { name: "password", value: mockQuery.password }
          });
        wrapper
          .find(`input#forgotPasswordSuccess_confirmPassword`)
          .simulate("change", {
            target: { name: "confirmPassword", value: mockQuery.password }
          });
        wrapper.find("form").simulate("submit");
        await wait(0);
      });

      expect(forgotPasswordCalled).toBe(true);
    });
  });
});
