import React from "react";
import "./App.css";
import Chat from "./Chat";
import SideBar from "./SideBar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import { useStateValue } from "./StateProvider";

function App() {
  const [{ user }] = useStateValue();

  return (
    <div className="app">
      {!user ? (
        <Login />
      ) : (
        <div className="app__body">
          <Router>
            <SideBar />
            <Routes>
              <Route path="/rooms/:roomId" element={<Chat />} />
              <Route path="/" />
            </Routes>
          </Router>
        </div>
      )}
    </div>
  );
}

export default App;
