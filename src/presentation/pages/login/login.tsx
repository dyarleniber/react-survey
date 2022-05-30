import React from 'react';
import { Footer, LoginHeader } from '@/presentation/components';
import { Input, SubmitButton } from '@/presentation/pages/login/components';
import Styles from './login-styles.scss';

const Login: React.FC = () => {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
  };

  return (
    <div className={Styles.loginWrap}>
      <LoginHeader />
      <form data-testid="form" className={Styles.form} onSubmit={handleSubmit}>
        <h2>Login</h2>
        <Input type="email" name="email" placeholder="Enter your email" />
        <Input type="password" name="password" placeholder="Enter your password" />
        <SubmitButton text="Login" />
      </form>
      <Footer />
    </div>
  );
};

export default Login;
