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
  const [isLoading, setIsLoading] = useState(true);
  const [teams, setTeams] = useState([]); // 팀 데이터 상태 추가
  const navigate = useNavigate();

  useEffect(() => {
    const access_token = localStorage.getItem('access_token');
    const refresh_token = localStorage.getItem('refresh_token');

    if (!(access_token && refresh_token)) {
      navigate('/login', { replace: true });
    }

    getScheduleListApi()
      .then((response) => {
        console.log(response.data, 'dldldl');
        setSchedules(response.data.schedules);
        console.log(response.data.teams, 'teamData');
        setIsLoading(false);
        setTeams(response.data.teams);
      })
      .catch((error) => {
        console.error('스케줄 가져오기 실패:', error);
        if (!(access_token && refresh_token)) {
          console.log('거의 다 했다');
          navigate('/login', { replace: true });
        }
      });
  }, []);

  console.log(schedules);
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
          />
          <RightBar selectedEvent={selectedEvent} schedules={validSchedules} />
        </Wrapper>
      </Container>
    </RecoilRoot>
  );
}

export default Layout;
