import React, { useState } from "react";
import { useRegisterMutation } from "../generated/graphql";
import Router from "next/router";
import Layout from "../components/Layout";

const Register: React.FC = () => {
  const [email, handleEmail] = useState("");
  const [password, handlePassword] = useState("");
  const [register] = useRegisterMutation();

  return (
    <Layout>
      <form
        onSubmit={async e => {
          e.preventDefault();

          try {
            await register({
              variables: {
                email,
                password
              }
            });
            Router.push("/");
          } catch (err) {
            console.log(err);
          }
        }}
      >
        <input
          value={email}
          placeholder="test@email.com"
          autoComplete="off"
          onChange={e => handleEmail(e.target.value)}
        />
        <input
          value={password}
          autoComplete="off"
          type="password"
          placeholder="password"
          onChange={e => handlePassword(e.target.value)}
        />
        <button type="submit">register</button>
      </form>
    </Layout>
  );
};

export default Register;
