import PropTypes from 'prop-types';
import React from 'react';

const RbIcon = ({ icon, className }) => {
  return (
    <svg
      class={`icon ${className}`}
      dangerouslySetInnerHTML={{
        __html: `<use xlink:href="/icons/rocketbelt.icons.svg#rb-icon-${icon}"></use>`,
      }}
    />
  );
};

RbIcon.propTypes = {
  icon: PropTypes.string.isRequired,
};

export default RbIcon;
