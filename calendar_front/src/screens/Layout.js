import React, { useState } from 'react';
import { styled } from 'styled-components';
import { RecoilRoot, useRecoilState } from 'recoil';
import { eventState } from '../recoilState';

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

  return (
    <RecoilRoot>
      <Container>
        <Wrapper>
          <TUICalendar
            events={events}
            setEvents={setEvents}
            view="month"
            setSelectedEvent={setSelectedEvent}
          />{' '}
          <RightBar selectedEvent={selectedEvent} />
        </Wrapper>
      </Container>
    </RecoilRoot>
  );
}

export default Layout;
