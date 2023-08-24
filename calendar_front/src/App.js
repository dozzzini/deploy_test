import { useEffect } from 'react';
import { Reset } from 'styled-reset';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import routes from './routes';
import { GlobalStyle } from './GlobalStyles';
import Layout from './screens/Layout';
import Welcome from './screens/Welcome';
import LoginSignup from './screens/LoginSignup';
import Login from './components/Login';
import Signup from './components/Signup';
import Landing from './screens/Landing';
import { loggedIn } from './recoilState';

function App() {
  const [isLogin, setIsLogin] = useRecoilState(loggedIn);
  useEffect(() => {
    const access_token = localStorage.getItem('access_token');
    const refresh_token = localStorage.getItem('refresh_token');
    console.log(isLogin);
    if (access_token && refresh_token) {
      setIsLogin(true);
      return;
    } else {
      return;
    }
  }, [isLogin]);

  return (
    <Router>
      <Reset />
      <GlobalStyle />
      <Routes>
        <Route
          path={routes.layout}
          element={isLogin ? <Layout /> : <LoginSignup />}
        />
        <Route path={routes.welcome} element={<Welcome />} />
        <Route path={routes.landing} element={<Landing />} />
        <Route path={routes.signup} element={<Signup />} />
        <Route path={routes.login} element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
