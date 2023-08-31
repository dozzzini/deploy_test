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
import LinkEntry from './components/MainCalendar/LinkEntry';
import TeamLogin from './components/MainCalendar/TeamLogin';

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
        {/* <Route path="/api/v1/teams/members/:teamId" element={<LinkEntry />} /> */}
        <Route
          path="/api/v1/teams/members/:encodedTeamId"
          element={<LinkEntry />}
        />
        <Route path={routes.teamlogin} element={<TeamLogin />} />
        <Route path={routes.welcome} element={<Welcome />} />
        <Route path={routes.landing} element={<Landing />} />
      </Routes>
    </Router>
  );
}

export default App;
