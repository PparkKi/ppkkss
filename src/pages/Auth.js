import React, { useState } from "react";
import AuthForm from "components/AuthForm";
import { authService, googleProvider, facebookProvider } from "fbase";
import { signInWithPopup } from "firebase/auth";
import Button from "@mui/material/Button";
import introImg from "images/intro_img.png";
import Switch from "@mui/material/Switch";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useMediaQuery } from "react-responsive";

// 메인 팝업 style
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 350,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Auth = () => {
  const [newAccount, setNewAccount] = useState(false);
  const [open, setOpen] = useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

  // 모바일 사이즈일 경우 css 변경
  const isMobile = useMediaQuery({
    query: "(max-width:540px)",
  });
  const isMobileStyle = isMobile ? "m-auth-wrap" : "";

  return (
    <>
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-description">
              우측 하단 버튼 클릭 시 회원가입이 가능하며 테스트 계정을 사용하셔도 됩니다!<br /><br />
              id : t1@t1.com<br />
              pw : asd123
            </Typography>
          </Box>
        </Modal>
      </div>
      
      <div id="auth-wrap" className={isMobileStyle}>
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

            <Switch
              {...label}
              onClick={toggleAccount}
              className="auth-toggle"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
