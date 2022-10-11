import React, {useEffect, useState} from "react";
import AutoCompleteCultureId from "./AutoCompleteCultureId";
import Conversations from "./Conversations";
import Chat from "./Chat";
import {getDetailedConversation} from "../utils/apis";
const PrivateChat = () => {
  const [selectedAccount, setSelectedAccount] = useState({});
  const [selectedChat, setSelectedChat] = useState({});
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState({});
  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }
  async function handleGetDetailedConversation(clickedChat) {
    if (!isEmpty(clickedChat)) {
      setLoading(true);
      setSelectedChat(clickedChat);
      let result = await getDetailedConversation({CONVERSATION_ID: clickedChat.conversationID});
      console.log("handleGetDetailedConversation: ", result);
      if (result) {
        console.log("result: ", result);
        console.log("))))))))))(((((((((");
        setChat(result);
      }
      setLoading(false);
    } else {
      setSelectedChat({});
      setChat({});
    }
  }
  useEffect(() => {
    console.log("selectAccount: ", selectedAccount);
    console.log("selectedChat: ", selectedChat);
  }, [selectedAccount, selectedChat]);
  return (
    <div className="container">
      <div className="column">
        <AutoCompleteCultureId setSelectedAccount={setSelectedAccount} />
      </div>
      <div className={`column border`}>
        <Conversations selectedChat={selectedChat} onSelectChat={handleGetDetailedConversation} />
      </div>
      <div className="column">
        <Chat chat={chat} isLoading={loading} selectedAccount={selectedAccount} />
      </div>
    </div>
  );
};

export default PrivateChat;
