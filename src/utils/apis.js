import server from "./server";
import axios from "axios";
import {getToken} from "./token";
// const config = {
//   headers: {
//     AUTH_TOKEN: getToken(),
//   },
// };

export function verifyUserNameIsAvailable(username, setScreen) {
  server
    .get(`/Account/VerifyUsernameIsAvailable`, {params: username})
    .then((result) => {
      if (result.data.USERNAME_AVAILABLE == "false")
        alert(`Server says this username/email is  NOT AVAILABLE`);
      if (result.data.USERNAME_AVAILABLE == "true") {
        sendVerificationCodeOnEmail({USERNAME: username.USERNAME});
        setScreen((prevState) => {
          return {
            ...prevState,
            codeScreen: true,
          };
        });
        return true;
      } else {
        return false;
      }
    })
    .catch((err) => {
      alert(JSON.stringify(err.response.data));
      return;
    });
}
export function verifyCultureIdIsAvailable(cultureId, setScreen) {
  server
    .get(`/Account/VerifyCultureIDIsAvailable`, {params: cultureId})
    .then((result) => {
      if (result.data.CULTURE_ID_AVAILABLE == "false") {
        alert(`Server says this culture_id is NOT AVAILABLE`);
        return false;
      }
      if (result.data.CULTURE_ID_AVAILABLE == "true") {
        setScreen((prevState) => {
          return {
            ...prevState,

            culturalIdScreen: false,
            emailActionScreen: true,
          };
        });
        return true;
      } else {
        return false;
      }
    })
    .catch((err) => {
      alert(JSON.stringify(err.response.data));
    });
}
export function createAccount(data, nevigate) {
  server
    .post(`/Account/CreateAccount`, data)
    .then((result) => {
      if (result.data.RESULT == "success") {
        alert("User created.");
        nevigate("/", {replace: true});
      }
      if (result.data.ERROR) {
        alert(JSON.stringify(`${result.data.ERROR}`));
      }
    })
    .catch((err) => {});
}
export function sendVerificationCodeOnEmail(email) {
  server
    .post(`/Account/RegisterUsernameForVerification`, email)
    .then((result) => {
      if (result.data.RESULT == "success") {
        alert("This email is Available and a verification code has been sent to your email.");
      }
      if (result.data.ERROR) {
        alert(JSON.stringify(`${result.data.ERROR}`));
      }
    })
    .catch((err) => {
      // if (err.data.ERROR == "success") {
      //   alert("his email is Available and a verification code has been sent to you email.");
      // }
    });
}

export function verifyVerificationKey(key, setScreen) {
  server
    .put(`/Account/ValidateUsernameVerificationKey`, key)
    .then((result) => {
      if (result.data.RESULT == "success") {
        alert("Email has been verified.");
        setScreen((prevState) => {
          return {
            ...prevState,
            emailScreen: false,
            codeScreen: false,
            passwordScreen: true,
          };
        });
      }
      if (result.data.ERROR) {
        alert(JSON.stringify(`${result.data.ERROR}`));
      }
    })
    .catch((err) => {
      alert("Something happen internally please try again ");
    });
}

export async function fetchPosts(getAllPosts, setFetchPosts, isHeader, getAllTopPosts) {
  try {
    if (isHeader) {
      const config = {
        headers: {
          AUTH_TOKEN: getToken(),
        },
      };
      const result = await server.get("Feed/GetFeed", config);

      getAllPosts(result.data.posts);

      getAllTopPosts(result.data.topPosts);
      setFetchPosts(false);
      return result;
    } else {
      const result = await server.get("Feed/GetFeed");
      // console.log("all post without header************: ", result);
      getAllPosts(result.data.posts);

      getAllTopPosts(result.data.topPosts);

      setFetchPosts(false);
      return result;
    }
  } catch (error) {
    alert("Error while fetichng feed please login again");
  }
}

export async function createPost(data, reset, getNewPosts) {
  try {
    const config = {
      headers: {
        AUTH_TOKEN: getToken(),
      },
    };
    const result = await server.post(
      "Feed/CreatePost",
      {
        POST_TEXT: data,
      },
      config
    );
    // result && alert("Post successfully created!");

    getNewPosts(true);
    reset();
  } catch (error) {
    error && alert(JSON.stringify(`${error.response.data.ERROR}`));
  }
}

export async function upvotePost(postId, setFetchPosts) {
  try {
    const config = {
      headers: {
        AUTH_TOKEN: getToken(),
      },
    };
    const result = await server.post("Feed/UpvotePost", {POST_ID: postId}, config);
    // result && alert(JSON.stringify(result.data));
    if (result) {
      setFetchPosts(true);
    }
    return result;
  } catch (error) {
    setFetchPosts(false);
    error && alert(JSON.stringify(error.response.data));
  }
}

export async function getAccountInfo(ctx) {
  try {
    const config = {
      headers: {
        AUTH_TOKEN: getToken(),
      },
    };
    const result = await server.get("Account/GetAccountInfo", config);
    console.log("getAccountInfo: ", result);
    if (result.status === 200) {
      ctx.onCulture(result.data.CULTURE_ID);
      window.localStorage.setItem("cultureId", result.data.CULTURE_ID);
    }
    return result;
  } catch (error) {
    error && alert(JSON.stringify(error.response.data));
  }
}

export async function createComment(data, reset, getNewPosts) {
  try {
    const config = {
      headers: {
        AUTH_TOKEN: getToken(),
      },
    };
    const result = await server.post("Feed/CreateComment", data, config);

    reset();
    getNewPosts(true);

    return result;
  } catch (error) {
    console.log("error: ", error);
    error && alert(JSON.stringify(error.response.data));
  }
}

export async function upvoteComent(data, setFetchPosts) {
  try {
    const config = {
      headers: {
        AUTH_TOKEN: getToken(),
      },
    };
    const result = await server.post("Feed/UpvoteComment", data, config);
    console.log("result: ", result);
    // result && alert(JSON.stringify(result.data));

    if (result) {
      setFetchPosts(true);
    }
    return result;
  } catch (error) {
    setFetchPosts(false);
    error && alert(JSON.stringify(error.response.data));
  }
}

export async function deleteUpvoteComent(data, setFetchPosts) {
  console.log("data: ", data);
  try {
    const config = {
      headers: {
        AUTH_TOKEN: getToken(),
      },
    };
    const result = await server.delete("Feed/DeleteCommentUpvote", {
      headers: config.headers,
      params: data,
    });
    console.log("result: ", result);
    // result && alert(JSON.stringify(result.data));
    if (result) {
      setFetchPosts(true);
    }
    return result;
  } catch (error) {
    setFetchPosts(false);
    error && alert(JSON.stringify(error.response.data));
  }
}

export async function deleteUpvotePost(data, setFetchPosts) {
  console.log("data: ", data);
  try {
    const config = {
      headers: {
        AUTH_TOKEN: getToken(),
      },
    };
    const result = await server.delete("Feed/DeletePostUpvote", {
      headers: config.headers,
      params: data,
    });

    // result && alert(JSON.stringify(result.data));
    if (result) {
      setFetchPosts(true);
    }
    return result;
  } catch (error) {
    setFetchPosts(false);
    error && alert(JSON.stringify(error.response.data));
  }
}

export async function getCultureIDAutocompleteData(prefix) {
  try {
    const result = await server.get("Messaging/GetCultureIDAutoCompleteData", {params: {PREFIX: prefix}});
    if (result) {
      let AUTO_COMPLETE_RESULTS = [];
      AUTO_COMPLETE_RESULTS = result.data.AUTO_COMPLETE_RESULTS;
      return AUTO_COMPLETE_RESULTS;
    }
  } catch (error) {
    error && alert(JSON.stringify(`${error.response.data.ERROR}`));
  }
}

export async function getAllConversation() {
  try {
    const config = {
      headers: {
        AUTH_TOKEN: getToken(),
      },
    };
    const result = await server.get("Messaging/GetConversations", config);
    return result.data;
  } catch (error) {
    error && alert(JSON.stringify(error.response.data));
  }
}

export async function getDetailedConversation(params) {
  try {
    const config = {
      headers: {
        AUTH_TOKEN: getToken(),
      },
      params,
    };
    const result = await server.get("Messaging/GetDetailedConversation", config);
    return result?.data;
  } catch (error) {
    error && alert(JSON.stringify(error.response.data));
  }
}

export async function createMessage(data, reset) {
  try {
    const config = {
      headers: {
        AUTH_TOKEN: getToken(),
      },
    };
    const result = await server.post("Messaging/CreateMessage", data, config);
    console.log("created message: ", result);
    // result && alert("Post successfully created!");

    reset();
    return result?.data;
  } catch (error) {
    error && alert(JSON.stringify(`${error.response.data.ERROR}`));
    return null;
  }
}
