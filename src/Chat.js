import React, { useEffect, useState } from "react";
import "./Chat.css";
import { Avatar, IconButton } from "@mui/material";
import {
  AttachFile,
  Delete,
  InsertEmoticon,
  Mic,
  MoreVert,
  SearchOutlined,
  Send,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "./firebase";
import {
  doc,
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { useStateValue } from "./StateProvider";

const Chat = () => {
  const [seed, setSeed] = useState("");
  const [input, setInput] = useState("");
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState();
  const [messages, setMessages] = useState([]);
  const [{ user }] = useStateValue();
  const navigate = useNavigate();

  useEffect(() => {
    if (roomId) {
      const unsubscribe = onSnapshot(doc(db, "rooms", roomId), (snapshot) => {
        if (snapshot.exists()) {
          setRoomName(snapshot.data().name);
        } else {
          console.warn("Room not found:", roomId);
          setRoomName("Unknown Room"); // Set a fallback value
        }
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

  const sendMessage = async (e) => {
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

  const deleteRoom = async () => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await deleteDoc(doc(db, "rooms", roomId));
        alert("Room deleted successfully");
        navigate("/"); // Redirect to home or another page after deletion
      } catch (error) {
        console.error("Error deleting room: ", error);
      }
    }
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar src={`https://robohash.org/${seed}`} />
        <div className="chat__headerInfo">
          <h3>{roomName || "Loading..."}</h3>
          <p>
            last seen{" "}
            {messages.length > 0 && messages[messages.length - 1]?.timestamp
              ? new Date(
                  messages[messages.length - 1]?.timestamp?.toDate()
                ).toUTCString()
              : "N/A"}
          </p>
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
          <IconButton onClick={(e) => deleteRoom()}>
            <Delete />
          </IconButton>
        </div>
      </div>

      <div className="chat__body">
        {messages.map((message, index) => (
          <p
            key={index}
            className={`chat__message ${
              message.name === user.displayName && "chat__reciever"
            }`}
          >
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

          <Send onClick={sendMessage} />
          <Mic />
        </form>
      </div>
    </div>
  );
};

export default Chat;
