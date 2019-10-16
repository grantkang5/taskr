import * as React from "react";
import { render, mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { MockedProvider, wait } from "@apollo/react-testing";
import Login from "../../pages/login";
import { LoginDocument } from "../../generated/graphql";

describe("Pages", () => {
  describe("Login", () => {
    let loginMutationCalled = false;
    const mockUser = { email: 'qwjwlqqwrq@email.com', password: 'asdaskdjasldjal' }
    const mocks = [
      {
        request: {
          query: LoginDocument,
          variables: {
            email: mockUser.email,
            password: mockUser.password
          }
        },
        result: () => {
          loginMutationCalled = true;
          return {
            data: {
              login: { accessToken: "" }
            }
          };
        }
      }
    ];

    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({ route: '/login' }))

    it("fires a mutation on clicking the submit button", async () => {
      const wrapper = mount(
        <MockedProvider mocks={mocks} addTypename={false}>
          <Login />
        </MockedProvider>
      );
      await act(async () => {
        wrapper.find('input[type="text"]').simulate('change', { target: { name: 'email', value: mockUser.email } })
        wrapper.find('input[type="password"]').simulate('change', { target: { name: 'password', value: mockUser.password } })
        wrapper.find("form").simulate("submit");
        await wait(0);
      });

      expect(loginMutationCalled).toBe(true);
    });
  });
});
