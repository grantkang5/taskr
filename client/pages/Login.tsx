import React, { useState } from "react";
import { useLoginMutation } from "../generated/graphql";
import Router from 'next/router';
import { setAccessToken } from "../lib/accessToken";
import Layout from "../components/Layout";

const Login: React.FC = () => {
  const [email, handleEmail] = useState("");
  const [password, handlePassword] = useState("");
  const [login] = useLoginMutation();

  return (
    <Layout>
      <form
        onSubmit={async e => {
          e.preventDefault();
          console.log(email, password);
          try {
            const response = await login({
              variables: {
                email,
                password
              }
            });
            if (response && response.data) {
              setAccessToken(response.data.login.accessToken);
            }
            Router.push("/")
          } catch (err) {
            console.log(err);
          }
        }}
      >
        <input
          value={email}
          placeholder="test@email.com"
          onChange={e => handleEmail(e.target.value)}
        />
        <input
          value={password}
          type="password"
          placeholder="password"
          onChange={e => handlePassword(e.target.value)}
        />
        <button type="submit">login</button>
      </form>
    </Layout>
  );
};

export default Login;
