import {
  deleteDoc,
  doc,
  updateDoc,
  collection,
  query,
  where,
  addDoc,
  getDocs,
} from "@firebase/firestore";
import { deleteObject, ref } from "@firebase/storage";
import { dbService, storageService } from "fbase";
import React from "react";
import { useState } from "react/cjs/react.development";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const Chat = ({ chatObj, isUser, userObj }) => {
  const [editing, setEditing] = useState(false); // 수정 상태
  const [edit, setEdit] = useState(chatObj.message); // 수정 메시지
  const [favOnOff, setFavOnOff] = useState(false); // 채팅 좋아요
  const [onOff, setOnOff] = useState(false); // 채팅 좋아요

  // 메시지 삭제 클릭 이벤트
  const onDeleteClick = async () => {
    const ok = window.confirm("삭제하시겠습니까?");
    if (ok) {
      //delete
      await deleteDoc(doc(dbService, `chats/${chatObj.id}`));
      if (chatObj.fileUrl !== "") {
        await deleteObject(ref(storageService, chatObj.fileUrl));
      }
    }
  };

  // 수정 상태 토글 버튼
  const toggleEditing = () => setEditing((prev) => !prev);

  // 수정 완료 버튼 클릭 이벤트
  const onSubmit = async (event) => {
    event.preventDefault();
    await updateDoc(doc(dbService, `chats/${chatObj.id}`), {
      message: edit,
    });
    setEditing(false);
  };

  // 메시지 내용 수정
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setEdit(value);
  };

  // 좋아요 클릭
  const onfavClick = async () => {
    const favObj = {
      user_id: userObj.uid,
      cont_id: chatObj.id,
    };

    const q = query(
      collection(dbService, "fav_whether"),
      where("user_id", "==", userObj.uid),
      where("cont_id", "==", chatObj.id)
    );
    const querySnapshot = await getDocs(q);

    let favId;
    querySnapshot.docs.map((doc) => {
      favId = doc.id;
    });

    if (querySnapshot.size === 1) {
      await deleteDoc(doc(dbService, `fav_whether/${favId}`));
      await updateDoc(doc(dbService, `chats/${chatObj.id}`), {
        favCount: chatObj.favCount - 1,
      });
      setFavOnOff(false);
      setOnOff(false);
    } else if (querySnapshot.size === 0) {
      await addDoc(collection(dbService, "fav_whether"), favObj);
      await updateDoc(doc(dbService, `chats/${chatObj.id}`), {
        favCount: chatObj.favCount + 1,
      });
      setFavOnOff(true);
    }
  };

  return (
    <div className={isUser ? "chat-item chat-my" : "chat-item"}>
      {editing ? (
        <>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={onSubmit}
            className="chat-edit-form"
          >
            <TextField
              id="outlined-multiline-static"
              label="edit message"
              multiline
              rows={3}
              onChange={onChange}
              value={edit}
              required
              inputProps={{ maxLength: 200 }}
            />
            <div className="chat-edit-form-button">
              <Button type="submit" variant="contained">
                수정
              </Button>
              <Button onClick={toggleEditing} variant="contained">
                취소
              </Button>
            </div>
          </Box>
        </>
      ) : (
        <>
          <h4 className="chat-userName">{chatObj.user_nickName}</h4>
          {chatObj.fileUrl && (
            <img src={chatObj.fileUrl} alt="" className="chat-img" />
          )}
          <h4>{chatObj.message}</h4>
          <div className="chat-info">
            <span>{new Date(chatObj.createdAt).toLocaleDateString()}</span>
            <div className="chat-fav">
              {!favOnOff && !onOff ? (
                <FavoriteIcon
                  style={{ color: "gray" }}
                  onClick={onfavClick}
                  className="chat-favIcon"
                />
              ) : (
                <FavoriteIcon
                  style={{ color: "red" }}
                  onClick={onfavClick}
                  className="chat-favIcon"
                />
              )}
              <span>{chatObj.favCount}</span>
            </div>
          </div>
          {isUser && (
            <div className="chat-edit-button">
              <DeleteIcon onClick={onDeleteClick} className="chat-delete" />
              <EditIcon onClick={toggleEditing} className="chat-edit" />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Chat;
