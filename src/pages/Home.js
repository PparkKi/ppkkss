import Main from "components/Main";
import React from "react";
import { useMediaQuery } from "react-responsive";

const Home = ({ userObj, containerStyle }) => {

  const isPc = useMediaQuery({
    query : "(min-width:1024px)"
  });

  return (
    <div style={containerStyle}>
      <Main userObj={userObj} isPc={isPc} />
    </div>
  );
};

export default Home;
