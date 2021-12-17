import { addDoc, collection } from "@firebase/firestore";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { dbService, storageService } from "fbase";
import React, { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";

const ChatForm = ({ userObj }) => {
  const [message, setMessage] = useState(""); // 메시지
  const [file, setFile] = useState(""); // 파일 업로드
  const [favCount, setFavCount] = useState(0); // 채팅 좋아요 개수

  // 메시지 및 (이미지)파일 추가
  const onSubmit = async (event) => {
    event.preventDefault();
    let fileUrl = "";
    if (file !== "") {
      const fileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(fileRef, file, "data_url");
      fileUrl = await getDownloadURL(fileRef);
    }
    const chat = {
      message,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      favCount,
      fileUrl,
      user_nickName: userObj.displayName,
    };

    if (message === "" && file === "") {
      alert("메시지를 입력해 주세요");
    }

    if (file || message) {
      await addDoc(collection(dbService, "chats"), chat);
      setMessage("");
      setFile("");
      fileInput.current.value = null;
    }
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setMessage(value);
  };

  // (이미지) 파일 업로드
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;

    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;

      setFile(result);
    };
    reader.readAsDataURL(theFile);
  };

  // (이미지) 파일 삭제 후 처리
  const fileInput = useRef();
  const onClearPhotoClick = () => {
    setFile("");
    fileInput.current.value = null;
  };

  return (
    <>
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" },
        }}
        // noValidate
        autoComplete="off"
        onSubmit={onSubmit}
        className="chat-Form"
      >
        <label className="chatForm-fileSet" htmlFor="chatForm-file">
          <PhotoCameraIcon fontSize="large" />
        </label>
        <input
          id="chatForm-file"
          type="file"
          accept="image/*"
          ref={fileInput}
          onChange={onFileChange}
        />
        {file && (
          <div className="chatForm-img">
            <img src={file} alt="" />
            <DeleteIcon onClick={onClearPhotoClick} fontSize="large" />
          </div>
        )}
        <TextField
          id="outlined-multiline-static"
          label="send message"
          multiline
          rows={3}
          value={message}
          onChange={onChange}
          type="text"
          inputProps={{ maxLength: 200 }}
          className="chatForm-field"
        />
        <Button
          variant="outlined"
          disableElevation
          type="submit"
          className="chatForm-submit"
        >
          전송
        </Button>
      </Box>
    </>
  );
};

export default ChatForm;
