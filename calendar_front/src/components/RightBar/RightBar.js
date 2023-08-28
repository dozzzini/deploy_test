import React from 'react';
import { styled } from 'styled-components';
import Status from './Status';
import Header from '../MainCalendar/Header';

function RightBar({ selectedEvent }) {
  return (
    <Container>
      <Wrapper>
        <Header />
        <Status selectedEvent={selectedEvent} />
      </Wrapper>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  width: 10vw;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

export default RightBar;
