// import primary libraries
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { CheckboxInput } from '../../../global/components/forms';

const FlowListItem = ({
  flow,
  taskIds,
  tasks,
  onChange,
}) => {
  return (
    <li className="flow-item">
      <Link to={`/flows/${flow._id}`}> {flow.name}</Link>
      <div className="flow-item-tasks">
        {taskIds.map((id) => {
          const { complete, status, name, _id } = tasks[id];

          return <CheckboxInput
            key={`${id}-task-${_id}`}
            change={onChange}
            label={name}
            name={_id}
            value={status === 'approved'}
          />
      })}
      </div>
    </li>
  )
}

FlowListItem.propTypes = {
  flow: PropTypes.object.isRequired
}

export default FlowListItem;
