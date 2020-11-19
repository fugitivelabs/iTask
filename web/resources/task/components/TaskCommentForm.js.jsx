/**
 * Reusable stateless form component for Note
 */

// import primary libraries
import React from "react";
import PropTypes from "prop-types";

// import form components
import { TextAreaInput } from "../../../global/components/forms";

const TaskCommentForm = ({ handleFormChange, handleFormSubmit, note }) => (
  <div className="note-form">
    <form name="noteForm" onSubmit={handleFormSubmit}>
      <TextAreaInput
        change={handleFormChange}
        name="newNote.content"
        required={false}
        value={note.content}
        rows="3"
      />
      <div className="input-group">
        <div className="yt-row space-between">
          <button className="yt-btn x-small" type="submit">
            Add Comment
          </button>
        </div>
      </div>
    </form>
  </div>
);

TaskCommentForm.propTypes = {
  handleFormChange: PropTypes.func.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
  note: PropTypes.object.isRequired,
};

export default TaskCommentForm;
