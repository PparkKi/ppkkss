import { dbService } from "fbase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Table } from "antd";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const offerStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const Secret = ({ userObj, containerStyle, admin }) => {
  const [offer, setOffer] = useState([]); // 받은 제안
  const [companyName, setCompanyName] = useState(""); // 회사명
  const [companyPhone, setCompanyPhone] = useState(""); // 전화번호
  const [companyDesc, setCompanyDesc] = useState(""); // 내용
  const [open, setOpen] = useState(false); // 공지 내용 활성화 여부
  const handleOpen = () => setOpen(true); // 공지 내용 폼 활성화
  const handleClose = () => setOpen(false); // 공지 내용 폼 비활성화

  // 테이블 구조 세팅
  const columns = [
    {
      title: "날짜",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      width: 200,
    },
    {
      title: "회사명",
      dataIndex: "company",
      key: "company",
      width: 200,
      align: "center",
    },
    {
      title: "전화번호",
      dataIndex: "phone",
      key: "phone",
      align: "center",
      width: 200,
    },
    {
      title: "내용",
      dataIndex: "desc",
      key: "desc",
      render: (text) => <a>{text}</a>,
      align: "center",
      ellipsis: true,
    },
  ];

  useEffect(async () => {
    // 총 메시지 실시간으로 가져오기
    const q = query(
      collection(dbService, "offers"),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (querySnapshot) => {
      const offerArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOffer(offerArray);
    });
  }, []);

  // 클릭한 제안 내용 보여주기
  const onClickRow = (record, index) => {
    setCompanyName(record.company);
    setCompanyPhone(record.phone);
    setCompanyDesc(record.desc);
    handleOpen();
  };

  return (
    <div style={containerStyle}>
      {userObj.uid === admin ? (
        <Table
          rowKey={(record) => record.id}
          columns={columns}
          dataSource={offer}
          bordered={true}
          pagination={{ position: ["bottomCenter"], pageSize: 12 }}
          onRow={(record, index) => {
            return {
              onClick: () => {
                onClickRow(record, index);
              },
            };
          }}
        />
      ) : (
        "admin 계정으로 확인해 주세요."
      )}

      {open && (
        <>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={offerStyle}>
              <Typography id="modal-modal-title">회사명 : {companyName}</Typography>
              <hr />
              <Typography id="modal-modal-title">전화번호 : {companyPhone}</Typography>
              <hr />
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                {companyDesc}
              </Typography>
            </Box>
          </Modal>
        </>
      )}
    </div>
  );
};

export default Secret;
