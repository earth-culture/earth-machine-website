import React, {useEffect, useState} from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import {createMessage, getDetailedConversation} from "../utils/apis";

const loader = (
  <div style={{margin: "auto", width: "60%", padding: "10px"}}>
    <Box sx={{display: "flex", alignItems: "center", justifyContent: "center"}}>
      <CircularProgress />
    </Box>
  </div>
);
export default function Chat({chat, isLoading, selectedAccount}) {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [conId, setConId] = useState(null);

  const [fetchNewMsg, setFetchNewMsg] = useState(false);
  const handlePost = (e) => {
    setMsg(e.target.value);
  };
  function reset() {
    setMsg("");
  }
  useEffect(() => {
    console.log("conId: ", conId);
  }, [conId]);

  async function handleCreateMessage() {
    if (!conId && !selectedAccount) {
      console.log("conId: ", conId);
      alert("Please select person first from dropdown or conversation to start chat.");
      return;
    }
    if (msg.length == 0) {
      alert("Message  should not be empty");
      return;
    }
    if (selectedAccount && Object.keys(selectedAccount).length !== 0) {
      console.log("selectedAccount$$$$$$$$: ", selectedAccount);
      let result = await createMessage(
        {MESSAGE_TEXT: msg, TARGET_ACCOUNT_ID: selectedAccount.ACCOUNT_ID},
        reset
      );
      if (result.RESULT == "success") {
        setConId(result.CONVERSATION_ID);
        setFetchNewMsg(true);
      }
    } else {
      let result = await createMessage({MESSAGE_TEXT: msg, CONVERSATION_ID: conId}, reset);
      if (result.RESULT == "success") {
        setFetchNewMsg(true);
      }
    }
  }
  useEffect(() => {
    (async () => {
      if (fetchNewMsg) {
        let result = await getDetailedConversation({CONVERSATION_ID: conId});
        console.log("&&&&&&&&&&&: ", result);
        if (result) setMessages(result.detailedConversation.messages);
      }
    })();

    console.log("fetchNewMsg: ", fetchNewMsg);
    return function cleanup() {
      setFetchNewMsg(false);
    };
  }, [fetchNewMsg]);

  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }
  useEffect(() => {
    if (!isEmpty(chat)) {
      console.log("-------->", chat.detailedConversation);
      console.log("creationTime: ", chat.detailedConversation.creationTime);
      console.log("messages: ", chat.detailedConversation.messages);
      console.log("conversationID: ", chat.detailedConversation.conversationID);
      setMessages(chat.detailedConversation.messages);
      setConId(chat.detailedConversation.conversationID);
    } else {
      setMessages([]);
      setConId(null);
    }
  }, [chat]);

  return (
    <div>
      {isLoading ? (
        loader
      ) : (
        <>
          <div className="left">
            <h4>Private Chat:)</h4>
            <textarea
              name="text"
              id="text"
              cols={30}
              rows={2}
              className="inpt"
              value={msg}
              onChange={handlePost}
              maxLength={500}
            />
            <br />
            <div className="row">
              <button type="submit" className="post-btn" onClick={handleCreateMessage}>
                Submit
              </button>
              <p>{msg.length}/500</p>
            </div>
          </div>
          {messages?.map((message) => (
            <div className="left break-tag " key={message.messageID}>
              <div className={`post-spacing`}>
                <h5>{message.cultureID}</h5>
                <p className="break-tag">
                  {message.content}
                  <br />
                  {message.creationTime}
                </p>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
