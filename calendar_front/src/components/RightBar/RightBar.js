import React from 'react';
import { styled } from 'styled-components';
import SubCalendar from './SubCalendar';
import Status from './Status';

function RightBar({ selectedEvent }) {
  return (
    <Container>
      <Wrapper>
        <SubCalendar />
      </Wrapper>
      <Wrapper>
        <StatusHeader>Status</StatusHeader>
        <Status selectedEvent={selectedEvent} />
      </Wrapper>
    </Container>
  );
}

const Container = styled.div`
  width: 15vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-left: 1px solid rgb(235, 237, 239);
`;
const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
`;

const StatusHeader = styled.div`
  height: 20px;
  color: grey;
  font-weight: 100;
  text-align: center;
  font-size: 22px;
  padding: 4px;
`;

export default RightBar;
