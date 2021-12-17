import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { FaPowerOff } from "react-icons/fa";
import {
  HiHome,
  HiChatAlt2,
  HiClipboardList,
  HiUserCircle,
} from "react-icons/hi";
import Auth from "pages/Auth";
import Home from "pages/Home";
import Profile from "pages/Profile";
import Chatting from "pages/Chatting";
import Notice from "pages/Notice";
import { authService } from "fbase";

const drawerWidth = 200;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

// 사이드 네비를 포함하지 않는 콘텐츠 영역 스타일
const containerStyle = {
  padding: "30px",
  marginTop: "70px",
};

const AppRouter = ({ userObj, refreshUser, isLoggedIn }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(true); // 사이드 메뉴 on/off 여부
  const [menu, setMenu] = useState(["home", "chatting", "notice", "profile"]); // 메뉴 link => component
  const [icon, setIcon] = useState([
    <HiHome size={39} />,
    <HiChatAlt2 size={39} />,
    <HiClipboardList size={39} />,
    <HiUserCircle size={39} />,
  ]); // 메뉴 아이콘

  // 로그아웃
  const onLogOutClick = () => {
    authService.signOut();
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Box sx={{ display: "flex" }}>
        {isLoggedIn && (
          <>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
              <Toolbar>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
                  edge="start"
                  sx={{
                    marginRight: "36px",
                    ...(open && { display: "none" }),
                  }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap component="div">
                  PKS of Portfolio
                </Typography>
              </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
              <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                  {theme.direction === "rtl" ? (
                    <ChevronRightIcon />
                  ) : (
                    <ChevronLeftIcon />
                  )}
                </IconButton>
              </DrawerHeader>
              <Divider />
              <List>
                {["Home", "Chatting", "Notice", "Profile"].map(
                  (text, index) => (
                    <Link to={menu[index]} key={index}>
                      <ListItem
                        button
                        key={text}
                        style={{ marginBottom: "10px", marginTop: "10px" }}
                      >
                        <ListItemIcon>{icon[index]}</ListItemIcon>
                        <ListItemText
                          primary={text}
                          style={{ color: "#616161" }}
                        />
                      </ListItem>
                    </Link>
                  )
                )}
              </List>
              <Link to="/" className="logOut-button">
                <FaPowerOff onClick={onLogOutClick} size={30} />
              </Link>
            </Drawer>
          </>
        )}

        <Box component="main" sx={{ flexGrow: 1 }}>
          <div className="container">
            <Routes>
              {isLoggedIn ? (
                <>
                  <Route
                    exact
                    path="/home"
                    element={
                      <Home userObj={userObj} containerStyle={containerStyle} />
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
