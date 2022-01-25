import React, { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { addDoc, collection } from "@firebase/firestore";
import { dbService } from "fbase";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

const NoticeForm = ({ userObj, noticeStyle, admin }) => {
  const [open, setOpen] = useState(false); // 공지 작성 폼
  const handleOpen = () => setOpen(true); // 공지 작성 폼 활성화
  const handleClose = () => setOpen(false); // 공지 작성 폼 비활성화
  const [nftitle, setNftitle] = useState(""); // 공지 제목
  const [nfdesc, setNfdesc] = useState(""); // 공지 내용
  const [nfType, setNfType] = useState(""); // 공지 타입 (공지, 이벤트)

  // 공지 제목, 내용 셋팅
  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;

    if (name === "title") {
      setNftitle(value);
    } else if (name === "desc") {
      setNfdesc(value);
    }
  };

  // 공지 등록
  const onSubmit = async (event) => {
    event.preventDefault();

    if (nfType == "") {
      alert("게시글 유형을 선택해주세요.");
      return;
    }

    let date = new Date();
    let year = date.getFullYear();
    let month = ("0" + (1 + date.getMonth())).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);
    let hours = ("0" + date.getHours()).slice(-2);
    let minutes = ("0" + date.getMinutes()).slice(-2);

    const noticeInfo = {
      no: year + month + day + hours + minutes,
      title: `[${nfType}] ${nftitle}`,
      desc: nfdesc,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      creatorNickName: userObj.displayName,
      viewCount: 0,
      type: nfType,
    };

    await addDoc(collection(dbService, "notices"), noticeInfo);
    handleClose();
  };

  // 공지, 이벤트 타입
  const onChangeRadio = (e) => {
    setNfType(e.target.value);
  };

  return (
    <div>
      {admin && <button onClick={handleOpen}>클릭</button>}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box component="form" onSubmit={onSubmit} sx={noticeStyle}>
          <TextField
            id="standard-basic"
            label="제목"
            variant="standard"
            type="text"
            name="title"
            onChange={onChange}
            fullWidth={true}
            inputProps={{ maxLength: 100 }}
          />
          <br />
          <br />
          <TextField
            id="outlined-multiline-static"
            label="내용"
            multiline
            rows={4}
            type="text"
            name="desc"
            onChange={onChange}
            fullWidth={true}
            inputProps={{ maxLength: 500 }}
          />
          <br />
          <br />
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="female"
              name="radio-buttons-group"
              row
            >
              <FormControlLabel
                value="공지"
                control={<Radio />}
                label="공지"
                onChange={onChangeRadio}
              />
              <FormControlLabel
                value="이벤트"
                control={<Radio />}
                label="이벤트"
                onChange={onChangeRadio}
              />
            </RadioGroup>
          </FormControl>
          <input type="submit" value="게시" />
        </Box>
      </Modal>
    </div>
  );
};

export default NoticeForm;
