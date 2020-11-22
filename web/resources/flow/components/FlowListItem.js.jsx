// import primary libraries
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { CheckboxInput } from '../../../global/components/forms';

const FlowListItem = ({
  flow,
  taskIds,
  tasks,
}) => {
  return (
    <li className="flow-item">
      <Link to={`/flows/${flow._id}`}> {flow.name}</Link>
      <div className="flow-item-tasks">
        {taskIds.map((id) => {
          const { complete, name } = tasks[id];
        return <CheckboxInput change={() => {}} label={name} name={name} value={complete} /> })
      }
      </div>
    </li>
  )
}

FlowListItem.propTypes = {
  flow: PropTypes.object.isRequired
}

export default FlowListItem;
