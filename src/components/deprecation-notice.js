import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';

import RbIcon from './rb-icon';

const DeprecationNotice = ({ deprecatedComponent, alternativeComponents }) => {
  let hasAlternatives = false;
  let asAnAlternativeText = '';
  if (alternativeComponents && alternativeComponents.length > 0) {
    hasAlternatives = true;
    asAnAlternativeText =
      alternativeComponents.length > 1
        ? ' components as alternatives'
        : ' component as an alternative';
  }

  const componentName = !!deprecatedComponent
    ? deprecatedComponent.charAt(0).toUpperCase() + deprecatedComponent.slice(1)
    : 'It';

  return (
    <>
      <aside className="message message-warning deprecation-notice">
        <RbIcon icon="warning" className="message_icon" />
        <section className="message_body">
          <span className="message_title">
            This component has been deprecated.
          </span>
          <span className="message_text">
            {componentName} may be removed in a future version of Rocketbelt.
            {hasAlternatives && (
              <>
                {` `}Consider the
                {alternativeComponents.map((component, index) => {
                  let separator =
                    index === 0
                      ? ' '
                      : index + 1 === alternativeComponents.length
                      ? ' or '
                      : ', ';
                  return component.uri ? (
                    <>
                      {separator}
                      <Link
                        className="deprecated-component-alternative"
                        to={component.uri}
                      >
                        {component.name}
                      </Link>
                    </>
                  ) : (
                    <>
                      {separator}
                      <span className="deprecated-component-alternative">
                        {component.name}
                      </span>
                    </>
                  );
                })}
                {asAnAlternativeText}.
              </>
            )}
          </span>
        </section>
      </aside>
    </>
  );
};

DeprecationNotice.propTypes = {
  alternativeComponents: PropTypes.array,
};

export default DeprecationNotice;
