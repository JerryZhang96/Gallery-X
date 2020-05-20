import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Progress } from 'antd';

const ProgressBar = ({ percentage }) => {
  return (
    <Fragment>
      <Progress percent={percentage} />
    </Fragment>
  );
};

ProgressBar.propTypes = {
  percentage: PropTypes.number.isRequired,
};

export default ProgressBar;
