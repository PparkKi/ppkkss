import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { addDoc, collection } from "firebase/firestore";
import { dbService } from "fbase";

const MainOffer = () => {
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [desc, setDesc] = useState("");

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;

    if (name === "company") {
      setCompany(value);
    } else if (name === "phone") {
      setPhone(value);
    } else if (name === "desc") {
      setDesc(value);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (company === "" || phone === "" || desc === "") {
      alert("모든 내용을 입력해 주세요");
      return;
    }

    let date = new Date();
    let year = date.getFullYear();
    let month = ("0" + (1 + date.getMonth())).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);
    let hours = ("0" + date.getHours()).slice(-2);
    let minutes = ("0" + date.getMinutes()).slice(-2);

    const offer = {
      company,
      phone,
      desc,
      createdAt: `${year}-${month}-${day}-${hours}:${minutes}`,
    };
    await addDoc(collection(dbService, "offers"), offer).then(
      alert(
        "면접 제안이 성공적으로 이루어졌습니다.\n제안해 주셔서 감사드리며 빠른 시일 내에 연락드리도록 하겠습니다!"
      )
    );
    setCompany("");
    setPhone("");
    setDesc("");
  };

  return (
    <>
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1 },
        }}
        noValidate
        autoComplete="off"
        onSubmit={onSubmit}
        id="mainOffer-form"
      >
        <TextField
          id="standard-basic"
          label="회사명"
          variant="standard"
          onChange={onChange}
          name="company"
          value={company}
        />
        <TextField
          id="standard-basic"
          label="전화번호"
          variant="standard"
          onChange={onChange}
          name="phone"
          type="number"
          value={phone}
        />
        <TextField
          id="outlined-multiline-static"
          label="내용"
          multiline
          rows={3}
          style={{ display: "flex" }}
          onChange={onChange}
          name="desc"
          value={desc}
        />
        <Button variant="contained" type="submit">
          제안하기
        </Button>
      </Box>
    </>
  );
};

export default MainOffer;
