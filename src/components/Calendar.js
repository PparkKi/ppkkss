import React, { useEffect, useRef, useState } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  doc,
  updateDoc,
  deleteDoc,
  where,
  getDocs,
} from "@firebase/firestore";
import { dbService } from "fbase";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CirclePicker } from "react-color";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import DatePicker from "@mui/lab/DatePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import Button from "@mui/material/Button";

const calStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const Calendar = ({ userObj, initViewWeek }) => {
  const [schedule, setSchedule] = useState([]); // 일정
  const [scheduleColor, setScheduleColor] = useState(""); // 일정 색상
  const [scheduleType, setScheduleType] = useState(0);
  const [open, setOpen] = useState(false); // 일정 입력 폼 오픈
  const [calClickState, setCalClickState] = useState(""); // 신규 작성/수정 및 삭제/읽기 구분
  const [title, setTitle] = useState(""); // 일정 제목
  const [desc, setDesc] = useState(""); // 일정 내용
  const [startDate, setStartDate] = useState(null); // 일정 시작 날짜
  const [endDate, setEndDate] = useState(null); // 일정 끝 날짜
  const [scdCreator, setScdCreator] = useState(""); // 일정 작성자
  const [calPublicId, setCalPublicId] = useState("");
  const [calCreateId, setCalCreateId] = useState("");

  // 상태 초기화 및 팝업 닫기
  const handleClose = () => {
    setOpen(false); // 팝업 닫기
    setCalClickState(""); // 일정 여부 초기화
    setCalPublicId("");
    setCalCreateId("");
    setScheduleColor("");
    setScheduleType(0);
    setTitle("");
    setDesc("");
    setStartDate(null);
    setEndDate(null);
  };

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;

    if (name === "title") setTitle(value);
    else if (name === "desc") setDesc(value);
  };

  // 일정 색상 선택
  const handleChangeComplete = (color) => {
    setScheduleColor(color.hex);

    let scdType;
    switch (color.hex) {
      case "#00de04":
        scdType = 0;
        break;
      case "#3788d8":
        scdType = 1;
        break;
      case "#ff0000":
        scdType = 2;
        break;
      case "#9b9b9b":
        scdType = 3;
        break;
    }
    setScheduleType(scdType);
  };

  // 일정 데이터 가져오기
  useEffect(() => {
    const q = query(collection(dbService, "scheduler"));
    onSnapshot(q, (querySnapshot) => {
      const scheduleArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSchedule(scheduleArray);
    });
  }, []);

  // "일정 등록" 버튼 클릭시 입력 팝업 오픈
  const dateSelectHandle = () => {
    setCalClickState("new");
    setOpen(true);
  };

  // 일정 신규 등록 및 수정
  const onSubmit = async (event) => {
    event.preventDefault();

    if (scheduleColor === "") {
      return alert(
        "일정 색상을 선택해 주세요.\n\n초록색 : 완료된 일정\n파란색 : 진행중인 일정\n빨간색 : 중지된 일정\n회색 : 진행 예정 일정"
      );
    }

    if (calClickState === "new") {
      if (title && desc) {
        const contents = {
          title: `${userObj.displayName} : ${title}`,
          desc,
          start: startDate,
          end: endDate,
          color: scheduleColor,
          type: scheduleType,
          creatorId: userObj.uid,
          creatorNickName: userObj.displayName,
          createdAt: Date.now(),
        };
        await addDoc(collection(dbService, "scheduler"), contents);
      } else if (startDate > endDate) {
        alert("일정 범위를 확인해 주세요.");
        return false;
      } else {
        alert("일정 제목과 내용을 입력해 주세요.");
        return false;
      }
    } else if (calClickState === "edit") {
      if (userObj.uid === calCreateId) {
        schedule.map((scd) => {
          if (calPublicId === scd.id) {
            updateDoc(doc(dbService, `scheduler/${scd.id}`), {
              title: `${userObj.displayName} : ${title}`,
              desc,
              color: scheduleColor,
              start: startDate,
              end: endDate,
            });
          }
        });
      }
    }
    handleClose();
  };

  // 선택한 일정 수정 및 삭제
  // 등록된 일정 클릭 이벤트
  const editEventHandle = async (event) => {
    // 일정 내용, 일정 문서 id
    const {
      event: {
        _def: { title, publicId },
      },
    } = event;

    // 일정 작성자 id
    const {
      event: {
        _def: {
          extendedProps: { creatorId, desc, creatorNickName },
        },
      },
    } = event;

    // 일정 범위 (시작/끝 날짜)
    const {
      event: {
        _instance: {
          range: { start, end },
        },
      },
    } = event;

    let arrr = title.split(" : ");
    arrr.splice(0, 1);
    let sDate = start.toISOString().split("T")[0];
    let eDate = end.toISOString().split("T")[0];

    // 내가 쓴 일정이라면, 일정 수정 및 삭제
    // 다른 사람의 일정이라면, 읽기
    if (userObj.uid === creatorId) setCalClickState("edit");
    else setCalClickState("read");

    setCalPublicId(publicId);
    setCalCreateId(creatorId);
    setScdCreator(creatorNickName);
    setTitle(arrr.join(":"));
    setDesc(desc);
    setStartDate(sDate);
    setEndDate(eDate);
    setOpen(true);
  };

  // 일정 삭제
  const onDeleteScd = (event) => {
    event.preventDefault();

    schedule.map((scd) => {
      if (calPublicId === scd.id) {
        const ok = window.confirm("삭제 하시겠습니까?");
        if (ok) {
          deleteDoc(doc(dbService, `scheduler/${scd.id}`));
          handleClose();
        } else {
          handleClose();
        }
      }
    });
  };

  // initViewWeek의 값이 true라면 주간 일정
  // false 또는 빈값이면 월간 일정
  // , 높이 조절
  // Home(true), Schedule(false)
  const initView = initViewWeek ? "dayGridWeek" : "dayGridMonth";
  const setHt = initViewWeek ? "250px" : "auto";

  return (
    <>
      {!initViewWeek && (
        <Button
          variant="contained"
          className="cal-button"
          onClick={dateSelectHandle}
        >
          일정 등록
        </Button>
      )}
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        initialView={initView}
        headerToolbar={{
          left: "prev",
          center: "title",
          right: "next",
        }}
        selectable="true"
        // select={dateSelectHandle}
        events={schedule}
        eventClick={editEventHandle}
        locale="ko"
        views={{
          dayGrid: {
            dayMaxEventRows: 3,
          },
        }}
        height={setHt}
      />

      {open && (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          disableEscapeKeyDown={true}
        >
          {calClickState === "read" ? (
            <Box sx={calStyle}>
              <Typography className="cal-readtitle">
                <sapn><b>작성자</b> : {scdCreator}</sapn>
                <sapn><b>일정</b> : {startDate} ~ {endDate}</sapn>
              </Typography>
              <br />
              <div className="cal-readInput">
                <TextField
                  id="outlined-basic"
                  label="제목"
                  variant="outlined"
                  name="title"
                  value={title}
                />
                <TextField
                  id="outlined-multiline-static"
                  label="내용"
                  multiline
                  rows={7}
                  value={desc}
                />
              </div>
            </Box>
          ) : (
            <Box component="form" sx={calStyle} onSubmit={onSubmit}>
              <div className="cal-color">
                일정 유형 선택 : &nbsp;
                <CirclePicker
                  colors={["#00de04", "#3788d8", "#ff0000", "#9b9b9b"]}
                  onChangeComplete={handleChangeComplete}
                />
              </div>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <div className="cal-datepicker">
                  <DatePicker
                    label="Start"
                    disablePast
                    inputFormat={"yyyy-MM-dd"}
                    mask={"____-__-__"}
                    value={startDate}
                    onChange={(newValue) => {
                      let sDate = newValue.toISOString().split("T")[0];
                      setStartDate(sDate);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                  &nbsp;&nbsp;~&nbsp;&nbsp;
                  <DatePicker
                    label="End"
                    disablePast
                    inputFormat={"yyyy-MM-dd"}
                    mask={"____-__-__"}
                    value={endDate}
                    onChange={(newValue) => {
                      let eDate = newValue.toISOString().split("T")[0];
                      setEndDate(eDate);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </div>
              </LocalizationProvider>
              <div className="cal-input">
                <TextField
                  id="outlined-basic"
                  label="제목"
                  variant="outlined"
                  name="title"
                  value={title}
                  onChange={onChange}
                />
                <TextField
                  id="outlined-multiline-static"
                  label="내용"
                  multiline
                  rows={7}
                  name="desc"
                  value={desc}
                  onChange={onChange}
                />
              </div>
              <div className="cal-submit">
                {calClickState === "new" && (
                  <input type="submit" value="등록" />
                )}
                {calClickState === "edit" && (
                  <>
                    <input type="submit" value="수정" />
                    <button onClick={onDeleteScd}>삭제</button>
                  </>
                )}
              </div>
            </Box>
          )}
        </Modal>
      )}
    </>
  );
};

export default Calendar;
