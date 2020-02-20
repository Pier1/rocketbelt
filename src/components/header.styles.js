import { css } from '@emotion/core';
import { media, colors } from '../utils/rocketbelt';

export const headerCss = css`
  position: fixed;
  padding: 0 0.25rem;
  min-height: 44px;
  width: 100%;
  border-bottom: 3px solid ${colors.brand.prussianBlue};
  background: #fff;
  box-shadow: 0 1px 12px 0 rgba(0, 0, 0, 0.08);

  ${media[0]} {
    margin: 2rem auto 0 auto;
    padding: 0 1rem;
    max-width: calc(1024px - 8rem);
    width: calc(100% - 8rem);
    border: 3px solid ${colors.brand.prussianBlue};
  }

  @media screen and (min-width: 480px) {
    right: 0;
    left: 0;

    &::before {
      position: fixed;
      top: calc(-2rem - 3px);
      right: -3px;
      left: -3px;
      padding: 0 1rem;
      height: 2rem;
      background-image: linear-gradient(
        180deg,
        #ffffff 0%,
        rgba(255, 255, 255, 0.98) 17%,
        rgba(255, 255, 255, 0.95) 31%,
        rgba(255, 255, 255, 0.9) 43%,
        rgba(255, 255, 255, 0.85) 54%,
        rgba(255, 255, 255, 0.79) 63%,
        rgba(255, 255, 255, 0.73) 72%,
        rgba(255, 255, 255, 0.65) 81%,
        rgba(255, 255, 255, 0.58) 90%,
        rgba(255, 255, 255, 0.5) 100%
      );
      content: '';
    }
  }
`;
