import React, { useState } from "react";
import { Table } from "antd";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

const MyScdTable = ({ scdObj, style }) => {
  const [isView, setIsView] = useState(false); // 일정 뷰 팝업
  const [viewScdTitle, setViewScdTitle] = useState(""); // 선택한 일정 제목
  const [viewScdDesc, setViewScdDesc] = useState(""); // 선택한 일정 내용
  const [viewScdCreator, setViewScdCreator] = useState(""); // 선택한 일정 작성자
  const [startDate, setStartDate] = useState(null); // 일정 시작 날짜
  const [endDate, setEndDate] = useState(null); // 일정 끝 날짜
  const handleClose = () => {
    setIsView(false);
    setViewScdTitle("");
    setViewScdDesc("");
    setViewScdCreator("");
    setStartDate(null);
    setEndDate(null);
  };

  // 테이블 구조 세팅
  const columns = [
    {
      title: "시작일",
      dataIndex: "start",
      key: "start",
      align: "center",
      width: 200,
    },
    {
      title: "내용",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      align: "center",
    },
    {
      title: "일정 유형",
      dataIndex: "color",
      key: "color",
      align: "center",
      width: 120,
      render: (text) => (
        <span
          style={{
            content: " ",
            color: text,
            backgroundColor: text,
            padding: "4px 12px",
            borderRadius: "30px",
          }}
        ></span>
      ),
    },
  ];

  // "나의 일정" 열 클릭
  const onClickRow = (record, index) => {
    setIsView(true);

    let arrr = record.title.split(" : ");
    arrr.splice(0, 1);
    setViewScdTitle(arrr.join(":"));
    setViewScdDesc(record.desc);
    setViewScdCreator(record.creatorNickName);
    setStartDate(record.start);
    setEndDate(record.end);
  };

  return (
    <>
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={scdObj}
        bordered={true}
        pagination={{ position: ["bottomCenter"], pageSize: 3 }}
        onRow={(record, index) => {
          return {
            onClick: () => {
              onClickRow(record, index);
            },
          };
        }}
      />

      {isView && (
        <Modal
          open={isView}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography className="profile-scdTitle">
              <sapn><b>작성자</b> : {viewScdCreator}</sapn>
              <sapn><b>일정</b> : {startDate} ~ {endDate}</sapn>
            </Typography>
            <br />
            <div className="cal-readInput">
              <TextField
                id="outlined-basic"
                label="제목"
                variant="outlined"
                name="title"
                value={viewScdTitle}
              />
              <TextField
                id="outlined-multiline-static"
                label="내용"
                multiline
                rows={7}
                value={viewScdDesc}
              />
            </div>
          </Box>
        </Modal>
      )}
    </>
  );
};

export default MyScdTable;
