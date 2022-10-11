import React from "react";
import {IoCaretUpOutline} from "react-icons/io5";
import {GrFormClose} from "react-icons/gr";
import {BiUpArrow} from "react-icons/bi";
import {FaRegComment} from "react-icons/fa";
const TopIdeas = ({topPosts, handleUpvote, handleDeleteUpvotePost}) => {
  return (
    <div className="right">
      <div className="hide">
        <h4>add to the idea pool :)</h4>
        <textarea name="text" id="text" cols={30} rows={2} className="inpt" defaultValue={""} />
        <br />
        <div className="row">
          <button type="submit" className="post-btn">
            Submit
          </button>
          <p>0/500</p>
        </div>
      </div>
      <div className="break-tag">
        <h4>top ideas</h4>
        <br />
        {topPosts.map((post) => (
          <div key={post.postID} className=" post-spacing active-post">
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
                  onClick={() => {
                    post.likedByUser === "T" ? handleDeleteUpvotePost(post.postID) : handleUpvote(post);
                  }}
                >
                  {post.likedByUser === "T" ? <IoCaretUpOutline /> : <BiUpArrow />}
                </span>
                <span>{post.upvotes}</span>
              </div>
              <div className="upvote">
                <span style={{margin: "0px  4px"}}>
                  <FaRegComment />
                </span>
                <span>{post.comments.length}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopIdeas;
