import React, { useEffect, useState } from "react";
import "./SideBarChat.css";
import { Avatar } from "@mui/material";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import { Link } from "react-router-dom";

const SideBarChat = ({ addNewChat, id, name }) => {
  const [seed, setSeed] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (id) {
      const messagesRef = collection(db, "rooms", id, "messages");
      const messagesQuery = query(messagesRef, orderBy("timestamp", "desc"));

      const unsubscribe = onSnapshot(messagesQuery, (snapshot) =>
        setMessages(snapshot.docs.map((doc) => doc.data()))
      );

      return () => unsubscribe();
    }
  }, [id]);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);

  const createChat = async () => {
    const roomName = prompt("Please enter name for chat room");
    if (roomName) {
      try {
        await addDoc(collection(db, "rooms"), {
          name: roomName,
        });
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  };

  return !addNewChat ? (
    <Link to={`/rooms/${id}`}>
      <div className="sidebarChat">
        <Avatar src={`https://robohash.org/${seed}`} />
        <div className="sidebarChat__info">
          <h2>{name}</h2>
          {messages[0]?.message?.length > 20 ? (
            <p>{`${(messages[0]?.message).slice(0, 18)}...`}</p>
          ) : (
            <p>{`${messages[0]?.message}`}</p>
          )}
        </div>
      </div>
    </Link>
  ) : (
    <div onClick={createChat} className="sidebarChat">
      <h2>Add new chat</h2>
    </div>
  );
};

export default SideBarChat;
