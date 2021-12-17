import React, { useEffect, useRef, useState } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  doc,
  updateDoc,
  deleteDoc,
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

const Calendar = ({ userObj }) => {
  const [schedule, setSchedule] = useState([]); // 일정
  const [scheduleColor, setScheduleColor] = useState(""); // 일정 색상
  const [open, setOpen] = useState(false); // 일정 입력 폼 오픈
  const [calClickState, setCalClickState] = useState(""); // 신규 작성/수정 및 삭제/읽기 구분
  const [desc, setDesc] = useState(""); // 일정 내용
  const [startDate, setStartDate] = useState(""); // 일정 시작 날짜
  const [endDate, setEndDate] = useState(""); // 일정 끝 날짜
  const [calPublicId, setCalPublicId] = useState("");
  const [calCreateId, setCalCreateId] = useState("");

  // 상태 초기화 및 팝업 닫기
  const handleClose = () => {
    setOpen(false); // 팝업 닫기
    setCalClickState(""); // 일정 여부 초기화
    setCalPublicId("");
    setCalCreateId("");
    setScheduleColor("");
    setDesc("");
    setStartDate("");
    setEndDate("");
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;

    setDesc(value);
  };

  // 일정 색상 선택
  const handleChangeComplete = (color) => {
    setScheduleColor(color.hex);
  };

  // const useComponentWillMount = (func) => {
  //   const willMount = useRef(true);
  //   if (willMount.current) func();
  //   willMount.current = false;
  // };

  // // 일정 데이터 가져오기
  // useComponentWillMount(() => {
  //   const q = query(collection(dbService, "scheduler"));
  //   onSnapshot(q, (querySnapshot) => {
  //     const scheduleArray = querySnapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));
  //     setSchedule(scheduleArray);
  //   });
  // });

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

  // 시작 일 - 마지막 일 선택시(드래그 선택 or 클릭 선택) 입력 팝업 오픈
  const dateSelectHandle = (event) => {
    setCalClickState("new");
    setOpen(true);
    setStartDate(event.startStr);
    setEndDate(event.endStr);
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
      if (desc) {
        const contents = {
          title: `${userObj.displayName} : ${desc}`,
          start: startDate,
          end: endDate,
          color: scheduleColor,
          creatorId: userObj.uid,
          creatorNickName: userObj.displayName,
          createdAt: Date.now(),
        };
        await addDoc(collection(dbService, "scheduler"), contents);
      } else {
        alert("일정 내용을 입력해 주세요.");
      }
    } else if (calClickState === "edit") {
      if (userObj.uid === calCreateId) {
        schedule.map((scd) => {
          if (calPublicId === scd.id) {
            updateDoc(doc(dbService, `scheduler/${scd.id}`), {
              title: `${userObj.displayName} : ${desc}`,
              color: scheduleColor,
            });
          }
        });
      }
    }
    handleClose();
  };

  // 선택한 일정 수정 및 삭제
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
          extendedProps: { creatorId },
        },
      },
    } = event;
    setCalPublicId(publicId);
    setCalCreateId(creatorId);

    let arrr = title.split(" : ");
    arrr.splice(0, 1);

    if (userObj.uid === creatorId) {
      // 내가 쓴 일정이라면, 일정 수정 및 삭제
      setDesc(arrr.join(":"));
      setCalClickState("edit");
    } else {
      // 다른 사람의 일정이라면, 읽기
      setDesc(arrr.join(":"));
      setCalClickState("read");
    }
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

  return (
    <>
      <p>
        &#8251; 일정 유형 &#8251;
        <br />
        초록색 : 완료된 일정
        <br />
        파란색 : 진행중인 일정
        <br />
        빨간색 : 중지된 일정
        <br />
        회색 : 진행 예정 일정
      </p>
      <br />
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev",
          center: "title",
          right: "next",
        }}
        selectable="true"
        select={dateSelectHandle}
        events={schedule}
        eventClick={editEventHandle}
        locale="ko"
        views={{
          dayGrid: {
            dayMaxEventRows: 3,
          },
        }}
      />

      {open && (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          {calClickState === "read" ? (
            <Box sx={calStyle}>
              <Typography id="modal-modal-description">{desc}</Typography>
            </Box>
          ) : (
            <Box component="form" sx={calStyle} onSubmit={onSubmit}>
              <CirclePicker
                colors={["#00de04", "#3788d8", "#ff0000", "#9b9b9b"]}
                onChangeComplete={handleChangeComplete}
              />
              <br />
              <TextField
                id="outlined-multiline-static"
                label="일정 내용"
                multiline
                rows={4}
                className="cal-input"
                value={desc}
                onChange={onChange}
              />
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
