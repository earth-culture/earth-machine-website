import React, {useContext, useState, useEffect} from "react";
import {Link, Outlet} from "react-router-dom";
import AuthContext from "../store/auth-context";
import Feed from "./Feed";
import {getCultureIDAutocompleteData} from "../utils/apis";
import PrivateChat from "./PrivateChat";
const Layout = () => {
  const ctx = useContext(AuthContext);
  const [isChat, setChat] = useState(false);
  function toggleChatScreen() {
    setChat((prevState) => !prevState);
  }

  return (
    <div style={{margin: "8px", padding: "8px"}}>
      <div style={{display: "flex", justifyContent: "space-between", flexDirection: "row"}}>
        <p>welcome to culture earth</p>
        <div>
          {ctx.isSignIn && <p> Logged in as[ {ctx.cultureId} ]</p>}

          {ctx.isSignIn && <button onClick={() => ctx.onLogout()}>Logout</button>}
        </div>
      </div>
      <br />
      <div className="space">
        <p>
          Our canvas begins here. let's build a future we want <br />
          via an open-source,transparent, incentivized war of the best ideas, bytes, and atoms <br />
          we believe in the humans of planet earth
        </p>
        {ctx.isSignIn && (
          <div>
            {isChat ? (
              <h4 onClick={toggleChatScreen} className="conversation">
                Return to Ideas:
              </h4>
            ) : (
              <h4 onClick={toggleChatScreen} className="conversation">
                Start Conversation:
              </h4>
            )}
          </div>
        )}
      </div>

      <p>
        more info: <br />
        cultures (video, text) <br />
        culture earth (video, text) <br />
        code{" "}
        <a href="https://github.com/earth-culture/earth-machine" target={"_blank"}>
          GitHub
        </a>
      </p>
      {!ctx.isSignIn && (
        <div>
          <Link to="signup">
            <button id="joinScreen" className="btn">
              Join
            </button>
          </Link>
          <Link to="login">
            <button id="enterLoginScreen" className="btn">
              Enter
            </button>
          </Link>
        </div>
      )}
      <Outlet />
      {isChat && ctx.isSignIn ? <PrivateChat /> : <Feed isChat={isChat} />}
    </div>
  );
};

export default Layout;
