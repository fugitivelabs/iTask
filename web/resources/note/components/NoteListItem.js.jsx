// import primary libraries
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const NoteListItem = ({ note, fromTask, userList }) => {
  const dateCreated = new Date(note.created);

  const user = userList.filter((user) => user._id === note._user)[0];

  return !fromTask ? (
    <li>
      <Link to={`/notes/${note._id}`}> {note.name}</Link>
    </li>
  ) : (
    <div>
      <h3>{`${user.firstName} ${user.lastName}`}</h3>
      <p>{dateCreated.toLocaleString("en-US").replace(",", " @")}</p>
      <p>{note.content}</p>
    </div>
  );
};

NoteListItem.propTypes = {
  note: PropTypes.object.isRequired,
};

export default NoteListItem;
