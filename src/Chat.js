import React, { useEffect, useState } from "react";
import "./Chat.css";
import { Avatar, IconButton } from "@mui/material";
import { AttachFile, InsertEmoticon, Mic, MoreVert, SearchOutlined } from "@mui/icons-material";

const Chat = () => {
  const [seed, setSeed] = useState("");
  const [input, setInput] = useState('')

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);

  const sendMessage = (e) =>{
    e.preventDefault()
    console.log(input)
    setInput("")
  }

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar src={`https://robohash.org/${seed}`} />
        <div className="chat__headerInfo">
          <h3>Room name</h3>
          <p>Last seen at ...</p>
        </div>
        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className="chat__body">
        <p className={`chat__message ${true && "chat__reciever"}`}>
          <span className="chat__name">Siva</span>
          Hey dude
          <span className="chat__timestamp">10:00pm</span>
        </p>
      </div>
      <div className="chat__footer">
        <InsertEmoticon />
        <form>
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message" type="text"/>
            <button onClick={sendMessage}>Send</button>
            <Mic />
        </form>
      </div>
    </div>
  );
};

export default Chat;
