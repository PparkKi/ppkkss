import Calendar from "components/Calendar";
import React from "react";

const Home = ({ userObj, containerStyle }) => {
  return (
    <div style={containerStyle}>
      <h1>일정 관리</h1>
      <Calendar userObj={userObj} />
    </div>
  );
};

export default Home;
