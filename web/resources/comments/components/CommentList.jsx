import React from "react";
import PropTypes from "prop-types";

// import components
import Comment from "./Comment.jsx";

const CommentList = ({ comments = [] }) => {
  return comments.map((comment) => (
    <Comment
      key={comment._id}
      id={comment._id}
      content={comment.content}
      author={{ ...comment._user }}
      created={comment.created}
    />
  ));
};

CommentList.propTypes = {
  comments: PropTypes.array,
};

export default CommentList;
