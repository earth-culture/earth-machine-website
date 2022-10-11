import React, {useEffect, useState} from "react";
import {getAllConversation} from "../utils/apis";
import Stack from "@mui/material/Stack";
import RefreshIcon from "@mui/icons-material/Refresh";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

const Conversations = ({selectedChat, onSelectChat}) => {
  const [conversations, setConversations] = useState([]);
  async function handleRefreshConversation() {
    onSelectChat({});
    let result = await getAllConversation();
    if (result && result.conversations.length > 0) {
      setConversations(result.conversations);
    } else {
      setConversations([]);
    }
  }
  useEffect(() => {
    console.log("conversations: ", conversations);
  }, [conversations]);
  useEffect(() => {
    (async () => {
      let result = await getAllConversation();
      console.log("result: ", result);
      if (result && result.conversations.length > 0) {
        console.log("result.conversations: ", result.conversations);
        setConversations(result.conversations);
      } else {
        setConversations([]);
      }
    })();
  }, []);
  return (
    <>
      <div className="midle">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <h4>Conversations</h4>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Refresh Conversation">
              <IconButton color="secondary" aria-label="add an alarm" onClick={handleRefreshConversation}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </div>
        <br />
      </div>

      {conversations?.map((conversation) => (
        <div
          key={conversation.conversationID}
          className="midle break-tag icon-span"
          onClick={() => onSelectChat(conversation)}
        >
          <div
            className={`post-spacing ${
              Object.keys(selectedChat).length !== 0 &&
              conversation.conversationID === selectedChat.conversationID
                ? "selected-post"
                : "active-post"
            }`}
          >
            <h5>{conversation.mostRecentMessage.cultureID}</h5>
            <p className="break-tag">
              {conversation.mostRecentMessage.content}
              <br />
              {conversation.mostRecentMessage.creationTime}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};

export default Conversations;
