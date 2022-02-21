import Calendar from "components/Calendar";
import React from "react";

const Schedule = ({ userObj, containerStyle }) => {
  return (
    <div style={containerStyle}>
      <div className="scd-title">
        <h1 className="scd-h1">일정 관리</h1>
        <div className="scdColor-box">
          <span className="scdColor scdColor-complete">완료</span>
          <span className="scdColor scdColor-ing">진행중</span>
          <span className="scdColor scdColor-stop">중지된 일정</span>
          <span className="scdColor scdColor-rv">진행 예정</span>
        </div>
      </div>
      <Calendar userObj={userObj} />
    </div>
  );
};

export default Schedule;
