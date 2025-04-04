import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface IProps {
  children: ReactNode;
  selector: string;
}

export default function Portal({ children, selector }: IProps) {
  const element =
    typeof window !== 'undefined' && document.querySelector(selector);
  return element && children ? createPortal(children, element) : null;
}
