import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import moment from 'moment'

import * as flowActions from '../flowActions';
import * as taskActions from '../../task/taskActions';
import * as noteActions from '../../note/noteActions'

import Binder from '../../../global/components/Binder.js.jsx';
import FlowLayout from '../components/FlowLayout.js.jsx';

class MessageFlow extends Binder {
  constructor(props) {
    super(props);
    this.state = {
      note: _.cloneDeep(this.props.defaultNote.obj),
    }
    this._bind(
      '_handleFormChange'
      , '_handleFormSubmit'
    );
  }

  componentDidMount() {
    const { dispatch, match: {params: {flowId, taskId}} } = this.props;
    dispatch(flowActions.fetchSingleIfNeeded(flowId));
    dispatch(taskActions.fetchSingleIfNeeded(taskId));
    dispatch(noteActions.fetchDefaultNote());
    dispatch(noteActions.fetchListIfNeeded('_task', taskId));
  }

  _handleFormChange(e) {
    let newState = _.update(this.state, e.target.name, () => {
      return e.target.value;
    });
    this.setState({newState});
  }


  _handleFormSubmit(e) {
    const { dispatch, userId, defaultNote, match: {params: {flowId, taskId}} } = this.props;
    e.preventDefault();
    let newNote = {
      ...this.state.note,
      _user: userId,
      _flow: flowId,
      _task: taskId
    }
    dispatch(noteActions.sendCreateNote(newNote)).then(noteRes => {
      if(noteRes.success) {
        // dispatch(noteActions.invalidateList());
        dispatch(noteActions.fetchListIfNeeded('_task', taskId));
        this.setState({
          note: _.cloneDeep(defaultNote.obj)
        })
      } else {
        alert("ERROR - Check logs");
      }
    });
  }

  render() {
    const { flowStore, match: {params: {flowId, taskId}}, taskStore, noteStore } = this.props;

    const selectedFlow = flowStore.selected.getItem() || {}
    const selectedTask = taskStore.selected.getItem() || {}
    const noteList = noteStore.lists && noteStore.lists._task ? noteStore.lists._task[taskId] : null;
    const noteListItems = noteStore.util.getList('_task', taskId);

    const isNoteListEmpty = (
      !noteListItems
      || !noteList 
    );

    const isNoteListFetching = (
      !noteListItems
      || !noteList
      || noteList.isFetching
    )

    const isFlowFetching = (
      flowStore.selected.isFetching
    )

    const isTaskFetching = (
      taskStore.selected.isFetching
    )

    return (
      <FlowLayout>
        {isFlowFetching ?
          '...Loading'
          :
          <div style={{ opacity: isFlowFetching ? 0.5 : 1 }}>
            <Link to={`/flows/${flowId}`}>Return to {selectedFlow.name} </Link>
            {isTaskFetching ? 
              '...Loading'
              :
              <div>
                <div className="title">
                  <h1>
                    <div className={!!selectedTask.complete ? 'check completed': 'check' }></div>
                    {selectedTask.name}
                  </h1>
                  <p>{selectedTask.decription}</p>
                </div>
                <hr/>
                {isNoteListFetching ?
                  (isNoteListEmpty ? <h2>Loading...</h2> : <h2>No notes yet.</h2>) :
                  <div style={{ opacity: isNoteListFetching ? 0.5 : 1 }}>
                    <ul className="notes-list">
                      {noteListItems.map( ({_id, content, _user: {firstName, lastName}, created}) => 
                        <li className='notes-list-item' key={_id}>
                          <div className="user-info">
                            <div className="avatar"></div>
                            <div className="content">
                              <h4>{`${firstName} ${lastName}`}</h4>
                              <span className='time'>{moment(created).format("ddd, MMM Do YYYY, h:mm:ss a")}</span>
                              <p className='message'>{content}</p>
                            </div>
                          </div>
                        </li>
                      )}
                    </ul>
                  </div>
                }
                <hr/>
              {!isNoteListFetching && (
                <div className="new-message">
                  <form onSubmit={this._handleFormSubmit}>
                    <textarea
                      cols="40"
                      rows="5"
                      name='note.content' 
                      onChange={this._handleFormChange} 
                      placeholder='Write your comment here.'
                    />
                    <button type='submit' className="border-btn">
                      Add Comment
                    </button>
                  </form>
                </div>
              )}
              </div>
            }
          </div>
        }
      </FlowLayout>
    )
  }
}

MessageFlow.propTypes = {
  dispatch: PropTypes.func.isRequired
}

const mapStoreToProps = ({flow, task, note, user}) => {
  /**
  * NOTE: Yote refer's to the global Redux 'state' as 'store' to keep it mentally
  * differentiated from the React component's internal state
  */
  return {
    flowStore: flow,
    defaultNote: note.defaultItem,
    taskStore: task,
    noteStore: note,
    userId: user.loggedIn.user._id
  }
}

export default withRouter( connect( mapStoreToProps )(MessageFlow) )