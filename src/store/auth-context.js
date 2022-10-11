import {useEffect, useContext, useState, createContext} from "react";
import {removeToken} from "../utils/token";
const AuthContext = createContext({
  isSignIn: false,
  cultureId: null,

  onLogin: () => {},
  onLogout: () => {},
});

export const AuthContextProvider = ({children}) => {
  const [isSignIn, setSignIn] = useState(false);
  const [cultureId, setCultureID] = useState(null);

  function handleLogin(loginState) {
    console.log("loginState: ", loginState);
    setSignIn(loginState);
  }
  function handleCultrueId(id) {
    setCultureID(id);
  }
  function handleLogout() {
    setSignIn(false);
    setCultureID(null);
    removeToken();
  }

  // state persistent using local storage
  useEffect(() => {
    window.localStorage.setItem("isSignIn", isSignIn);
  }, [isSignIn]);

  return (
    <>
      <AuthContext.Provider
        value={{
          isSignIn,
          cultureId,
          onCulture: handleCultrueId,
          onLogin: handleLogin,
          onLogout: handleLogout,
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
};
export default AuthContext;
