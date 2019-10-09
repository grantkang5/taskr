import * as React from "react";
import { mount, render } from "enzyme";
import Home from "../pages";
import { MockedProvider } from '@apollo/react-testing';
import { MeDocument } from "../generated/graphql";
import Layout from "../components/Layout";

describe("Pages", () => {
  describe("Home", () => {
    const mocks = [
      {
        request: {
          query: MeDocument
        },
        result: {
          data: {
            me: { id: 1, email: 'example@email.com' }
          }
        }
      }
    ]

    it("renders without error", () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <Home />
        </MockedProvider>
      )
    });

    it("should render an empty div in <Layout /> during load/error", () => {
      render(
        <MockedProvider mocks={[]}>
          <Layout>
            <div />
          </Layout>
        </MockedProvider>
      )
    })
  });
});
