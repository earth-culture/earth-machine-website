import {Foundation} from "@mui/icons-material";
import React, {useContext, useState, useEffect} from "react";
import "./App.css";
import Routes from "./routes/routes";
import AuthContext from "./store/auth-context";
function App() {
  const ctx = useContext(AuthContext);
  useEffect(() => {
    const loggedInUser = localStorage.getItem("isSignIn");
    const foundUser = JSON.parse(loggedInUser);
    console.log("foundUser: ", foundUser);
    const cultureId = localStorage.getItem("cultureId");
    console.log("==============: ", cultureId);

    if (foundUser) {
      console.log("if part from app js");
      ctx.onLogin(foundUser);
      ctx.onCulture(cultureId);
    } else {
      console.log("else part from app js");
    }
  }, []);
  return <Routes />;
}

export default App;
