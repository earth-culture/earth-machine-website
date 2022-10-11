import React, {useState, useEffect, useContext} from "react";
import {Outlet} from "react-router-dom";
import server from "../utils/server";
import {validateEmail} from "../utils/helper";
import {setToken} from "../utils/token";
import AuthContext from "../store/auth-context";
import {useNavigate} from "react-router-dom";
import {getAccountInfo} from "../utils/apis";
async function validateLogin(data, ctx, navigate) {
  try {
    const result = await server.post(`Account/ValidateLogin`, data);

    if (result.data.RESULT) {
      const {AUTH_TOKEN, AUTH_TOKEN_EXPIRY} = result.data;
      setToken(AUTH_TOKEN, AUTH_TOKEN_EXPIRY);
      ctx.onLogin(true);
      navigate("/", {replace: true});
    }
    return true;
  } catch (err) {
    console.log("err: ", err);
    err && alert(JSON.stringify(err.response.data));
    return false;
  }
}
const Login = () => {
  let navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const ctx = useContext(AuthContext);
  const [error, setError] = useState({
    require: false,
    eightDigit: false,
  });
  function resetForm() {
    setEmail("");
    setPassword("");
    setError({
      require: false,
      eightDigit: false,
    });
  }

  useEffect(() => {
    if (email && password) {
      setError({...error, require: false});
    }
    if (email && password && password.length < 8) {
      setError({require: false, eightDigit: true});
    }
    if (email && password && password.length >= 8) {
      setError({require: false, eightDigit: false});
    }
  }, [email, password]);

  function validateForm() {
    if (!(email && password)) {
      setError((prevState) => {
        return {
          ...prevState,
          require: true,
        };
      });
      return false;
    }

    if (password && password.length < 8) {
      setError({...error, eightDigit: true});
      return false;
    }

    return true;
  }
  async function handleSubmit(e) {
    e.preventDefault();
    let data = {};
    if (validateForm()) {
      if (validateEmail(email)) {
        data = {
          USERNAME: email,
          PASSWORD: password,
        };
      } else {
        data = {
          CULTURE_ID: email,
          PASSWORD: password,
        };
      }

      if (await validateLogin(data, ctx, navigate)) {
        getAccountInfo(ctx);
        resetForm();
      }
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <div id="loginScreen">
        <p id="privatekey-txt" className="d-none">
          Here is your private key : <span> ceu7FguyuweuymOgHAS12 </span>
        </p>
        <label htmlFor="loginEmailaddress">Cultural Id or Email:</label> <br />
        <input
          required
          type="text"
          name="loginEmailaddress"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <br />
        <label htmlFor="loginPassword">Password</label> <br />
        <input
          required
          type="password"
          name="loginPassword"
          autoComplete="off"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        {error.require && <p style={{color: "red"}}>required*</p>}
        {error.eightDigit && <p style={{color: "red"}}>password should be eight digit long*</p>}
        <br />
        <br />
        <button type="submit">Submit</button>
        <Outlet />
      </div>
    </form>
  );
};

export default Login;
