import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Button } from 'material-ui';

const AssignmentDetails = (props) => {
  const id = props.match.params.userId;
  const assignDetails = props.assignments.assignments.filter(assignment => assignment._id === id)[0];
  return (
    <div>
      <h1>Assignment Details</h1>
      <h3>{assignDetails.name}</h3>
      <h3>{assignDetails.days}</h3>
      <h3>{assignDetails.clientName}</h3>
      <h3>{assignDetails.dueDate}</h3>
      <h3>{assignDetails.email}</h3>
      <h3>{assignDetails.file}</h3>
      <h3>{assignDetails.hoursToPractice}</h3>
      <h3>{assignDetails.musicFile}</h3>
      <Link to="/dashboard/assignments">
        <Button variant="raised">
        Assignments
        </Button>
      </Link>
    </div>
  );
};

AssignmentDetails.propTypes = {
  assignments: PropTypes.arrayOf.isRequired,
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
  }).isRequired,
};

const mapStateToProps = state => ({ assignments: state.assignments });

export default connect(mapStateToProps, null)(AssignmentDetails);
