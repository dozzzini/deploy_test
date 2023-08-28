import React from 'react';
import { styled } from 'styled-components';
import Status from './Status';
import Header from '../MainCalendar/Header';

function RightBar({ selectedEvent, schedules }) {
  return (
    <Container>
      <Wrapper>
        <Header schedules={schedules} />
        <Status selectedEvent={selectedEvent} />
      </Wrapper>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  width: 10vw;
  // padding: 20px;
  // display: flex;
  // flex-direction: column;
  // justify-content: center;
  // align-items: center;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  // display: flex;
  // flex-direction: column;
`;

export default RightBar;
