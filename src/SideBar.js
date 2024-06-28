import React, { useEffect, useState } from "react";
import "./SideBar.css";
import { Avatar, IconButton } from "@mui/material";
import {
  Chat,
  DonutLarge,
  MoreVert,
  SearchOutlined,
} from "@mui/icons-material";
import SideBarChat from "./SideBarChat";
import { db } from "./firebase";
import { collection, onSnapshot } from 'firebase/firestore';
import { useStateValue } from "./StateProvider";


const SideBar = () => {

  const [rooms,setRooms] = useState([])
  const [{user}] = useStateValue()

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'rooms'), (snapshot) => {
      setRooms(snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data(),
      })));
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <Avatar src={user?.photoURL}/>
        <div className="sidebar__headerRight">
          <IconButton>
            <DonutLarge />
          </IconButton>
          <IconButton>
            <Chat />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchOutlined />
          <input placeholder="Search or start new chat" type="text" />
        </div>
      </div>
      <div className="sidebar__chats">
        <SideBarChat addNewChat/>
          {
            rooms.map(room =>(
              <SideBarChat key={room.id} id={room.id} name={room.data.name} />
            ))
          }
      </div>
    </div>
  );
};

export default SideBar;
