import { createGlobalStyle } from 'styled-components';
import { Pretendard } from './fonts';
import { reset } from './variable';

const GlobalStyle = createGlobalStyle`
  *,
  :before,
  :after {
    ${reset};
  }
  html {
    scroll-behavior: auto;
    scrollbar-width: thin;
    height: 100%;
  }
  body {
    height: 100%;
    font-family: ${Pretendard.style.fontFamily}, 'sans-serif';
    font-weight: 400;
    font-size: 16px;
    line-height: 1.5;
    color: var(--primary-font);
    background-color: var(--document-background);
    transition: all var(--theme-change-duration);
    -webkit-text-size-adjust: 100%;
    min-width: 360px;
    &.is-mobile {
      font-size: 12px;
    }
    &.is-scroll-lock {
      overflow: hidden;
    }
  }
  ol,
  ul {
    list-style: none;
  }
  table {
    width: 100%;
    border-spacing: 0;
    table-layout: fixed;
  }
  th,
  td {
    text-align: center;
    vertical-align: middle;
  }
  a {
    text-decoration: none;
  }
  button,
  input[type='file'],
  input[type='image'],
  input[type='reset'],
  input[type='button'],
  input[type='submit'] {
    border: none;
    border-radius: 0;
    background-color: transparent;
    appearance: none;
    cursor: pointer;
  }
  input:not([type]),
  input[type='date'],
  input[type='datetime-local'],
  input[type='email'],
  input[type='month'],
  input[type='number'],
  input[type='password'],
  input[type='search'],
  input[type='tel'],
  input[type='text'],
  input[type='time'],
  input[type='url'],
  input[type='week'],
  textarea,
  select {
    display: inline-block;
    width: 100%;
    height: 40px;
    font-size: 16px;
    line-height: 38px;
    padding: 0 10px;
    box-shadow: none;
    border-radius: 0px;
    box-sizing: border-box;
  }
  textarea {
    height: 300px;
    padding: 10px;
    line-height: 1.5;
  }
  input[type='number'] {
    &::-webkit-outer-spin-button,
    ::-webkit-inner-spin-button {
      appearance: none;
    }
  }
`;

export default GlobalStyle;
