/**
 * View component for /flows
 *
 * Generic flow list view. Defaults to 'all' with:
 * this.props.dispatch(flowActions.fetchListIfNeeded());
 *
 * NOTE: See /product/views/ProductList.js.jsx for more examples
 */

// import primary libraries
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

// import actions
import * as flowActions from '../flowActions';
import { fetchListIfNeeded as fetchTaskList, sendUpdateTask } from '../../task/taskActions';

// import global components
import Binder from '../../../global/components/Binder.js.jsx';

// import resource components
import FlowLayout from '../components/FlowLayout.js.jsx';
import FlowListItem from '../components/FlowListItem.js.jsx';

class FlowList extends Binder {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch } = this.props;

    // fetch a list of your choice
    dispatch(flowActions.fetchListIfNeeded('all'))
      .then(({ list }) => {
        list.forEach(({ _id }) => dispatch(fetchTaskList('_flow', _id)));
      }); // defaults to 'all'
  }

  completeTask = (e) => {
    const { dispatch } = this.props;
    const { name, checked } = e.target;

    dispatch(sendUpdateTask({ _id: name, complete: checked, status: checked ? 'approved' : 'open' }));
  }

  render() {
    const { flowStore, taskStore } = this.props;

    const { byId, lists: taskList } = taskStore;

    /**
     * Retrieve the list information and the list items for the component here.
     *
     * NOTE: if the list is deeply nested and/or filtered, you'll want to handle
     * these steps within the mapStoreToProps method prior to delivering the
     * props to the component.  Othwerwise, the render() action gets convoluted
     * and potentially severely bogged down.
     */

    // get the flowList meta info here so we can reference 'isFetching'
    const flowList = flowStore.lists ? flowStore.lists.all : null;

    /**
     * use the reducer getList utility to convert the all.items array of ids
     * to the actual flow objetcs
     */
    const flowListItems = flowStore.util.getList("all");

    /**
     * NOTE: isEmpty is is usefull when the component references more than one
     * resource list.
     */
    const isEmpty = (
      !flowListItems
      || !flowList
    );

    const isFetching = (
      !flowListItems
      || !flowList
      || flowList.isFetching
    );

    return (
      <FlowLayout>
        <div className="flow-item-header">
          <h1> Flows </h1>
          <Link className="yt-btn x-small" to={'/flows/new'}> New Flow </Link>
        </div>
        <hr/>
        <br/>
        { isEmpty ?
          (isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
          :
          <div style={{ opacity: isFetching ? 0.5 : 1 }}>
            <ul className="flow-list">
              {flowListItems.map((flow, i) => {
                const { _id } = flow;

                return taskList._flow && taskList._flow[_id] && !taskList._flow[_id].isFetching ?
                  <FlowListItem
                    key={flow._id + i}
                    flow={flow}
                    taskIds={taskList._flow[_id] ? taskList._flow[_id].items : []}
                    tasks={byId}
                    onChange={this.completeTask}
                  /> : <div>loading</div>
              })}
            </ul>
          </div>
        }
      </FlowLayout>
    )
  }
}

FlowList.propTypes = {
  dispatch: PropTypes.func.isRequired
}

const mapStoreToProps = (store) => {
  /**
  * NOTE: Yote refer's to the global Redux 'state' as 'store' to keep it mentally
  * differentiated from the React component's internal state
  */
  return {
    flowStore: store.flow,
    taskStore: store.task,
  }
}

export default withRouter(
  connect(
    mapStoreToProps
  )(FlowList)
);
