import React, { useRef } from 'react';
import { styled } from 'styled-components';

const SearchInfoContainer = styled.div`
  border: none;
  border-radius: 6px;
  background-color: white;
  box-shadow: inset 2px 5px 10px rgba(200, 200, 200, 0.2);
`;

const Wrapper = styled.li`
  display: flex;
  flex-direction: column;
  padding: 8px;
  padding-bottom: 12px;
`;

const SearchList = styled.div`
  font-size: 16px;
  padding: 6px 0;
  border-bottom: 1px solid rgb(235, 237, 239);
  font-weight: 100;
`;
const SearchTeam = styled.span`
  font-size: 10px;
  font-weight: 100;
`;
const NoMatchingData = styled.p`
  color: black;
  font-size: 10px;
`;

function SearchInfo({ matchingData, schedules }) {
  return (
    <SearchInfoContainer>
      <Wrapper>
        <ul>
          {matchingData.length === 0 ? (
            <NoMatchingData>No matching data found.</NoMatchingData>
          ) : (
            matchingData.map((schedule) => (
              <SearchList key={schedule.id}>
                <SearchTeam>
                  title: {schedule.title}
                  <p>Start Date: {schedule.start_date}</p>
                  <p>End Date: {schedule.end_date}</p>
                  <p>Team: {schedule.team.teamname}</p>
                </SearchTeam>
              </SearchList>
            ))
          )}
        </ul>
      </Wrapper>
    </SearchInfoContainer>
  );
}

export default SearchInfo;
