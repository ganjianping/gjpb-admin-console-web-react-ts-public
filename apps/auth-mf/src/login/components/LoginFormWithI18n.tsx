// Login form component wrapper
import React from 'react';
import { useTranslation } from 'react-i18next';
import LoginForm from './LoginForm';
import type { LoginCredentials } from '../../../../shared-lib/src/api/auth-service';

interface LoginFormWrapperProps {
  onSubmit: (data: LoginCredentials) => Promise<void>;
  error?: string | null;
}

// This wrapper provides translations to the login form
const LoginFormWrapper: React.FC<LoginFormWrapperProps> = (props) => {
  const { t } = useTranslation();

  // This helps ensure that the "submit" button text always has a value
  const getSubmitText = () => {
    return t('login.form.submit', 'Login');
  };

  // Pass additional props to help with translation
  const enhancedProps = {
    ...props,
    submitText: getSubmitText(),
  };
  
  return <LoginForm {...enhancedProps} />;
};

export default LoginFormWrapper;