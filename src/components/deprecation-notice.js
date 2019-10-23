import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';

const DeprecationNotice = ({ alternativeComponents }) => {
  let hasAlternatives = false;
  let asAnAlternativeText = '';
  if (alternativeComponents && alternativeComponents.length > 0) {
    hasAlternatives = true;
    asAnAlternativeText =
      alternativeComponents.length > 1
        ? ' components as alternatives'
        : ' component as an alternative';
  }

  return (
    <>
      <aside>
        This component is deprecated and may be removed in a future version of
        Rocketbelt.
      </aside>
      {hasAlternatives && (
        <p>
          Consider using the
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
        </p>
      )}
    </>
  );
};

DeprecationNotice.propTypes = {
  alternativeComponents: PropTypes.array,
};

export default DeprecationNotice;
