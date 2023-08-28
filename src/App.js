
import React from "react";
import SignUp from "./signup";
import SignIn from "./login";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./Home";
import Admin from "./admin_login";
import Detail from "./Details";
function App() {
  return (
    
    <div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
       
        <Route path="/signup" element={<SignUp />} />
        <Route path="/Home" element={<Home/>} />
        <Route path="/task/new/:taskId" element={<Detail/>} />
        <Route path="/admin_login" element={<Admin />} />
        
        
      </Routes>
    </BrowserRouter>
  </div>
  );
}

export default App;
