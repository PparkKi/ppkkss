import React, { useState } from "react";
import { deleteDoc, updateDoc, doc } from "firebase/firestore";
import { dbService, storageService } from "fbase";
import { deleteObject, ref } from "firebase/storage";
import { Table, Space } from "antd";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

const MyChatTable = ({ chatObj, style }) => {
  const [isView, setIsView] = useState(false); // 메시지 뷰 팝업
  const [viewChat, setViewChat] = useState(""); // 선택한 열 메시지
  const [editing, setEditing] = useState(false); // 메시지 수정중 여부
  const [edit, setEdit] = useState(chatObj.message); // 선택한 열 (수정)메시지
  const [docId, setDocId] = useState("");
  const handleOpen = () => setEditing(true);
  const handleClose = () => {
    setEditing(false);
    setDocId("");
    setIsView(false);
  };

  // 테이블 구조 세팅
  const columns = [
    {
      title: "내용",
      dataIndex: "message",
      key: "message",
      align: "center",
      ellipsis: true,
      render: (text) => (
        <a
          onClick={() => {
            onMessageClick(text);
          }}
        >
          {text}
        </a>
      ),
    },
    {
      title: "사진",
      dataIndex: "fileUrl",
      key: "fileUrl",
      align: "center",
      ellipsis: true,
      width: 80,
      render: (text, record) => {
        return record.fileUrl ? (
          <button
            onClick={() => {
              onFileUrlClick(record);
            }}
          >
            O
          </button>
        ) : (
          "X"
        );
      },
    },
    {
      title: "좋아요",
      dataIndex: "favCount",
      key: "favCount",
      align: "center",
      width: 80,
    },
    {
      title: "수정",
      key: "action",
      align: "center",
      width: 140,
      render: (text, record) => (
        <Space size="middle">
          <button
            onClick={() => {
              onEditClick(record);
            }}
          >
            수정
          </button>
          <button
            onClick={() => {
              onDeleteClick(record);
            }}
          >
            삭제
          </button>
        </Space>
      ),
    },
  ];

  // 내용 클릭시
  const onMessageClick = (text) => {
    setIsView(true);
    setViewChat(text);
  };

  // 사진 버튼 클릭시 새창으로 이미지 띄우기
  const onFileUrlClick = (record) => {
    window.open(record.fileUrl);
  };

  // 메시지 수정 클릭 이벤트
  const onEditClick = (record) => {
    handleOpen();
    setEdit(record.message);
    setDocId(record.id);
  };

  // 메시지 수정 완료
  const onEditComplete = async (e) => {
    e.preventDefault();
    await updateDoc(doc(dbService, `chats/${docId}`), {
      message: edit,
    });
    handleClose();
  };

  // 메시지 내용 수정
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setEdit(value);
  };

  // 메시지 삭제 클릭 이벤트
  const onDeleteClick = async (record) => {
    const ok = window.confirm("삭제하시겠습니까?");
    if (ok) {
      //delete
      await deleteDoc(doc(dbService, `chats/${record.id}`));
      if (record.fileUrl !== "") {
        await deleteObject(ref(storageService, record.fileUrl));
      }
    }
  };

  return (
    <>
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={chatObj}
        bordered={true}
        pagination={{ position: ["bottomCenter"], pageSize: 3 }}
      />

      {editing && (
        <Modal
          open={editing}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            component="form"
            sx={style}
            autoComplete="off"
            className="mychattable-form"
          >
            <TextField
              id="outlined-multiline-static"
              label="내용"
              multiline
              rows={4}
              type="text"
              onChange={onChange}
              value={edit}
              required
              inputProps={{ maxLength: 200 }}
              className="mychattable-form-input"
            />
            <button onClick={onEditComplete}>수정</button>
          </Box>
        </Modal>
      )}

      {isView && (
        <Modal
          open={isView}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-description">{viewChat}</Typography>
          </Box>
        </Modal>
      )}
    </>
  );
};

export default MyChatTable;
