import React, {useState} from "react";
import {Outlet} from "react-router-dom";
import {useNavigate} from "react-router-dom";

import {
  createAccount,
  verifyCultureIdIsAvailable,
  verifyUserNameIsAvailable,
  verifyVerificationKey,
} from "../utils/apis";
const Signup = () => {
  let navigate = useNavigate();

  const [screens, setScreens] = useState({
    joinScreen: false,
    emailScreen: true,
    codeScreen: false,
    passwordScreen: false,
    culturalIdScreen: false,
    emailActionScreen: false,
    privateKeyScreen: false,
  });
  const [error, setError] = useState(false);

  const [errmsg, setErrorMsg] = useState("required*");
  const [userInput, setInput] = useState({
    emailaddress: "",
    code: "",
    password: "",
    reEnterpassword: "",
    culturalId: "",
  });

  function handleInput(e, key) {
    setInput({
      ...userInput,
      [key]: e.target.value,
    });
  }

  function resetForm() {
    setInput({
      emailaddress: "",
      code: "",
      password: "",
      reEnterpassword: "",
      culturalId: "",
    });
  }
  function handleEmailScreen() {
    if (!userInput.emailaddress) {
      setError(true);
    } else {
      setError(false);
      verifyUserNameIsAvailable({USERNAME: userInput.emailaddress}, setScreens);
    }
  }
  function handleCode() {
    if (!userInput.code) {
      setError(true);
    } else {
      setError(false);
      verifyVerificationKey({USERNAME: userInput.emailaddress, VERIFICATION_KEY: userInput.code}, setScreens);
    }
  }
  function handlePassword() {
    if (!(userInput.password && userInput.reEnterpassword)) {
      setError(true);
      return;
    } else if (
      (userInput.password && userInput.password.length < 8) ||
      (userInput.reEnterpassword && userInput.reEnterpassword.length < 8)
    ) {
      setError(true);
      setErrorMsg("password should be at least  8 digit long");
      return;
    } else if (userInput.password != userInput.reEnterpassword) {
      setError(true);
      setErrorMsg("password should be matched");
      return;
    } else {
      setError(false);
      setScreens({...screens, passwordScreen: false, culturalIdScreen: true});
    }
  }
  function handleCultureId() {
    if (!userInput.culturalId) {
      setError(true);
      return;
    } else {
      setError(false);

      verifyCultureIdIsAvailable({CULTURE_ID: userInput.culturalId}, setScreens);
    }
  }
  function handleCreateAccount() {
    createAccount(
      {
        USERNAME: userInput.emailaddress,
        CULTURE_ID: userInput.culturalId,
        PASSWORD: userInput.password,
      },
      navigate
    );
    setErrorMsg("required*");
    resetForm();
  }
  return (
    <div id="signupScreen">
      {screens["emailScreen"] && (
        <div id="emailScreen">
          <p>
            choose how much personal info is stored (can be none), just need to confirm you are a human
            first...blink twice (kidding) <br />
            enter email address to recieve code. nothing else will be sent here , you can choose for address
            to be deleted after
          </p>
          <label htmlFor="emailaddress">Email address:</label> <br />
          <input
            value={userInput.emailaddress}
            required
            type="text"
            name="emailaddress"
            id="emailaddress"
            onChange={(e) => handleInput(e, "emailaddress")}
          />
          {error && (
            <p id="emailaddress-error" style={{color: "red"}}>
              {errmsg}
            </p>
          )}
          <br />
          <button className="btn" onClick={handleEmailScreen} type="submit">
            Submit
          </button>
        </div>
      )}
      {screens["codeScreen"] && (
        <div id="codeScreen">
          <label htmlFor="code">Code:</label> <br />
          <input
            value={userInput.code}
            type="text"
            name="code"
            id="code"
            onChange={(e) => handleInput(e, "code")}
          />
          <br />
          {error && (
            <p id="code-error" style={{color: "red"}}>
              {errmsg}
            </p>
          )}
          <button onClick={handleCode} type="submit">
            Submit
          </button>
        </div>
      )}
      {/* remove previous ones */}
      {screens["passwordScreen"] && (
        <div id="passwordScreen">
          <label htmlFor="enterpassword">Enter password:</label> <br />
          <input
            value={userInput.password}
            type="password"
            name="enterpassword"
            autoComplete="off"
            id="enterpassword"
            onChange={(e) => handleInput(e, "password")}
          />{" "}
          <br />
          <label htmlFor="re-enterpassword">re-enter password:</label> <br />
          <input
            value={userInput.reEnterpassword}
            type="password"
            name="re-enterpassword"
            autoComplete="off"
            id="re-enterpassword"
            onChange={(e) => handleInput(e, "reEnterpassword")}
          />
          {error && (
            <p id="password-error" style={{color: "red"}}>
              {errmsg}
            </p>
          )}
          <br />
          <button className="btn" onClick={handlePassword} type="submit">
            Submit
          </button>
        </div>
      )}
      {/* Enter password: re-enter password should match  */}
      {/* remove previous ones */}
      {screens["culturalIdScreen"] && (
        <div id="culturalIdScreen">
          <label htmlFor="cultural-id">Enter a cultural id: Carl (must be unique)</label>
          <br />
          <input
            value={userInput.culturalId}
            type="text"
            name="culturalId"
            id="cultural-id"
            onChange={(e) => handleInput(e, "culturalId")}
          />{" "}
          <br />
          {error && (
            <p id="cultural-error" style={{color: "red"}}>
              {errmsg}
            </p>
          )}
          <button className="btn" onClick={handleCultureId} type="submit">
            Submit
          </button>
        </div>
      )}
      {/* remove previous ones */}
      {screens["emailActionScreen"] && (
        <div id="emailActionScreen">
          <p>
            If you'd like to delete any record of your email address, you can use your culture id to enter the
            culture <br />
            however, if you choose to delete email address, there will be no way to enter culture if you
            forget your culture id or password (!!!)
          </p>
          <button onClick={() => {}} className="btn">
            Delete Email address
          </button>
          <button className="btn" onClick={handleCreateAccount}>
            Save Email address
          </button>
        </div>
      )}
      {/* remove all including itself  */}
      {screens["privateKeyScreen"] && (
        <div id="privateKeyScreen">
          <p>
            For additional secuirty, you may choose to require a private key (25 alphanumeric code) for each
            of your culture transactions <br />
            you are the only person who will have this key (we delete it immediatly after generation) <br />
            this decision can not be reversed. if private key is lost, there will be no way to transact your
            culture tokens assests (!!!)
          </p>
          <button className="btn" onclick="submit('privateKeyScreen', true)">
            Required private key
          </button>
          <button className="btn" onclick="loginScreen()">
            No private key
          </button>
        </div>
      )}
      <Outlet />
    </div>
  );
};

export default Signup;
