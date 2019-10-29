import { useStaticQuery, graphql } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';

// get a list of ids

const IconPresenter = ({ svgSprite }) => {
  const data = useStaticQuery(graphql`
    query IconNameQuery {
      allFile(
        filter: {
          extension: { eq: "svg" }
          relativeDirectory: { eq: "components/icons/svg" }
        }
        sort: { fields: name, order: ASC }
      ) {
        edges {
          node {
            name
            relativeDirectory
          }
        }
      }
    }
  `);

  const iconNames = data.allFile.edges.map((edge) => {
    return edge.node.name;
  });

  const idPrefix = '#rb-icon-';

  const copyToClipboard = (e, text) => {
    const input = document.createElement('textarea');
    input.classList.add('visually-hidden');

    document.body.appendChild(input);
    input.value = text;
    input.select();

    document.execCommand('copy');
    document.body.removeChild(input);

    const button = e.target.closest('button');
    button.classList.add('icon-wrapper-copied');

    setTimeout(() => {
      button.classList.remove('icon-wrapper-copied');
    }, 1500);
  };

  return (
    <section className="icons-standard">
      <span className="icons-descriptor">Click an icon to copy its ID.</span>
      {iconNames.map((iconName) => {
        return (
          <button
            key={`${idPrefix}${iconName}`}
            className="button button-minimal icon-wrapper"
            onClick={(e) => {
              copyToClipboard(e, `${idPrefix}${iconName}`);
            }}
          >
            <svg className="icon">
              <use href={`${svgSprite}${idPrefix}${iconName}`}></use>
            </svg>
            <span>{`${idPrefix}${iconName}`}</span>
          </button>
        );
      })}
    </section>
  );
};

IconPresenter.propTypes = {
  svgSprite: PropTypes.string.isRequired,
};

IconPresenter.defaultProps = {
};

export default IconPresenter;
