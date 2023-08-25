import React, { useState, useEffect } from 'react';
import { styled } from 'styled-components';
import { RecoilRoot, useRecoilState } from 'recoil';
import { eventState } from '../recoilState';
import { getScheduleListApi } from '../api';

import RightBar from '../components/RightBar/RightBar';
import TUICalendar from '../components/MainCalendar/TUICalendar';

function Layout() {
  const [events, setEvents] = useRecoilState(eventState);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
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
          <CalendarWrapper>
            <TUICalendar
              schedules={schedules}
              events={events}
              setEvents={setEvents}
              view="month"
              setSelectedEvent={setSelectedEvent}
            />
          </CalendarWrapper>
          <RightBar selectedEvent={selectedEvent} />
        </Wrapper>
      </Container>
    </RecoilRoot>
  );
}

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
  width: 90vw;
  height: 90%;
  border: 1px solid rgb(235, 247, 239);
  background-color: rgb(254, 250, 250);
  border-radius: 30px 30px 30px 30px;
  box-shadow:
    12px 12px 13px #c8c4c4,
    -12px -12px 13px #ffffff;
  margin-bottom: 0.5%;
`;

const CalendarWrapper = styled.div`
  width: 85%;
`;

export default Layout;
