import * as React from "react";
import { render, mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { MockedProvider, wait } from "@apollo/react-testing";
import Register from "../../pages/register";
import { SendVerificationLinkDocument } from "../../generated/graphql";

describe("Pages", () => {
  describe("Login", () => {
    let registerMutationCalled = false;
    const mockUser = { email: 'qwjwlqqwrq@email.com', password: 'asdaskdjasldjal' }
    const mocks = [
      {
        request: {
          query: SendVerificationLinkDocument,
          variables: {
            email: mockUser.email,
            password: mockUser.password
          }
        },
        result: () => {
          registerMutationCalled = true;
          return {
            data: {
              sendVerificationLink: "abc"
            }
          };
        }
      }
    ];

    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({ route: '/register' }))

    it("fires sendVerificationLink mutation on clicking the submit button", async () => {
      const wrapper = mount(
        <MockedProvider mocks={mocks} addTypename={false}>
          <Register />
        </MockedProvider>
      );
      await act(async () => {
        wrapper.find('input[type="text"]').simulate('change', { target: { name: 'email', value: mockUser.email } })
        wrapper.find('input#register_password').simulate('change', { target: { name: 'password', value: mockUser.password } })
        wrapper.find('input#register_confirmPassword').simulate('change', { target: { name: 'confirmPassword', value: mockUser.password } })
        wrapper.find("form").simulate("submit");
        await wait(0);
      });

      expect(registerMutationCalled).toBe(true);
    });
  });
});
