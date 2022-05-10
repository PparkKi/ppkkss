import React, { useEffect, useState } from "react";
import { HashRouter as Router, Route, Routes, Link } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { FaPowerOff } from "react-icons/fa";
import {
  HiHome,
  HiChatAlt2,
  HiClipboardList,
  HiUserCircle,
  HiCalendar,
  HiViewBoards,
} from "react-icons/hi";
import Auth from "pages/Auth";
import Home from "pages/Home";
import Introduce from "pages/Introduce";
import Schedule from "pages/Schedule";
import Profile from "pages/Profile";
import Chatting from "pages/Chatting";
import Notice from "pages/Notice";
import Secret from "pages/Secret";
import { authService, dbService } from "fbase";
import { collection, getDocs } from "firebase/firestore";
import useMediaQuery from "@mui/material/useMediaQuery";

const drawerWidth = 200;

// 사이드 네비를 포함하지 않는 콘텐츠 영역 스타일
const containerStyle = {
  padding: "30px",
  marginTop: "70px",
};

const AppRouter = ({ userObj, refreshUser, isLoggedIn, window }) => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("lg"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const [menu, setMenu] = useState([
    "",
    "introduce",
    "schedule",
    "chatting",
    "notice",
    "profile",
  ]); // 메뉴 link => component
  const [icon, setIcon] = useState([
    <HiHome size={39} />,
    <HiViewBoards size={39} />,
    <HiCalendar size={39} />,
    <HiChatAlt2 size={39} />,
    <HiClipboardList size={39} />,
    <HiUserCircle size={39} />,
  ]); // 메뉴 아이콘

  const [admin, setAdmin] = useState(""); // admin 계정 확인

  // 로그아웃
  const onLogOutClick = () => {
    authService.signOut();
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {["홈", "소개글", "일정관리", "채팅방", "공지/게시판", "프로필"].map(
          (text, index) => (
            <Link to={menu[index]} key={index}>
              <ListItem
                button
                key={text}
                style={{ marginBottom: "10px", marginTop: "10px" }}
                onClick={handleDrawerToggle}
              >
                <ListItemIcon>{icon[index]}</ListItemIcon>
                <ListItemText primary={text} style={{ color: "#616161" }} />
              </ListItem>
            </Link>
          )
        )}
      </List>
      <Link to="/" className="logOut-button">
        <FaPowerOff onClick={onLogOutClick} size={30} />
      </Link>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  useEffect(async () => {
    const querySnapshot = await getDocs(collection(dbService, "admin"));
    querySnapshot.forEach((doc) => {
      setAdmin(doc.data().adminId);
    });
  }, []);

  return (
    <Router>
      <Box sx={{ display: "flex" }}>
        {isLoggedIn && (
          <>
            <CssBaseline />
            <AppBar
              position="fixed"
              sx={{
                width: { sm: `calc(100% - ${drawerWidth}px)` },
                ml: { sm: `${drawerWidth}px` },
              }}
            >
              <Toolbar>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2, display: { sm: "none" } }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap component="div">
                  PKS of Portfolio
                </Typography>
              </Toolbar>
            </AppBar>
            <Box
              component="nav"
              sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
              aria-label="mailbox folders"
            >
              <Drawer
                container={container}
                variant={isMdUp ? "permanent" : "temporary"}
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                  keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                  display: { xs: "block", sm: "none" },
                  "& .MuiDrawer-paper": {
                    boxSizing: "border-box",
                    width: drawerWidth,
                  },
                }}
              >
                {drawer}
              </Drawer>
              <Drawer
                variant="permanent"
                sx={{
                  display: { xs: "none", sm: "block" },
                  "& .MuiDrawer-paper": {
                    boxSizing: "border-box",
                    width: drawerWidth,
                  },
                }}
                open
              >
                {drawer}
              </Drawer>
            </Box>
          </>
        )}

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <div className="container">
            <Routes>
              {isLoggedIn ? (
                <>
                  <Route
                    exact
                    path="/"
                    element={
                      <Home userObj={userObj} containerStyle={containerStyle} />
                    }
                  />
                  <Route
                    exact
                    path="/introduce"
                    element={
                      <Introduce
                        userObj={userObj}
                        containerStyle={containerStyle}
                      />
                    }
                  />
                  <Route
                    exact
                    path="/schedule"
                    element={
                      <Schedule
                        userObj={userObj}
                        containerStyle={containerStyle}
                      />
                    }
                  />
                  <Route
                    exact
                    path="/profile"
                    element={
                      <Profile
                        userObj={userObj}
                        refreshUser={refreshUser}
                        containerStyle={containerStyle}
                      />
                    }
                  />
                  <Route
                    exact
                    path="/chatting"
                    element={
                      <Chatting
                        userObj={userObj}
                        containerStyle={containerStyle}
                      />
                    }
                  />
                  <Route
                    exact
                    path="/notice"
                    element={
                      <Notice
                        userObj={userObj}
                        containerStyle={containerStyle}
                        admin={admin}
                      />
                    }
                  />
                  <Route
                    exact
                    path="/secret"
                    element={
                      <Secret
                        userObj={userObj}
                        containerStyle={containerStyle}
                        admin={admin}
                      />
                    }
                  />
                </>
              ) : (
                <>
                  <Route exact path="/" element={<Auth />} />
                </>
              )}
            </Routes>
          </div>
        </Box>
      </Box>
    </Router>
  );
};

export default AppRouter;
