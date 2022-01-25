import React, { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { dbService } from "fbase";
import Chat from "./Chat";

const MainChatting = ({ userObj }) => {
  const [mainChat, setMainChat] = useState([]);

  useEffect(async () => {
    // 총 메시지 실시간으로 가져오기
    const q = query(
      collection(dbService, "chats"),
      orderBy("createdAt", "asc")
    );
    onSnapshot(q, (querySnapshot) => {
      const chatArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMainChat(chatArray);
    });
  }, []);
  return (
    <div className="main-chat">
      {mainChat.map((chat) => (
        <Chat
          key={chat.id}
          chatObj={chat}
          isUser={chat.creatorId === userObj.uid}
          userObj={userObj}
        />
      ))}
    </div>
  );
};

export default MainChatting;
