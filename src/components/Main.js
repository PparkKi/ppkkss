import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Calendar from "./Calendar";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { dbService } from "fbase";
import MainBorad from "./MainBorad";
import MainChatting from "./MainChatting";
import { HiPlusCircle } from "react-icons/hi";
import MainOffer from "./MainOffer";
import MainProfile from "./MainProfile";

const ItemTop = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "left",
  color: theme.palette.text.secondary,
}));

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "left",
  color: theme.palette.text.secondary,
  height: theme.spacing(45),
}));

const Main = ({ userObj }) => {
  const [notices, setNotices] = useState([]); // 공지, 이벤트 총 게시판
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
      setNotices(noticeArray);
    });

    const querySnapshot = await getDocs(collection(dbService, "admin"));
    querySnapshot.forEach((doc) => {
      setAdmin(doc.data().adminId);
    });
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ItemTop sx={{ boxShadow: 7 }}>
            <div className="main-gridTitle">
              <MainProfile userObj={userObj} />
              <Link to="/profile">
                <HiPlusCircle size={30} />
              </Link>
            </div>
          </ItemTop>
        </Grid>
        <Grid item xs={6}>
          <Item sx={{ boxShadow: 7 }}>
            <div className="main-gridTitle">
              <h4>금주일정</h4>
              <Link to="/schedule">
                <HiPlusCircle size={30} />
              </Link>
            </div>
            <Calendar userObj={userObj} initViewWeek={true} />
          </Item>
        </Grid>
        <Grid item xs={6}>
          <Item sx={{ boxShadow: 7 }}>
            <div className="main-gridTitle">
              <h4>게시판</h4>
              <Link to="/notice">
                <HiPlusCircle size={30} />
              </Link>
            </div>
            <MainBorad noticeObj={notices} />
          </Item>
        </Grid>
        <Grid item xs={6}>
          <Item sx={{ boxShadow: 7 }}>
            <div className="main-gridTitle">
              <h4>채팅</h4>
              <Link to="/chatting">
                <HiPlusCircle size={30} />
              </Link>
            </div>
            <MainChatting userObj={userObj} />
          </Item>
        </Grid>
        <Grid item xs={6}>
          <Item sx={{ boxShadow: 7 }}>
            <div className="main-gridTitle">
              <h4>면접 제안</h4>
              {userObj.uid === admin && (
                <Link to="/secret">
                  <HiPlusCircle size={30} />
                </Link>
              )}
            </div>
            <MainOffer />
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Main;
