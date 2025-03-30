import { InputHTMLAttributes } from 'react';
import styled from 'styled-components';

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  type?: string;
}

export default function Input({ type = 'text', ...rest }: IProps) {
  return <StyledInput type={type} {...rest} />;
}

const StyledInput = styled.input`
  outline: none;
  opacity: 1;
  width: 100%;
  height: 40px;
  border-radius: 3px;
  border: 1px solid #ddd;
  background-color: transparent;
  color: #000;
  font-size: 16px;
  &::placeholder {
    color: #999;
  }
  /* &:read-only {
      background-color: #eeeeee;
      cursor: default;
    }
    &:disabled {
      background-color: #dddddd;
      cursor: default;
    } */
`;
