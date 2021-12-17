import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";
import { updateProfile } from "@firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        // setIsLoggedIn(true);
        // 구글, 페이스북 로그인
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) =>
            updateProfile(authService.currentUser, {
              displayName: user.displayName,
            }),
        });

        // 신규 가입자 로그인
        if (user.displayName == null) {
          setUserObj({
            displayName: "신규 가입자",
            uid: user.uid,
            updateProfile: (args) =>
              updateProfile(authService.currentUser, {
                displayName: user.displayName,
              }),
          });
        }
      } else {
        // setIsLoggedIn(false);
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);

  // 닉네임 변경 후 user 새로고침 (실시간으로 반영하기 위함)
  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) =>
        updateProfile(user, { displayName: user.displayName }),
    });
  };

  return (
    <>
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
        />
      ) : (
        "init..."
      )}
      {/* <footer>footer</footer> */}
    </>
  );
}

export default App;
