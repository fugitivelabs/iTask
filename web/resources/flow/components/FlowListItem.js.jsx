// import primary libraries
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const FlowListItem = ({
  flow: {name, _id},
  taskListItems
}) => {
  return (
    <div className="flow-item">
      <h4>
        <Link to={`/flows/${_id}`}> {name}</Link>
      </h4>
      <hr/>
      <ul className='task-list'>
        {(taskListItems && taskListItems.length > 0) ?
          taskListItems.map( ({_id, name, complete}) => (
            <li className='task-list-item' key={_id}>
              <input type="checkbox" defaultChecked={!!complete? true: false} disabled id={_id}/>
              <label htmlFor={_id} >
                <span>{name}</span>
              </label>
            </li>
          ))
          : 
          'No Task Yet!'
        }
      </ul>
    </div>
  )
}

FlowListItem.propTypes = {
  flow: PropTypes.object.isRequired
}

export default FlowListItem;
