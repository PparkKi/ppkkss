import Calendar from "components/Calendar";
import React from "react";

const Schedule = ({ userObj, containerStyle }) => {
  return (
    <div style={containerStyle}>
      <h1>일정 관리</h1>
      <span className="scdColor scdColor-complete">완료</span>
      <span className="scdColor scdColor-ing">진행중</span>
      <span className="scdColor scdColor-stop">중지된 일정</span>
      <span className="scdColor scdColor-rv">진행 예정</span>
      <br /><br />
      <Calendar userObj={userObj} />
    </div>
  );
};

export default Schedule;
