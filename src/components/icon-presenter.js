import { useStaticQuery, graphql } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { colors, fontSize, media, fontFamily } from '../utils/rocketbelt';

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

  const iconsStandardCss = css`
    position: relative;
    display: grid;
    padding: 0.5rem;
    padding-top: 3rem;
    background: ${colors.brand.catskillBlue};
    grid-gap: 0.5rem;
    grid-template-columns: repeat(auto-fill, minmax(64px, 1fr));
    justify-content: space-between;

    ${media[0]} {
      padding: 1.5rem;
      grid-gap: 2.5rem 1rem;
      grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
    }

    ${media[1]} {
      grid-template-columns: repeat(auto-fill, 120px);
    }

    .icon {
      margin-bottom: 0.5rem;
      width: 24px;
      height: 24px;

      ${media[0]} {
        width: 36px;
        height: 36px;
      }
    }
  `;

  const iconWrapperCss = css`
    display: inline-flex;
    flex-direction: column;
    margin: 0;
    padding: 0.5rem;
    background: #fff;
    box-shadow: 0 1px 8px
      ${colors
        .chroma(colors.brand.columbiaBlue)
        .alpha(0.6)
        .css()};
    color: ${colors.gray.minus2};
    font-size: ${fontSize(-3)};
    font-family: ${fontFamily.monospace};
    transition: color 100ms linear, box-shadow 100ms linear;
    align-items: center;

    ${media[0]} {
      font-size: ${fontSize(-2)};
      padding: 1rem;
    }

    ${media[1]} {
      font-size: ${fontSize(-1)};
      padding: 1rem;
    }

    &:hover {
      background: #fff;
      box-shadow: 0 4px 12px ${colors.chroma(colors.brand.columbiaBlue).css()};
      color: ${colors.gray.minus2};
    }

    &:active {
      background: #fff;
      box-shadow: 0 1px 8px
        ${colors
          .chroma(colors.brand.columbiaBlue)
          .alpha(0.6)
          .css()};
      color: ${colors.gray.minus2};
    }

    &.icon-wrapper-copied {
      position: relative;

      &::after {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        display: flex;
        font-family: ${fontFamily.sans};
        background: ${colors.brand.alabaster};
        content: 'Copied';

        justify-content: center;
        align-items: center;
      }
    }
  `;

  const iconsDescriptorCss = css`
    position: absolute;
    top: 0;
    left: 0.5rem;
    padding: 0.5rem 0.5rem;
    border-radius: 0 0 4px 4px;
    background: ${colors.brand.alabaster};
    box-shadow: 0 2px 8px
      ${colors
        .chroma(colors.brand.alabaster)
        .darken(2)
        .alpha(0.3)
        .css()};
    font-size: ${fontSize(-1)};

    ${media[0]} {
      left: 1.5rem;
    }
  `;

  return (
    <section className="icons-standard" css={iconsStandardCss}>
      <span className="icons-descriptor" css={iconsDescriptorCss}>
        Click an icon to copy its ID.
      </span>
      {iconNames.map((iconName) => {
        return (
          <button
            key={`${idPrefix}${iconName}`}
            className="button button-minimal icon-wrapper"
            css={iconWrapperCss}
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

IconPresenter.defaultProps = {};

export default IconPresenter;
