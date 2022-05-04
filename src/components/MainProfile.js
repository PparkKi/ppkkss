import { dbService } from "fbase";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

const MainProfile = ({ userObj }) => {
  const [scd1, setScd1] = useState(0); // 진행중인 일정 개수
  const [scd2, setScd2] = useState(0); // 중지된 일정 개수
  const [scd3, setScd3] = useState(0); // 진행 예정 일정 개수
  const [scdT, setScdT] = useState(["진행", "중지", "예정"]);

  useEffect(async () => {
    const qq = query(
      collection(dbService, "scheduler"),
      where("creatorId", "==", userObj.uid),
      where("type", "==", 1)
    );
    const qqSnapshot = await getDocs(qq);

    const qqq = query(
      collection(dbService, "scheduler"),
      where("creatorId", "==", userObj.uid),
      where("type", "==", 2)
    );
    const qqqSnapshot = await getDocs(qqq);

    const qqqq = query(
      collection(dbService, "scheduler"),
      where("creatorId", "==", userObj.uid),
      where("type", "==", 3)
    );
    const qqqqSnapshot = await getDocs(qqqq);

    let qqArr = [];
    let qqqArr = [];
    let qqqqArr = [];
    qqSnapshot.docs.map((doc) => {
      qqArr.push(doc.data().type);
    });
    qqqSnapshot.docs.map((doc) => {
      qqqArr.push(doc.data().type);
    });
    qqqqSnapshot.docs.map((doc) => {
      qqqqArr.push(doc.data().type);
    });
    setScd1(qqArr.length);
    setScd2(qqqArr.length);
    setScd3(qqqqArr.length);
  }, []);

  const isMobile = useMediaQuery({
    query: "(max-width:540px)",
  });

  return (
    <div className="mainProfile-box">
      <strong className="mainProfile-name">{userObj.displayName}</strong>
      {!isMobile && scdT[0]}&nbsp;<span className="mainprofile-color1">{scd1}</span>&nbsp;
      {!isMobile && scdT[1]}&nbsp;<span className="mainprofile-color2">{scd2}</span>&nbsp;
      {!isMobile && scdT[2]}&nbsp;<span className="mainprofile-color3">{scd3}</span>&nbsp;
    </div>
  );
};

export default MainProfile;
