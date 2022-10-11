import React, {useEffect} from "react";
import {Routes, Route, useNavigate} from "react-router-dom";
import Layout from "../components/Layout";
import Login from "../components/Login";
import Signup from "../components/Signup";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/", {replace: true});
  }, []);
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Route>
    </Routes>
  );
};

export default Index;
