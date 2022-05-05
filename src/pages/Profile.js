import { updateProfile } from "@firebase/auth";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "@firebase/firestore";
import { authService, dbService } from "fbase";
import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router";
import MyChatTable from "components/MyChatTable";
import MyScdTable from "components/MyScdTable";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 350,
  maxWidth: 500,
  wordBreak: "break-all",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const Profile = ({ userObj, refreshUser, containerStyle }) => {
  // const navigate = useNavigate();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName); // 신규 닉네임
  const [myChat, setMyChat] = useState([]); // 내가 쓴 글
  const [mySchedule, setMySchedule] = useState([]); // 내 일정

  // 로그아웃
  // const onLogOutClick = () => {
  //   authService.signOut();
  //   navigate("/");
  // };

  // 내가 쓴 메시지 가져와서 setMyChat 담기
  useEffect(async () => {
    const q = query(
      collection(dbService, "chats"),
      where("creatorId", "==", userObj.uid),
      orderBy("createdAt", "desc")
    );
    const qs = query(
      collection(dbService, "scheduler"),
      where("creatorId", "==", userObj.uid),
      orderBy("createdAt", "desc")
    );

    await onSnapshot(q, (querySnapshot) => {
      const chatArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMyChat(chatArray);
    });
    await onSnapshot(qs, (querySnapshot) => {
      const scheduleArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMySchedule(scheduleArray);
    });
  }, []);

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  // 닉네임 수정 클릭 이벤트
  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(authService.currentUser, {
        displayName: newDisplayName,
      });
      refreshUser();
      alert("닉네임이 변경되었습니다.");
    }
  };

  return (
    <div style={containerStyle}>
      <h2>닉네임 변경</h2>
      <Stack
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={onSubmit}
        className="profile-nickname"
      >
        <TextField
          hiddenLabel
          id="filled-hidden-label-normal"
          type="text"
          defaultValue={newDisplayName}
          variant="filled"
          onChange={onChange}
          inputProps={{ maxLength: 20 }}
        />
        <Button type="submit" variant="contained">
          변경
        </Button>
      </Stack>
      {/* <button onClick={onLogOutClick}>로그아웃</button> */}

      <div className="profile-myChat">
        <h2>나의 채팅</h2>
        <div>
          <MyChatTable chatObj={myChat} style={style} />
        </div>
      </div>

      <div className="profile-mySchedule">
        <h2>나의 일정</h2>
        <div>
          <MyScdTable scdObj={mySchedule} style={style} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
