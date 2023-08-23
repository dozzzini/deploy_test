import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import routes from './routes';

import { GlobalStyle } from './screens/LoginStyles';
import Layout from './screens/Layout';
import Welcome from './screens/Welcome';
import LoginSignup from './screens/LoginSignup';
import Login from './components/Login';
import Signup from './components/Signup';

import { useState } from 'react';
import { Reset } from 'styled-reset';
import Landing from './screens/Landing';

function App() {
  const [isLogin, setIsLogin] = useState(false);

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
