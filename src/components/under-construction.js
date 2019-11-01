import PropTypes from 'prop-types';
import React from 'react';

import RbIcon from './rb-icon';

const UnderConstruction = ({ pluralComponentName }) => {
  const name =
    pluralComponentName.charAt(0).toUpperCase() + pluralComponentName.slice(1);
  return (
    <>
      <aside className="message message-warning deprecation-notice">
        <RbIcon icon="warning" className="message_icon" />
        <section className="message_body">
          <span className="message_title">
            This component is under construction.
          </span>
          <span className="message_text">
            {name} aren't quite ready for prime time yet. The appearance &
            behavior of this component may change. Use with caution!
          </span>
        </section>
      </aside>
    </>
  );
};

UnderConstruction.propTypes = {
  pluralComponentName: PropTypes.string.isRequired,
};

export default UnderConstruction;
