import Main from "components/Main";
import React from "react";

const Home = ({ userObj, containerStyle }) => {
  return (
    <div style={containerStyle}>
      <Main userObj={userObj} />
    </div>
  );
};

export default Home;
