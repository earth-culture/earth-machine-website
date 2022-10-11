import React, {useEffect, useState} from "react";
import {IoCaretUpOutline} from "react-icons/io5";
import {GrFormClose} from "react-icons/gr";
import {BiUpArrow} from "react-icons/bi";
import {FaRegComment} from "react-icons/fa";

export default function Post({
  posts,
  handleCreatePost,
  handleUpvote,
  handleCommentSection,
  handleDeleteUpvotePost,
  selectedPost,
}) {
  const [post, setPost] = useState("");
  const handlePost = (e) => {
    setPost(e.target.value);
  };
  function reset() {
    setPost("");
  }
  // useEffect(() => {
  //   //
  // }, [posts, post]);

  return (
    <>
      <div className="left">
        <h4>add to the idea pool :)</h4>
        <textarea
          name="text"
          id="text"
          cols={30}
          rows={2}
          className="inpt"
          value={post}
          onChange={handlePost}
          maxLength={500}
        />
        {/* <input type="text" class="inpt" /> */}
        <br />
        <div className="row">
          <button type="submit" className="post-btn" onClick={() => handleCreatePost(post, reset)}>
            Submit
          </button>
          <p>{post.length}/500</p>
        </div>
      </div>
      <div className="left break-tag ">
        <h4>idea pool</h4>
        <br />
        {posts.map((post) => (
          <div
            key={post.postID}
            className={`post-spacing  icon-span ${
              Object.keys(selectedPost).length !== 0 && post.postID === selectedPost.postID
                ? "selected-post"
                : "active-post"
            }`}
            onClick={() => handleCommentSection(post)}
          >
            <h5>{post.cultureID}</h5>
            <p className="break-tag">
              {post.content}
              <br />
              {post.creationTime}
            </p>
            <div className="action">
              <div className="upvote">
                <span
                  className="icon-span"
                  onClick={() =>
                    post.likedByUser === "T" ? handleDeleteUpvotePost(post.postID) : handleUpvote(post)
                  }
                >
                  {post.likedByUser === "T" ? <IoCaretUpOutline /> : <BiUpArrow />}
                </span>
                <span>{post.upvotes}</span>
              </div>
              <div className="upvote">
                <span className="icon-span">
                  <FaRegComment />
                </span>
                <span>{post.comments.length}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
