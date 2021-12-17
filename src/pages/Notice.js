import React, { useEffect, useState } from "react";
import NoticeForm from "components/NoticeForm";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { dbService } from "fbase";
import NoticeList from "components/NoticeList";

const noticeStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const Notice = ({ userObj, containerStyle }) => {
  const [notice, setNotice] = useState([]); // 공지사항
  const [admin, setAdmin] = useState(""); // admin 계정 확인

  useEffect(async () => {
    const q = query(
      collection(dbService, "notices"),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (querySnapshot) => {
      const noticeArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotice(noticeArray);
    });

    const querySnapshot = await getDocs(collection(dbService, "admin"));
    querySnapshot.forEach((doc) => {
      setAdmin(doc.data().adminId);
    });
  }, []);

  return (
    <div style={containerStyle}>
      <h1>공지사항</h1>
      <NoticeForm
        userObj={userObj}
        noticeStyle={noticeStyle}
        admin={userObj.uid === admin}
      />
      <div>
        <NoticeList noticeObj={notice} noticeStyle={noticeStyle} />
      </div>
    </div>
  );
};

export default Notice;
