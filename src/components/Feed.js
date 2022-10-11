import React, {useEffect, useState, useContext} from "react";
import "./Feed.css";
import {IoCaretUpOutline} from "react-icons/io5";
import {GrFormClose} from "react-icons/gr";
import {BiUpArrow} from "react-icons/bi";
import {
  fetchPosts,
  createPost,
  upvotePost,
  createComment,
  upvoteComent,
  deleteUpvotePost,
  deleteUpvoteComent,
} from "../utils/apis";
import AuthContext from "../store/auth-context";
import Post from "./Post";
import Comments from "./Comments";
import TopIdeas from "./TopIdeas";
const Feed = ({isChat}) => {
  const ctx = useContext(AuthContext);
  const [posts, getAllPosts] = useState([]);
  const [topPosts, getAllTopPosts] = useState([]);
  const [isCommentVisible, setCommentVisible] = useState(false);
  // const [comment, setComment] = useState("");
  // const handleComment = (e) => {
  //   setComment(e.target.value);
  // };
  // function resetComent() {
  //   setComment("");
  // }

  const [isFetchPosts, setFetchPosts] = useState(false);

  const [commentSection, setCommentSection] = useState({});

  function restCommentSection() {
    setCommentSection({});
    setCommentVisible(false);
  }
  function handleCommentSection(selectedPost) {
    setCommentSection(selectedPost);
    setCommentVisible(true);
  }
  const handleCreatePost = (post, reset) => {
    if (!ctx.isSignIn) {
      alert("You must be logged in, inorder to create post!");
      return;
    }
    if (post) {
      createPost(post, reset, setFetchPosts);
    }
  };

  const handleCreateComment = (comment, reset) => {
    if (!ctx.isSignIn) {
      alert("You must be logged in, to create comment on post!");
      return;
    }
    if (comment) {
      let data = {
        COMMENT_TEXT: comment,
        POST_ID: commentSection.postID,
      };
      createComment(data, reset, setFetchPosts);
    } else {
      return;
    }
  };
  useEffect(() => {
    if (isFetchPosts) {
      console.log(" isFetchPosts executed");
      fetchPosts(getAllPosts, setFetchPosts, ctx.isSignIn, getAllTopPosts);
    } else if (!ctx.isSignIn) {
      console.log(" ctx.isSignIn executed");

      fetchPosts(getAllPosts, setFetchPosts, ctx.isSignIn, getAllTopPosts);
    } else if (!isChat) {
      console.log("isChat from feed: ", isChat);

      fetchPosts(getAllPosts, setFetchPosts, ctx.isSignIn, getAllTopPosts);
    }
    if (!ctx.isSignIn) {
      setCommentSection({});
      console.log("setCommentSection: executed");
    }
  }, [isFetchPosts, ctx.isSignIn]);
  useEffect(() => {
    // console.log("posts: ", posts);
    // setFetchPosts(false);
    if (Object.keys(commentSection).length !== 0) {
      let filteredComents = posts.filter((post) => post.postID == commentSection.postID);
      let filterobj = filteredComents[0];
      // console.log("filterobj: ", filterobj);
      if (Object.keys(filterobj).length !== 0) {
        setCommentSection(filterobj);
      }
    }
    // console.log("commentSection: ", commentSection);
  }, [posts, commentSection]);

  function handleUpvote(post) {
    if (!ctx.isSignIn) {
      alert("You must be logged in, inorder to upvote a post!");
      return;
    }

    upvotePost(post.postID, setFetchPosts);
  }
  function handleUpvoteComment(comment) {
    if (!ctx.isSignIn) {
      alert("You must be logged in,to upvote a comment!");
      return;
    }

    upvoteComent({COMMENT_ID: comment.commentID, POST_ID: comment.parentPostID}, setFetchPosts);
  }
  function handleDeleteUpvotePost(postid) {
    if (!ctx.isSignIn) {
      alert("You must be logged in,to remove upvote from a post!");
      return;
    }

    deleteUpvotePost({POST_ID: postid}, setFetchPosts);
  }
  function handleDeleteUpvoteComment(cmntid) {
    if (!ctx.isSignIn) {
      alert("You must be logged in,to remove upvote from a coment!");
      return;
    }

    deleteUpvoteComent({COMMENT_ID: cmntid}, setFetchPosts);
  }
  return (
    <div className="container">
      <div className="column">
        <Post
          posts={posts}
          selectedPost={commentSection}
          handleCreatePost={handleCreatePost}
          handleUpvote={handleUpvote}
          handleCommentSection={handleCommentSection}
          handleDeleteUpvotePost={handleDeleteUpvotePost}
        />
      </div>
      <div className={`column border ${!isCommentVisible ? "hide" : ""} `}>
        <Comments
          selectedComment={commentSection}
          // comment={comment}
          // handleComment={handleComment}
          // reset={resetComent}
          handleCreateComment={handleCreateComment}
          handleUpvoteComment={handleUpvoteComment}
          handleDeleteUpvoteComment={handleDeleteUpvoteComment}
          handleCommentVisibility={restCommentSection}
        />
      </div>
      <div className="column">
        <TopIdeas
          topPosts={topPosts}
          handleUpvote={handleUpvote}
          handleDeleteUpvotePost={handleDeleteUpvotePost}
        />
      </div>
    </div>
  );
};

export default Feed;

// return (
//   <div className="container">
//     <div>
//       <h4>Carl</h4>
//       <input type="text" className="inpt" value={post} onChange={handlePost} />
//       <br />
//       <div className="row">
//         <button type="submit" className="post-btn" onClick={handleCreatePost}>
//           Submit
//         </button>
//         <p>0/300</p>
//       </div>
//     </div>
//     <br />
//     <div className="center">
//       <div className="left-side">
//         <h4>Live</h4>
//         <br />
//         <div>
//           {[...posts].map((post, index) => (
//             <div key={post.postID} style={{margin: "4px 0px", padding: "4px 0px"}}>
//               <h4 style={{margin: "3px 0px"}}>{post.cultureID}</h4>
//               <p>
//                 {post.content}

//                 <br />
//                 <span style={{display: "inline-block", margin: "5px 0px"}}>{post.creationTime}</span>
//               </p>
//               <div className="upvote">
//                 <span
//                   onClick={() => {
//                     handleUpvote(post);
//                   }}
//                   className="icon-span"
//                 >
//                   {post.likedByUser === "T" ? <IoCaretUpOutline /> : <BiUpArrow />}
//                 </span>
//                 <span style={{display: "inline-block", padding: "0px 8px"}}>{post.upvotes}</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//       <br />

//       <br />
//       <div className="right-side">
//         <h4>Top ideas</h4>
//         <br />
//         <h5>Chris</h5>
//         <p>
//           hi everyone! what should we build next? <br />
//           6:20pm Jun 15 2022
//         </p>
//         <IoCaretUpOutline />
//       </div>
//     </div>
//   </div>
// );
