import React, {useEffect, useState} from "react";
import {IoCaretUpOutline} from "react-icons/io5";
import {GrClose} from "react-icons/gr";
import {BiUpArrow} from "react-icons/bi";
import {FaRegComment} from "react-icons/fa";

const Comments = ({
  // comment,
  // handleComment,
  // reset,
  selectedComment,
  handleCreateComment,
  handleUpvoteComment,
  handleDeleteUpvoteComment,
  handleCommentVisibility,
}) => {
  const [comment, setComment] = useState("");

  const handleComment = (e) => {
    setComment(e.target.value);
  };
  function reset() {
    setComment("");
  }

  // useEffect(() => {
  //   console.log("comment: ", comment);
  // }, [comment]);

  return (
    <>
      <div className="midle">
        <div style={{display: "flex", justifyContent: "space-between", flexDirection: "row"}}>
          <h4>comment on selected idea</h4>
          <span className="icon-span" onClick={handleCommentVisibility}>
            <GrClose />
          </span>
        </div>
        <textarea
          name="text"
          id="text"
          cols={30}
          rows={2}
          className="inpt"
          onChange={handleComment}
          maxLength={500}
          value={comment}
        />

        <br />
        <div className="row">
          <button type="submit" className="post-btn" onClick={() => handleCreateComment(comment, reset)}>
            Submit
          </button>
          <p>{comment.length}/500</p>
        </div>
      </div>
      <div className="midle break-tag">
        <h4>selected idea</h4>
        <br />
        <h5>{selectedComment.cultureID}</h5>
        <p>
          {selectedComment.content}
          <br />
          {selectedComment.creationTime}
        </p>
      </div>

      <div className="midle break-tag">
        <h4>comments</h4>
        <br />
        {selectedComment.comments &&
          selectedComment.comments.map((comment) => (
            <div key={comment.commentID} className=" post-spacing active-post">
              <h5>{comment.cultureID}</h5>
              <p className="break-tag">
                {comment.content}
                <br />
                {comment.creationTime}
              </p>
              <div className="">
                <div className="upvote">
                  <span
                    className="icon-span"
                    onClick={() =>
                      comment.likedByUser === "T"
                        ? handleDeleteUpvoteComment(comment.commentID)
                        : handleUpvoteComment(comment)
                    }
                  >
                    {comment.likedByUser === "T" ? <IoCaretUpOutline /> : <BiUpArrow />}
                  </span>
                  <span>{comment.upvotes}</span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default Comments;
