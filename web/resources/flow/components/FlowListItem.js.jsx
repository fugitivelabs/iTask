// import primary libraries
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const FlowListItem = ({ flow, children }) => {
  return (
    <Link to={`/flows/${flow._id}`}>
      <div className="flow-list-items flow-text">
        <div>{flow.name}</div>
        <hr />
        {children}
      </div>
    </Link>
  );
};

FlowListItem.propTypes = {
  flow: PropTypes.object.isRequired,
};

export default FlowListItem;
