/**
 * View component for /tasks/:taskId
 *
 * Displays a single task from the 'byId' map in the task reducer
 * as defined by the 'selected' property
 */

// import primary libraries
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

// import actions
import * as taskActions from '../taskActions';
import { fetchListIfNeeded as fetchTaskNotes, fetchDefaultNote, sendCreateNote } from '../../note/noteActions';

// import global components
import Binder from '../../../global/components/Binder.js.jsx';
import { TextAreaInput } from '../../../global/components/forms';

// import resource components
import TaskLayout from '../components/TaskLayout.js.jsx';


class SingleTask extends Binder {
  constructor(props) {
    super(props);

    this.state = {
      comment: '',
    }
  }

  componentDidMount() {
    const { dispatch, match } = this.props;

    dispatch(taskActions.fetchSingleIfNeeded(match.params.taskId));
    dispatch(fetchDefaultNote());
    dispatch(fetchTaskNotes('_task', match.params.taskId));
  }

  handleChange = (e) => {
    const { name, value } = e.target;

    this.setState({ [name]: value });
  }

  handleAddComment = () => {
    const { dispatch, taskStore, userStore } = this.props;
    const { id: _task } = taskStore.selected;
    const { _flow } = taskStore.byId[_task];
    const { _id: _user } = userStore.loggedIn.user;

    dispatch(sendCreateNote({
      _flow,
      _task: _task,
      _user,
      content: this.state.comment,
    }));
  }

  render() {
    const { taskStore, noteStore, match } = this.props;

    /**
     * use the selected.getItem() utility to pull the actual task object from the map
     */
    const selectedTask = taskStore.selected.getItem();

    const noteList = noteStore.lists && noteStore.lists._task ? noteStore.lists._task[match.params.taskId] : null;

    const noteListItems = noteStore.util.getList("_task", match.params.taskId) || [];

    const isEmpty = (
      !selectedTask
      || !selectedTask._id
      || taskStore.selected.didInvalidate
    );

    const isFetching = (
      taskStore.selected.isFetching
      || !noteList
      || noteList.isFetching
    )

    return (
      <TaskLayout>
        <Link to="/flows">{`<- Back to INSERT FLOW heRE`}</Link>
        { isEmpty ?
          (isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
          :
          <div style={{ opacity: isFetching ? 0.5 : 1 }}>
            <div className="flow-item-header">
              <span>
                <h1> { selectedTask.name } </h1>
                <p>{ selectedTask.description } </p>
              </span>
              <Link className="yt-btn x-small" to={`${this.props.match.url}/update`}> Update Task </Link>
            </div>
            <hr/>

            {noteListItems.map(({ content, updated, _user }) => {
              return (
                <div key={_user + updated}>
                  <p>{_user}</p>
                  <p>{updated}</p>
                  <p>{content}</p>
                </div>
              );
            })}

            <hr/>
            <TextAreaInput
              change={this.handleChange}
              name="comment"
              value={this.state.comment}
            />
            <button
              type="button"
              className="yt-btn x-small bordered"
              onClick={this.handleAddComment}
            >
              Add Comment
            </button>
            <br/>
          </div>
        }
      </TaskLayout>
    )
  }
}

SingleTask.propTypes = {
  dispatch: PropTypes.func.isRequired
}

const mapStoreToProps = (store) => {
  /**
  * NOTE: Yote refer's to the global Redux 'state' as 'store' to keep it mentally
  * differentiated from the React component's internal state
  */
  return {
    taskStore: store.task,
    noteStore: store.note,
    userStore: store.user,
  }
}

export default withRouter(
  connect(
    mapStoreToProps
  )(SingleTask)
);
