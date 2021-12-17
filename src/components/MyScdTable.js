import React, { useState } from "react";
import { Table } from "antd";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

const MyScdTable = ({ scdObj, style }) => {
  const [isView, setIsView] = useState(false); // 일정 뷰 팝업
  const [viewScd, setViewScd] = useState(""); // 선택한 일정 내용
  const handleClose = () => {
    setViewScd("");
    setIsView(false);
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
      render: (text) => (
        <a
          onClick={() => {
            onScdClick(text);
          }}
        >
          {text}
        </a>
      ),
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

  // 일정 내용 클릭 이벤트
  const onScdClick = (text) => {
    setIsView(true);

    let arrr = text.split(" : ");
    arrr.splice(0, 1);
    setViewScd(arrr.join(":"));
  };

  return (
    <>
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={scdObj}
        bordered={true}
        pagination={{ position: ["bottomCenter"], pageSize: 3 }}
      />

      {isView && (
        <Modal
          open={isView}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-description">{viewScd}</Typography>
          </Box>
        </Modal>
      )}
    </>
  );
};

export default MyScdTable;
