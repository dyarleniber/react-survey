import React, { memo } from 'react';
import { Logo } from '@/presentation/components';
import Styles from './header-styles.scss';

const Header: React.FC = () => {
  const buttonClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
    event.preventDefault();
  };
  return (
    <header className={Styles.headerWrap}>
      <div className={Styles.headerContent}>
        <Logo />
        <div className={Styles.logoutWrap}>
          <span data-testid="username">Account</span>
          <a data-testid="logout" href="#" onClick={buttonClick}>Logout</a>
        </div>
      </div>
    </header>
  );
};

export default memo(Header);
