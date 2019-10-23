import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';

const toggleClass = function(e, selector, selectorIsGlobal, classToToggle) {
  const scopedElement = selectorIsGlobal
    ? document.body
    : e.target.closest('button').nextElementSibling;
  scopedElement.querySelectorAll(selector).forEach((el) => {
    el.classList && el.classList.toggle(classToToggle);
  });
};

const ToggleClassButton = ({
  children,
  selector,
  selectorIsGlobal,
  classToToggle,
}) => {
  return (
    <>
      <button
        className="button button-minimal button-toggle-class"
        onClick={(e) => {
          toggleClass(e, selector, selectorIsGlobal, classToToggle);
        }}
      >
        {children ? (
          <>{children}</>
        ) : (
          <>
            <span>Toggle </span>
            <span className="button-toggle-class_class-name">
              {classToToggle}
            </span>
          </>
        )}
      </button>
    </>
  );
};

ToggleClassButton.propTypes = {
  selector: PropTypes.string.isRequired,
  selectorIsGlobal: PropTypes.bool,
  classToToggle: PropTypes.string.isRequired,
};

ToggleClassButton.defaultProps = {
  selectorIsGlobal: false,
};

export default ToggleClassButton;
