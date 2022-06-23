import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Main from "./Main";
import Register from "./Register";
import "./../assets/scss/App.scss";

const App = () => (
  <div className="app">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/entrar" element={<Login />} />
        <Route path="/cadastrar" element={<Register />} />
      </Routes>
    </BrowserRouter>
  </div>
);

export default App;
