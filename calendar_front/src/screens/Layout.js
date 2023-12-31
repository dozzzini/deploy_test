import { getScheduleListApi } from '../api';
import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { RecoilRoot, useRecoilState } from 'recoil';
import { eventState } from '../recoilState';
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
  background-color: rgb(246 246, 246);
  border-radius: 30px;
  box-shadow:
    12px 12px 16px rgb(226 226, 222),
    -12px -12px 16px #fff;
`;

function Layout() {
  const [events, setEvents] = useRecoilState(eventState);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [teams, setTeams] = useState([]); // 팀 데이터 상태 추가
  const navigate = useNavigate();

  useEffect(() => {
    const access_token = localStorage.getItem('access_token');
    const refresh_token = localStorage.getItem('refresh_token');

    if (!(access_token && refresh_token)) {
      navigate('/', { replace: true });
    }

    getScheduleListApi()
      .then((response) => {
        setSchedules(response.data.schedules);
        setIsLoading(false);
        setTeams(response.data.teams);
      })
      .catch(() => {
        const access = localStorage.getItem('access_token');
        const refresh = localStorage.getItem('refresh_token');
        if (!(access && refresh)) {
          navigate('/', { replace: true });
        }
      });
  }, []);

  // schedules가 배열인지 확인하고, 아니면 빈 배열로 대체합니다.
  const validSchedules = Array.isArray(schedules) ? schedules : [];

  if (isLoading) {
    return <div>Loading or Error Message</div>;
  }

  return (
    <RecoilRoot>
      <Container>
        <Wrapper>
          <TUICalendar
            schedules={validSchedules}
            events={events}
            setEvents={setEvents}
            view="month"
            setSelectedEvent={setSelectedEvent}
            teams={teams}
            setTeams={setTeams}
          />
          <RightBar selectedEvent={selectedEvent} schedules={validSchedules} />
        </Wrapper>
      </Container>
    </RecoilRoot>
  );
}

export default Layout;
