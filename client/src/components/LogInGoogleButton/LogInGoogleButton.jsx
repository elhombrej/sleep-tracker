import React from "react";
import GoogleLogin from "react-google-login";
import { useDispatch } from "react-redux";
import { logInUserWithGoogle } from "../../actions/index";
import AlertDialog from "../Alert/Alert";
import styles from "./GoogleLogin.module.css";

export default function LogInGoogleButton() {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  let [input, setInput] = React.useState({ email: "" });
  const handleClose = () => {
    setOpen(false);
  };
  const onSuccess = (response) => {
    setInput({ email: response.profileObj.email });
    dispatch(logInUserWithGoogle(response, setOpen));
  };
  const onFailure = (response) => {
    console.log("login failed res:", response);
  };

  return (
    <div>
      <AlertDialog open={open} handleClose={handleClose} input={input} />
      <GoogleLogin
        className={styles.button}
        clientId={clientId}
        buttonText="Inicia sesión con Google"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={"single_host_origin"}
        isSignedIn={false}
      />
    </div>
  );
}
