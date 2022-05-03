import React, { useState, useEffect, useRef } from "react";
import { collection, onSnapshot, orderBy, query } from "@firebase/firestore";
import Chat from "components/Chat";
import ChatForm from "components/ChatForm";
import { dbService } from "fbase";
import { useMediaQuery } from "react-responsive";

const Chatting = ({ userObj, containerStyle }) => {
  const [chats, setChats] = useState([]); // 입력된 총 메시지
  const messagesEndRef = useRef();

  // 새로운 채팅 입력시 스크롤 하단으로
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView();
  };

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
      setChats(chatArray);
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  const isMobile = useMediaQuery({
    query: "(max-width:540px)",
  });
  const isMobileSize = isMobile ? "m-chat-item-wrap" : "chat-item-wrap"

  return (
    <div className="chat-wrap" style={containerStyle}>
      <div className={isMobileSize}>
        {chats.map((chat) => (
          <Chat
            key={chat.id}
            chatObj={chat}
            isUser={chat.creatorId === userObj.uid}
            userObj={userObj}
          />
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      <hr />
      <ChatForm userObj={userObj} />
    </div>
  );
};

export default Chatting;
