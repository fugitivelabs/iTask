import React from "react";

const TaskItem = ({ task, className }) => (
  <div className={className}>
    <input
      type="checkbox"
      disabled="false"
      className="checkbox"
      checked={task.complete}
    />
    &nbsp;
    <p
      className={task.complete ? "task-name-para-completed" : "task-name-para"}
    >
      {task.name}
    </p>
  </div>
);

export default TaskItem;
