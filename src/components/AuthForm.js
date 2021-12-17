import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "@firebase/auth";
import { authService } from "fbase";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const AuthForm = ({ newAccount }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;

    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  // 로그인, 회원가입 클릭 이벤트
  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      let data;
      if (newAccount) {
        //회원가입
        data = await createUserWithEmailAndPassword(
          authService,
          email,
          password
        );
      } else {
        //로그인
        data = await signInWithEmailAndPassword(authService, email, password);
      }
    } catch (error) {
      let koError = "";
      if (error.code === "auth/weak-password") {
        koError = "비밀번호는 6자 이상이어야 합니다.";
      } else if (error.code === "auth/email-already-in-use") {
        koError = "이미 사용 중인 이메일 주소입니다.";
      } else if (error.code === "auth/user-not-found") {
        koError = "존재하지 않는 계정 정보입니다.";
      } else if (error.code === "auth/wrong-password") {
        koError = "올바른 비밀번호를 입력해 주세요.";
      } else if (error.code === "auth/invalid-email") {
        koError = "올바른 이메을을 입력해 주세요.";
      } else if (error.code === "auth/internal-error") {
        koError = "올바른 이메을과 비밀번호를 입력해 주세요.";
      }
      setError(koError);
    }
  };

  return (
    <>
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" },
        }}
        // noValidate
        // autoComplete="off"
        onSubmit={onSubmit}
        className="auth-form"
      >
        <div className="auth-Input">
          <TextField
            id="outlined-basic"
            label="Email"
            variant="outlined"
            name="email"
            type="email"
            required
            value={email}
            onChange={onChange}
            className="auth-input-inner"
          />
          <TextField
            id="outlined-basic"
            label="Password"
            variant="outlined"
            name="password"
            type="password"
            required
            value={password}
            onChange={onChange}
            className="auth-input-inner"
          />
        </div>
        <Button
          variant="contained"
          disableElevation
          type="submit"
          className="auth-Submit"
        >
          {newAccount ? "회원가입" : "로그인"}
        </Button>
      </Box>
      {error && <span className="auth-error">{error}</span>}
    </>
  );
};

export default AuthForm;
