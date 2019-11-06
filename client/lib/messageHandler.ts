import { ApolloError } from "apollo-client";
import { message } from "antd";

interface MessageProps {
  message?: string;
  duration?: number;
}

/**
 *
 * @param err - ApolloError, error thrown from GraphQL Rresponse
 * @param messageOpts: { message?: string, duration?: number }
 */

export const errorMessage = (err: ApolloError, messageOpts?: MessageProps) => {
  err.graphQLErrors
    ? message.error(
        (messageOpts && messageOpts.message) || err.graphQLErrors[0].message,
        (messageOpts && messageOpts.duration) || 2
      )
    : message.error(
        "An unknown error has occurred",
        (messageOpts && messageOpts.duration) || 2
      );
};
