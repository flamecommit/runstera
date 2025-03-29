import { css } from 'styled-components';

export const reset = css`
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: inherit;
  font-weight: inherit;
  font-size: inherit;
  line-height: inherit;
  color: inherit;
  vertical-align: top;
  text-underline-position: under;
  background-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  word-break: break-word;
`;

export const hoverDown = css`
  .is-mobile & {
    transition: none;
    &:hover {
      translate: 0;
    }
  }
  transition: translate 200ms;
  &:hover {
    translate: 0 2px;
  }
`;

export const hidden = css`
  overflow: hidden;
  position: absolute;
  top: 0;
  z-index: -1;
  visibility: hidden;
`;

export const ellipsis = (line: number) => css`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${line};
`;

export const maskImage = (src: string) => css`
  mask-image: url(${src});
  -webkit-mask-image: url(${src});
`;

export const maskPosition = (value: string) => css`
  mask-position: ${value};
  -webkit-mask-position: ${value};
`;

export const maskSize = (value: string) => css`
  mask-size: ${value};
  -webkit-mask-size: ${value};
`;

export const device = {
  mobile: `(max-width: 768px)`,
};

export const headerHeight = {
  pc: 60,
  mobile: 48,
};

export const footerHeight = {
  pc: 60,
  mobile: 48,
};

export const color = {
  primary: '#FE973A',
};
