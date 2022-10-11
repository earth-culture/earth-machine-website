export const getToken = () => {
  return window.localStorage.getItem("AUTH_TOKEN");
};

export const setToken = (token, expiry) => {
  window.localStorage.setItem("AUTH_TOKEN", token);
  window.localStorage.setItem("AUTH_TOKEN_EXPIRY", expiry);
};

export const removeToken = () => {
  window.localStorage.removeItem("isSignIn");
  window.localStorage.removeItem("cultureId");
  window.localStorage.removeItem("AUTH_TOKEN");
  return window.localStorage.removeItem("AUTH_TOKEN_EXPIRY");
};
