import * as React from "react";
import { render, mount } from "enzyme";
import { MockedProvider, wait } from "@apollo/react-testing";
import { MeDocument } from "../../generated/graphql";
import { Header } from "../../components/common/Header";
import AnonHeader from "../../components/common/Header/AnonHeader";
import { act } from "react-dom/test-utils";

describe("Component", () => {
  describe("Header", () => {
    const mocks = [
      {
        request: {
          query: MeDocument
        },
        result: {
          data: {
            me: { id: 1, email: "example@email.com" }
          }
        }
      }
    ];

    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      route: '/',
      query: {
        returnUrl: ''
      }
    }))

    it("should render AnonHeader if user is not authenticated", async () => {
      const wrapper = mount(
        <MockedProvider mocks={[]}>
          <Header />
        </MockedProvider>
      );

      await act(async () => {
        await wait(0)
      })

      expect(wrapper.find(AnonHeader).length).toEqual(1);
    });

    it("should render without error", () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <Header />
        </MockedProvider>
      );
    });
  });
});
