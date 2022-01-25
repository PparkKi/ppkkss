import React, { useEffect, useState } from "react";
import NoticeForm from "components/NoticeForm";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { dbService } from "fbase";
import NoticeList from "components/NoticeList";
import NoticeEventList from "components/NoticeEventList";

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

const Notice = ({ userObj, containerStyle, admin }) => {
  const [notice, setNotice] = useState([]); // 공지사항
  const [nevent, setNevent] = useState([]); // 이벤트

  useEffect(async () => {
    // 공지사항
    const q = query(
      collection(dbService, "notices"),
      where("type", "==", "공지"),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (querySnapshot) => {
      const noticeArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotice(noticeArray);
    });

    // 이벤트
    const qq = query(
      collection(dbService, "notices"),
      where("type", "==", "이벤트"),
      orderBy("createdAt", "desc")
    );
    onSnapshot(qq, (querySnapshot) => {
      const noticeEventArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNevent(noticeEventArray);
    });
  }, []);

  return (
    <div style={containerStyle}>
      <NoticeForm
        userObj={userObj}
        noticeStyle={noticeStyle}
        admin={userObj.uid === admin}
      />
      <div>
        <h2>공지사항</h2>
        <NoticeList noticeObj={notice} noticeStyle={noticeStyle} />
      </div>
      <div>
        <h2>이벤트</h2>
        <NoticeEventList noticeObj={nevent} noticeStyle={noticeStyle} />
      </div>
    </div>
  );
};

export default Notice;
