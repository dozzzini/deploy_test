import React from 'react';
import { styled } from 'styled-components';
// import SubCalendar from './SubCalendar';
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
  padding: 20px;
  border: 1px solid blue;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Wrapper = styled.div`
  border: 3px solid black;
  width: 100%;
  // display: flex;
  // flex-direction: column;
`;

export default RightBar;
