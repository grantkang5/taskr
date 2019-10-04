import React, { useState } from "react";
import { useRegisterMutation } from "../generated/graphql";
import { RouteComponentProps } from "react-router-dom";

const Register: React.FC<RouteComponentProps> = ({ history }) => {
  const [email, handleEmail] = useState("");
  const [password, handlePassword] = useState("");
  const [register] = useRegisterMutation();

  return (
    <form
      onSubmit={async e => {
        e.preventDefault();
        console.log(email, password);
        try {
          await register({
            variables: {
              email,
              password
            }
          });
          history.push('/')
        } catch (err) {
          console.log(err)
        }
      }}
    >
      <input
        value={email}
        placeholder="test@email.com"
        autoComplete='off'
        onChange={e => handleEmail(e.target.value)}
      />
      <input
        value={password}
        autoComplete='off'
        type="password"
        placeholder="password"
        onChange={e => handlePassword(e.target.value)}
      />
      <button type="submit">register</button>
    </form>
  );
};

export default Register;
