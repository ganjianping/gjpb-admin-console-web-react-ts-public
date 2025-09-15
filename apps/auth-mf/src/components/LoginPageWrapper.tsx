import { Provider } from 'react-redux';
import authMfStore from '../redux/store';
import { LoginPage as LoginPageComponent } from '../pages/LoginPage';

// Wrapper component that provides the auth-mf Redux store
export const LoginPage = () => {
  return (
    <Provider store={authMfStore}>
      <LoginPageComponent />
    </Provider>
  );
};

export default LoginPage;
