import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';

const toggleClass = function(e, scopedSelector, classToToggle) {
  const button = e.target.closest('button');
  button.nextElementSibling.querySelectorAll(scopedSelector).forEach((el) => {
    el.classList && el.classList.toggle(classToToggle);
  });
};

const ToggleClassButton = ({ scopedSelector, classToToggle }) => {
  return (
    <>
      <button
        className="button button-minimal button-toggle-class"
        onClick={(e) => {
          toggleClass(e, scopedSelector, classToToggle);
        }}
      >
        Toggle{' '}
        <span className="button-toggle-class_class-name">{classToToggle}</span>
      </button>
    </>
  );
};

ToggleClassButton.propTypes = {
  scopedSelector: PropTypes.string.isRequired,
  classToToggle: PropTypes.string.isRequired,
};

export default ToggleClassButton;
