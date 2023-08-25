import { getScheduleListApi } from '../api';
import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { useRecoilState } from 'recoil';
import { eventState, loggedIn } from '../recoilState';
import { useNavigate } from 'react-router';

import RightBar from '../components/RightBar/RightBar';
import TUICalendar from '../components/MainCalendar/TUICalendar';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(242, 242, 242);
`;

const Wrapper = styled.div`
  display: flex;
  max-width: 90vw;
  height: 90vh;
  background-color: rgb(254, 250, 250);
  border-radius: 30px;
  box-shadow:
    12px 12px 13px #c8c4c4,
    -12px -12px 13px #fff;
`;

function Layout() {
  const [events, setEvents] = useRecoilState(eventState);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [isLogin, setIsLogin] = useRecoilState(loggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('layout', isLogin);
    if (!isLogin) {
      navigate('/login', { replace: true });
    }

    getScheduleListApi()
      .then((response) => {
        console.log(response.data, 'dldldl');
        setSchedules(response.data);
      })
      .catch((error) => {
        console.error('스케줄 가져오기 실패:', error);
      });
  }, []);

  console.log(schedules);

  return (
    <RecoilRoot>
      <Container>
        <Wrapper>
          <TUICalendar
            schedules={schedules}
            events={events}
            setEvents={setEvents}
            view="month"
            setSelectedEvent={setSelectedEvent}
          />
          <RightBar selectedEvent={selectedEvent} />
        </Wrapper>
      </Container>
    </RecoilRoot>
  );
}

export default Layout;
