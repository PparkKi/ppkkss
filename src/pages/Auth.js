import React, { useState } from "react";
import AuthForm from "components/AuthForm";
import { authService, googleProvider, facebookProvider } from "fbase";
import { signInWithPopup } from "firebase/auth";
import Button from "@mui/material/Button";
import introImg from "images/intro_img.png";
import Switch from "@mui/material/Switch";

const Auth = () => {
  const [newAccount, setNewAccount] = useState(false);

  // 구글, 페이스북 소셜 로그인
  const onSocialClick = async (event) => {
    const {
      target: { name },
    } = event;

    let provider;
    if (name === "google") {
      provider = googleProvider;
    } else if (name === "facebook") {
      provider = facebookProvider;
    }
    await signInWithPopup(authService, provider);
  };

  // 로그인할지 회원가입할지 버튼 체인지
  const toggleAccount = () => {
    setNewAccount((prev) => !prev);
  };

  // 로그인인지 회원가입인지 체크
  const label = { inputProps: { "aria-label": "Switch demo" } };

  return (
    <div id="auth-wrap">
      <img src={introImg} alt="" className="auth-img" />
      <div className="auth-container">
        <AuthForm newAccount={newAccount} />
        <div className="auth-social">
          <Button
            variant="outlined"
            onClick={onSocialClick}
            name="google"
            className="auth-social-button"
          >
            google 로그인
          </Button>
          <Button
            variant="outlined"
            onClick={onSocialClick}
            name="facebook"
            className="auth-social-button"
          >
            facebook 로그인
          </Button>

          <Switch {...label} onClick={toggleAccount} className="auth-toggle" />
        </div>
      </div>
    </div>
  );
};

export default Auth;
