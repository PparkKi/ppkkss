import React, { useState } from "react";
import "antd/dist/antd.css";
import { Table } from "antd";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { doc, updateDoc } from "firebase/firestore";
import { dbService } from "fbase";

const NoticeList = ({ noticeObj, noticeStyle }) => {
  const [open, setOpen] = useState(false); // 공지 내용 활성화 여부
  const handleOpen = () => setOpen(true); // 공지 내용 폼 활성화
  const handleClose = () => setOpen(false); // 공지 내용 폼 비활성화
  const [noticeTitle, setNoticeTitle] = useState(""); // 클릭한 공지 제목
  const [noticeDesc, setNoticeDesc] = useState(""); // 클릭한 공지 내용

  // 테이블 구조 세팅
  const columns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      align: "center",
      width: 130,
    },
    {
      title: "제목",
      dataIndex: "title",
      key: "title",
      render: (text) => <a>{text}</a>,
      align: "center",
      ellipsis: true,
      width: 200,
    },
    {
      title: "조회수",
      dataIndex: "viewCount",
      key: "viewCount",
      align: "center",
      width: 80,
    },
    {
      title: "작성자",
      dataIndex: "creatorNickName",
      key: "creatorNickName",
      align: "center",
      width: 80,
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
    <div>
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={noticeObj}
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
    </div>
  );
};

export default NoticeList;
