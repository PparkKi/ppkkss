import React, { useState } from "react";
import "antd/dist/antd.css";
import { Table } from "antd";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { doc, updateDoc } from "firebase/firestore";
import { dbService } from "fbase";

const noticeStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const MainBorad = ({ noticeObj }) => {
  const [open, setOpen] = useState(false); // 공지 내용 활성화 여부
  const handleOpen = () => setOpen(true); // 공지 내용 폼 활성화
  const handleClose = () => setOpen(false); // 공지 내용 폼 비활성화
  const [noticeTitle, setNoticeTitle] = useState(""); // 클릭한 공지 제목
  const [noticeDesc, setNoticeDesc] = useState(""); // 클릭한 공지 내용

  // 테이블 구조 세팅
  const columns = [
    {
      title: "제목",
      dataIndex: "title",
      key: "title",
      render: (text) => <a>{text}</a>,
      ellipsis: true,
    },
  ];

  // 클릭한 공지 내용 보여주기
  const onClickRow = async (record, index) => {
    setNoticeTitle(record.title);
    setNoticeDesc(record.desc);
    handleOpen();
    await updateDoc(doc(dbService, `notices/${record.id}`), {
      viewCount: record.viewCount + 1,
    });
  };

  return (
    <>
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={noticeObj}
        pagination={{ position: ["bottomCenter"], pageSize: 5 }}
        showHeader={false}
        size={"small"}
        onRow={(record, index) => {
          return {
            onClick: () => {
              onClickRow(record, index);
            },
          };
        }}
      />

      {open && (
        <>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={noticeStyle}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                {noticeTitle}
              </Typography>
              <hr />
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                {noticeDesc}
              </Typography>
            </Box>
          </Modal>
        </>
      )}
    </>
  );
};

export default MainBorad;
