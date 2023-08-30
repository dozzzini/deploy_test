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
  border-left: 1px solid rgb(226, 226, 226);
  position: relative;
  width: 300px;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

export default RightBar;
