import React from 'react';
import ReactDOM from 'react-dom';

type PortalType = {
  children: React.ReactNode;
  selector?: string;
};

/**
 * 모달을 띄울 리액트 포탈 컴포넌트
 * @param children 모달 컴포넌트
 * @param selector 모달을 띄울 DOM의 selector
 * @returns
 */
function Portal({ children, selector = '#portal' }: PortalType) {
  const element =
    typeof window !== undefined && document.querySelector(selector);

  return element && children ? ReactDOM.createPortal(children, element) : null;
}

export default Portal;
