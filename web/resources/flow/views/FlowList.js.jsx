/**
 * View component for /flows
 *
 * Generic flow list view. Defaults to 'all' with:
 * this.props.dispatch(flowActions.fetchListIfNeeded());
 *
 * NOTE: See /product/views/ProductList.js.jsx for more examples
 */

// import primary libraries
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

// import actions
import * as flowActions from "../flowActions";
import * as taskActions from "../../task/taskActions";

// import global components
import Binder from "../../../global/components/Binder.js.jsx";

// import resource components
import FlowLayout from "../components/FlowLayout.js.jsx";
import FlowListItem from "../components/FlowListItem.js.jsx";
import TaskListItem from "../../task/components/TaskListItem.js.jsx";

class FlowList extends Binder {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // fetch a list of your choice
    this.props.dispatch(flowActions.fetchListIfNeeded("all")); // defaults to 'all'
    this.props.dispatch(taskActions.fetchListIfNeeded("all")); // defaults to 'all'
  }

  render() {
    const { flowStore, taskStore } = this.props;

    /**
     * Retrieve the list information and the list items for the component here.
     *
     * NOTE: if the list is deeply nested and/or filtered, you'll want to handle
     * these steps within the mapStoreToProps method prior to delivering the
     * props to the component.  Othwerwise, the render() action gets convoluted
     * and potentially severely bogged down.
     */

    // get the flowList & taskList meta info here so we can reference 'isFetching'
    const flowList = flowStore.lists ? flowStore.lists.all : null;
    const taskList = taskStore.lists ? taskStore.lists.all : null;

    /**
     * use the reducer getList utility to convert the all.items array of ids
     * to the actual flow objetcs
     */
    const flowListItems = flowStore.util.getList("all");
    const taskListItems = taskStore.util.getList("all");
    /**
     * NOTE: isEmpty is is usefull when the component references more than one
     * resource list.
     */
    const isEmpty = !flowListItems || !flowList;

    const isFetching = !flowListItems || !flowList || flowList.isFetching;

    const isTaskListEmpty = !taskListItems || !taskList;

    const isTaskListFetching =
      !taskListItems || !taskList || taskList.isFetching;

    return (
      <FlowLayout>
        <div className="title-row">
          <h1 style={{ fontWeight: 1000 }}> Flows </h1>
          <Link className="yt-btn title-button x-small" to={"/flows/new"}>
            New Flow
          </Link>
        </div>

        {isEmpty ? (
          isFetching ? (
            <h2>Loading...</h2>
          ) : (
            <h2>Empty.</h2>
          )
        ) : (
          <div
            className="flow-container"
            style={{ opacity: isFetching ? 0.5 : 1 }}
          >
            {flowListItems.map((flow, i) => (
              <div key={flow._id + i}>
                <FlowListItem key={flow._id + i} flow={flow}>
                  {isTaskListEmpty ? (
                    isTaskListFetching ? (
                      <h2>Loading...</h2>
                    ) : (
                      <h2>Empty.</h2>
                    )
                  ) : (
                    <div style={{ opacity: isTaskListFetching ? 0.5 : 1 }}>
                      {taskListItems.map((task, i) => {
                        if (task._flow === flow._id)
                          return (
                            <TaskListItem
                              fromFlow={true}
                              key={task._id + i}
                              task={task}
                            />
                          );
                        else return null;
                      })}
                    </div>
                  )}
                </FlowListItem>
              </div>
            ))}
          </div>
        )}
      </FlowLayout>
    );
  }
}

FlowList.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStoreToProps = (store) => {
  /**
   * NOTE: Yote refer's to the global Redux 'state' as 'store' to keep it mentally
   * differentiated from the React component's internal state
   */
  return {
    flowStore: store.flow,
    taskStore: store.task,
  };
};

export default withRouter(connect(mapStoreToProps)(FlowList));
