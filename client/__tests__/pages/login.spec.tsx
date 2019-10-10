import * as React from "react";
import { render, mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { MockedProvider, wait } from "@apollo/react-testing";
import Login from "../../pages/login";
import { LoginDocument } from "../../generated/graphql";

describe("Pages", () => {
  describe("Login", () => {
    let loginMutationCalled = false;
    const mocks = [
      {
        request: {
          query: LoginDocument,
          variables: {
            password: "",
            email: ""
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

    it("renders without error", async () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <Login />
        </MockedProvider>
      );
    });

    it("fires a mutation on clicking the submit button", async () => {
      const wrapper = mount(
        <MockedProvider mocks={mocks} addTypename={false}>
          <Login />
        </MockedProvider>
      );
      await act(async () => {
        wrapper.find("form").simulate("submit");
        await wait(0);
      });

      expect(loginMutationCalled).toBe(true);
    });
  });
});
