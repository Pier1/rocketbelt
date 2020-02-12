import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

const get = require('lodash.get');

const poll = (fn, timeout, interval) => {
  const endTime = Number(new Date()) + (timeout || 2000);
  interval = interval || 100;

  const checkCondition = function(resolve, reject) {
    const result = fn();
    if (result) {
      resolve(result);
    } else if (Number(new Date()) < endTime) {
      setTimeout(checkCondition, interval, resolve, reject);
    } else {
      reject(new Error('Timed out. fn: ' + fn + ': ' + arguments));
    }
  };

  return new Promise(checkCondition);
};

const InjectedScript = (props) => {
  useEffect(() => {
    window.pollFor = (objectPath, fn) => {
      poll(() => {
        return get(window, objectPath);
      }).then(() => {
        fn();
      });
    };
    eval(props.script);
  });

  return <></>;
};

InjectedScript.propTypes = {
  script: PropTypes.string.isRequired,
};

export default InjectedScript;
