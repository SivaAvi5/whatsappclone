import React, { useEffect, useState } from "react";
import "./Chat.css";
import { Avatar, IconButton } from "@mui/material";
import {
  AttachFile,
  InsertEmoticon,
  Mic,
  MoreVert,
  SearchOutlined,
} from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { db } from "./firebase";
import {
  doc,
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useStateValue } from "./StateProvider";

const Chat = () => {
  const [seed, setSeed] = useState("");
  const [input, setInput] = useState("");
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState();
  const [messages, setMessages] = useState([]);
  const [{user}, dispatch] = useStateValue()

  useEffect(() => {
    if (roomId) {
      const unsubscribe = onSnapshot(doc(db, "rooms", roomId), (snapshot) => {
        setRoomName(snapshot.data().name);
      });

      const messagesQuery = query(
        collection(db, "rooms", roomId, "messages"),
        orderBy("timestamp", "asc")
      );

      const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
        setMessages(snapshot.docs.map((doc) => doc.data()));
      });

      return () => {
        unsubscribe();
        unsubscribeMessages();
      };
    }
  }, [roomId]);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, [roomId]);

  const sendMessage = async(e) => {
    e.preventDefault();

    if (roomId && input) {
      await addDoc(collection(db, "rooms", roomId, "messages"), {
        message: input,
        name: user.displayName,
        timestamp: serverTimestamp(),
      });
      setInput("");
    }
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar src={`https://robohash.org/${seed}`} />
        <div className="chat__headerInfo">
          <h3>{roomName}</h3>
          <p>last seen{" "}{
            new Date(
              messages[messages.length-1]?.timestamp?.toDate()
            ).toUTCString()
          }</p>
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
        {messages.map((message,index) => (
          <p key={index} className={`chat__message ${message.name === user.displayName && "chat__reciever"}`}>
            <span className="chat__name">{message.name}</span>
            {message.message}
            <span className="chat__timestamp">
              {new Date(message.timestamp?.toDate()).toUTCString()}
            </span>
          </p>
        ))}
      </div>

      <div className="chat__footer">
        <InsertEmoticon />
        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
            type="text"
          />
          <button onClick={sendMessage}>Send</button>
          <Mic />
        </form>
      </div>
    </div>
  );
};

export default Chat;
