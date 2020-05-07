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
import * as taskActions from '../../task/taskActions';

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
    // fetch a list of your choice
    const {dispatch} = this.props
    dispatch(flowActions.fetchListIfNeeded('all')); // defaults to 'all'
    dispatch(taskActions.fetchListIfNeeded());
  }

  componentWillReceiveProps(){
    const {flowStore, dispatch} = this.props
    const flowListItems = flowStore.util.getList("all");
    flowListItems.map( ({_id}) => {
      dispatch(taskActions.fetchListIfNeeded('_flow', _id));
      return true
    })
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
    )

    return (
      <FlowLayout>
        <div className="title">
          <h1> Flow List </h1>
          <Link to={'/flows/new'} className='title-btn'> New Flow </Link>
        </div>
        <hr/>
        { isEmpty ?
          (isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
          :
          <div style={{ opacity: isFetching ? 0.5 : 1 }} className='flow-item-container'>
            {flowListItems.map((flow, i) =>{
              const taskListItems = taskStore.util.getList("_flow", flow._id);
              return <FlowListItem key={flow._id + i} flow={flow} taskListItems={taskListItems}/>
            })}
          </div>
        }
      </FlowLayout>
    )
  }
}

FlowList.propTypes = {
  dispatch: PropTypes.func.isRequired
}

const mapStoreToProps = ({flow, task}) => {
  /**
  * NOTE: Yote refer's to the global Redux 'state' as 'store' to keep it mentally
  * differentiated from the React component's internal state
  */
  return {
    flowStore: flow,
    taskStore: task
  }
}

export default withRouter(
  connect(
    mapStoreToProps
  )(FlowList)
);
