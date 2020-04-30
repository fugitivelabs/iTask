import React from "react";
import moment from "moment";
import PropTypes from "prop-types";
import "./Component.scss";

const Comment = ({ id, content, author, created }) => {
  return (
    <div data-testid={id}>
      <h4 className="comment-author">
        {author.firstName} {author.lastName}
      </h4>
      <div className="comment-date">
        {moment(created).format("M/D/YYYY @ hh:mma")}
      </div>
      <div className="comment-content">{content}</div>
    </div>
  );
};

Comment.propTypes = {
  id: PropTypes.string,
  content: PropTypes.string.isRequired,
  author: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }).isRequired,
  created: PropTypes.string,
};

export default Comment;
