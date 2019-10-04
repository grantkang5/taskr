import React, { useState } from "react";
import { useLoginMutation } from "../generated/graphql";
import { RouteComponentProps } from "react-router-dom";
import { setAccessToken } from "../auth/accessToken";

const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const [email, handleEmail] = useState("");
  const [password, handlePassword] = useState("");
  const [login] = useLoginMutation();

  const handleGoogleLogin = () => {
    fetch('http://localhost:4000/google_oauth', {
      method: 'POST',
      credentials: 'include'
    }).then(async (res) => {
      const { redirectURL } = await res.json()
      window.location = redirectURL
    })
  }

  return (
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
            setAccessToken(response.data.login.accessToken)
          }
          history.push('/')
        } catch (err) {
          console.log(err)
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
      <p>or</p>
      <button type="button" onClick={handleGoogleLogin}>Login with Google</button>
    </form>
  );
};

export default Login;
