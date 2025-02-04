import React from "react";
import "./Login.css";
import { Button } from "@mui/material";
import { auth, provider } from "./firebase";
import { signInWithPopup } from "firebase/auth";
import { useStateValue } from "./StateProvider";
import { actionTypes } from "./reducer";
import logo from "./img/logo.svg";

const Login = () => {
  // eslint-disable-next-line no-unused-vars
  const [{ user }, dispatch] = useStateValue();

  const signIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        dispatch({
          type: actionTypes.SET_USER,
          user: result.user,
        });
      }) // Handle successful sign-in
      .catch((error) => alert(error.message)); // Handle errors
  };
  return (
    <div className="login">
      <div className="login__container">
        <img src={logo} height="700px" alt="" />
        <div className="login__text">
          <h2>Sign into ChatApp</h2>
        </div>
        <Button type="submit" onClick={signIn}>
          Sign In With Google
        </Button>
      </div>
    </div>
  );
};

export default Login;
