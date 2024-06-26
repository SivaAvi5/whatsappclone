import React, { useEffect, useState } from 'react'
import './SideBarChat.css'
import { Avatar } from '@mui/material'

const SideBarChat = ({addNewChat}) => {
    const [seed, setSeed] = useState('')

    useEffect(() =>{
        setSeed(Math.floor(Math.random()*5000))
    },[])

    const createChat = () =>{
        const roomName= prompt("Please enter name")
        if(roomName){}
    }

  return !addNewChat ? (
    <div className='sidebarChat'>
        <Avatar src={`https://robohash.org/${seed}`}/>
        <div className='sidebarChat__info'>
            <h2>Room name</h2>
            <p>Last message...</p>
        </div>
    </div>
  ):(
    <div onClick={createChat} className='sidebarChat'>
        <h2>Add new chat</h2>
    </div>
  )
}

export default SideBarChat