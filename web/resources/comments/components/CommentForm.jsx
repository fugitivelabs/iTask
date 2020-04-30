/**
 * Reusable stateless form component for Note
 */

// import primary libraries
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as commentsActions from "../commentsActions";
import "./CommentForm.scss";

// import form components
import { TextAreaInput } from "../../../global/components/forms";

// import global components
import Binder from "../../../global/components/Binder.js.jsx";

class CommentsForm extends Binder {
  constructor(props) {
    super(props);

    this.state = {
      commentText: "",
    };

    this._bind("handleFormSubmit", "handleFormChange");
  }

  componentDidMount() {
    const { dispatch, taskId } = this.props;
    dispatch(commentsActions.fetchComments(taskId));
  }

  handleFormSubmit(e) {
    e.preventDefault();
    const { dispatch, taskId, flowId, userId } = this.props;
    const { commentText } = this.state;
    dispatch(
      commentsActions.addComment(
        {
          _flow: flowId[taskId]._id,
          _task: taskId,
          _user: userId,
          content: commentText,
        },
        () => {
          this.setState({
            commentText: "",
          });
        }
      )
    );
  }

  handleFormChange(e) {
    this.setState({
      commentText: e.target.value,
    });
  }

  render() {
    const { isLoading } = this.props;
    const { commentText } = this.state;

    if (isLoading) {
      return <div>Loading...</div>;
    }

    return (
      <div className="comment-form-container">
        <div className="yt-row">
          <form
            name="commentsForm"
            className="comments-form"
            onSubmit={this.handleFormSubmit}
          >
            <TextAreaInput
              change={this.handleFormChange}
              label=""
              name="comment.content"
              placeholder="Comment"
              value={commentText}
            />
            <div className="input-group">
              <div className="yt-row space-between">
                <button className="yt-btn " type="submit">
                  Add comment
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

CommentsForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
  flowId: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  taskId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  commentsList: PropTypes.array,
};

CommentsForm.defaultProps = {
  commentsList: [],
};

const mapStoreToProps = (store) => {
  return {
    isLoading: store.comments.isLoading,
    commentsList: store.comments.list,
    flowId: store.task.byId,
    userId: store.user.loggedIn.user._id,
  };
};

export default connect(mapStoreToProps)(CommentsForm);
