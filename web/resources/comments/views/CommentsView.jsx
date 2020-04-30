/**
 * Reusable stateless form component for Note
 */

// import primary libraries
import React from "react";
import { connect } from "react-redux";
import * as commentsActions from "../commentsActions";

// import components
import CommentList from "../components/CommentList.jsx";
import CommentForm from "../components/CommentForm.jsx";

// import global components
import Binder from "../../../global/components/Binder.js.jsx";

class CommentsView extends Binder {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch, taskId } = this.props;
    dispatch(commentsActions.fetchComments(taskId));
  }

  render() {
    const { commentsList, taskId } = this.props;
    if (!taskId) {
      return null;
    }
    return (
      <div>
        <hr />
        <CommentList comments={commentsList} />
        <hr />
        <CommentForm taskId={taskId} />
      </div>
    );
  }
}

const mapStoreToProps = (store) => {
  return {
    commentsList: store.comments.list,
  };
};

export default connect(mapStoreToProps)(CommentsView);
