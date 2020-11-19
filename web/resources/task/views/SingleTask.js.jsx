/**
 * View component for /tasks/:taskId
 *
 * Displays a single task from the 'byId' map in the task reducer
 * as defined by the 'selected' property
 */

// import primary libraries
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

// import third-party libraries
import _ from "lodash";

// import actions
import * as taskActions from "../taskActions";
import * as noteActions from "../../note/noteActions";
import * as userActions from "../../user/userActions";

// import global components
import Binder from "../../../global/components/Binder.js.jsx";

// import resource components
import TaskLayout from "../components/TaskLayout.js.jsx";
import TaskCommentForm from "../components/TaskCommentForm.js.jsx";
import NoteListItem from "../../note/components/NoteListItem.js.jsx";

class SingleTask extends Binder {
  constructor(props) {
    super(props);
    const { match, taskStore, userStore, noteStore } = this.props;
    this.state = {
      task: taskStore.byId[match.params.taskId]
        ? _.cloneDeep(taskStore.byId[match.params.taskId])
        : {},
      note: {},
      newNote: {},
      /**
       * NOTE: formHelpers are useful for things like radio controls and other
       * things that manipulate the form, but don't directly effect the state of
       * the task
       */
      user: {},
      userList: {},
    };
    this._bind("_handleFormChange", "_handleCommentSubmit");
  }

  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch(userActions.fetchListIfNeeded());
    dispatch(taskActions.fetchSingleIfNeeded(match.params.taskId));
    //dispatch(noteActions.fetchDefaultNote());
    dispatch(noteActions.fetchListIfNeeded("_task", match.params.taskId));
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, match, taskStore, noteStore, userStore } = nextProps;
    this.setState({
      task: taskStore.byId[match.params.taskId]
        ? _.cloneDeep(taskStore.byId[match.params.taskId])
        : {},
      // NOTE: ^ we don't want to actually change the store's task, just use a copy
    });

    //get note
    dispatch(noteActions.fetchListIfNeeded("_task", match.params.taskId));
    // this.setState({
    //   note: _.cloneDeep(nextProps.defaultNote.obj),
    // });

    this.setState({
      user: userStore.loggedIn.user,
    });

    this.setState({
      note: noteStore.lists,
    });

    // this.setState({
    //   userList: userStore.byId,
    // });

    //console.log("USERSTORE:", userStore);
  }

  _handleBack = () => {
    this.props.history.goBack();
  };

  _handleCheckBoxChange = (e) => {
    const { dispatch } = this.props;

    const complete = !this.state.task.complete;
    const newState = {
      ...this.state.task,
      complete,
    };
    dispatch(taskActions.sendUpdateTask(newState)).then((taskRes) => {
      if (!taskRes.success) {
        alert("ERROR - Check logs");
      }
    });
  };

  _handleCommentSubmit(e) {
    e.preventDefault();
    const { dispatch, match } = this.props;
    let newNote = { ...this.state.newNote };
    newNote._user = this.state.user._id;
    newNote._task = match.params.taskId;
    newNote._flow = this.state.task._flow;
    dispatch(noteActions.sendCreateNote(newNote)).then((noteRes) => {
      if (noteRes.success) {
        dispatch(noteActions.invalidateList("_task", match.params.taskId));
        this.setState({
          newNote: { content: "" },
        });
      } else {
        alert("ERROR - Check logs");
      }
    });
  }

  _handleFormChange(e) {
    /**
     * This let's us change arbitrarily nested objects with one pass
     */
    let newState = _.update(this.state, e.target.name, () => {
      return e.target.value;
    });
    this.setState({ newState });
  }

  render() {
    const { newNote } = this.state;
    const { taskStore, userStore, noteStore, match } = this.props;

    /**
     * use the selected.getItem() utility to pull the actual task object from the map
     */
    const selectedTask = taskStore.selected.getItem();

    // get the noteList meta info here so we can reference 'isFetching'
    const noteList =
      noteStore.lists && noteStore.lists._task
        ? noteStore.lists._task[match.params.taskId]
        : null;

    /**
     * use the reducer getList utility to convert the all.items array of ids
     * to the actual task objetcs
     */
    const noteListItems = noteStore.util.getList("_task", match.params.taskId);
    const userListItems = userStore.util.getList("all");

    const isEmpty =
      !selectedTask || !selectedTask._id || taskStore.selected.didInvalidate;

    const isFetching = taskStore.selected.isFetching;

    const isNoteListEmpty =
      !(noteListItems && noteListItems.length === 0 ? false : true) ||
      !noteList;

    const isNoteListFetching =
      !noteListItems || !noteList || noteList.isFetching;

    return (
      <TaskLayout>
        <button className="btn-back" onClick={this._handleBack}>
          🡐 Back
        </button>
        {isEmpty ? (
          isFetching ? (
            <h2>Loading...</h2>
          ) : (
            <h2>Empty.</h2>
          )
        ) : (
          <div style={{ opacity: isFetching ? 0.5 : 1 }}>
            <div className="title-row">
              <div className="single-task-title">
                <input
                  type="checkbox"
                  name="status"
                  className="checkbox-lg"
                  checked={
                    selectedTask && selectedTask.complete
                      ? selectedTask.complete
                      : false
                  }
                  onChange={this._handleCheckBoxChange}
                />
                &nbsp; <p className="single-task-p">{selectedTask.name}</p>
              </div>
              <Link
                className="yt-btn title-button x-small"
                to={`${this.props.match.url}/update`}
              >
                Edit
              </Link>
            </div>
            <p>
              <em>{selectedTask.description}</em>
            </p>
            <hr />
            {isNoteListEmpty ? (
              isNoteListFetching ? (
                <h2>Loading...</h2>
              ) : (
                <h2>Empty.</h2>
              )
            ) : (
              <div style={{ opacity: isNoteListFetching ? 0.5 : 1 }}>
                <ul>
                  {noteListItems && noteListItems.length > 0
                    ? noteListItems.map((note, i) => {
                        //if (note._task === selectedTask._id)
                        return (
                          <NoteListItem
                            fromTask={true}
                            userList={userListItems}
                            key={note._id + i}
                            note={note}
                          />
                        );
                        //else return null;
                      })
                    : null}
                </ul>
              </div>
            )}
            <hr />
            <TaskCommentForm
              note={
                newNote && newNote.content
                  ? newNote
                  : { ...newNote, content: "" }
              }
              handleFormChange={this._handleFormChange}
              handleFormSubmit={this._handleCommentSubmit}
            />
          </div>
        )}
      </TaskLayout>
    );
  }
}

SingleTask.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStoreToProps = (store) => {
  /**
   * NOTE: Yote refer's to the global Redux 'state' as 'store' to keep it mentally
   * differentiated from the React component's internal state
   */
  return {
    taskStore: store.task,
    noteStore: store.note,
    userStore: store.user,
  };
};

export default withRouter(connect(mapStoreToProps)(SingleTask));
