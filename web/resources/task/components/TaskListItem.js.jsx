// import primary libraries
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import TaskItem from "./TaskItem.js.jsx";

const TaskListItem = ({ task, fromFlow }) => {
  return (
    <div>
      {fromFlow ? (
        <TaskItem className="flow-list-tasks" task={task} />
      ) : (
        <div className="task-item">
          <TaskItem task={task} />
          {!task.complete ? (
            <div className="task-desc-and-btn">
              <p>{task.description}</p>
              <Link
                className="yt-btn x-small bordered comment-link"
                to={`/tasks/${task._id}`}
              >
                Comment
              </Link>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

TaskListItem.propTypes = {
  task: PropTypes.object.isRequired,
};

export default TaskListItem;
