import { Reset } from 'styled-reset';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import routes from './routes';
import { GlobalStyle } from './GlobalStyles';
import Layout from './screens/Layout';
import Welcome from './screens/Welcome';
import LoginSignup from './screens/LoginSignup';

import Landing from './screens/Landing';

function App() {
  const checkUserAuth = () => {
    const access_token = localStorage.getItem('access_token');
    const refresh_token = localStorage.getItem('refresh_token');
    return access_token && refresh_token;
  };
  return (
    <Router>
      <Reset />
      <GlobalStyle />
      <Routes>
        <Route path={routes.layout} element={<Layout />} />
        <Route path={routes.login} element={<LoginSignup />} />
        {/* <Route
          path={routes.login}
          element={
            checkUserAuth() ? <Navigate to={routes.layout} /> : <LoginSignup />
          }
        /> */}
        <Route path={routes.welcome} element={<Welcome />} />
        <Route path={routes.landing} element={<Landing />} />
      </Routes>
    </Router>
  );
}

export default App;
