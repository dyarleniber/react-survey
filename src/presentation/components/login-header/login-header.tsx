import React, { memo } from 'react';
import { Logo } from '@/presentation/components';
import Styles from './login-header-styles.scss';

const LoginHeader: React.FC = () => (
  <header className={Styles.headerWrap}>
    <Logo />
    <h1>Survey</h1>
  </header>
);

export default memo(LoginHeader);
