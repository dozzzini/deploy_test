import React from 'react';
import { styled } from 'styled-components';

const SearchInfoContainer = styled.div`
  border: none;
  border-radius: 6px;
  background-color: white;
  box-shadow: inset 2px 5px 10px rgba(200, 200, 200, 0.3);
  margin-top: 4px;
`;

const Wrapper = styled.li`
  display: flex;
  flex-direction: column;
  padding: 0 8px;
  padding-bottom: 4px;
`;

const SearchList = styled.div`
  font-size: 16px;
  border-bottom: 1px solid rgb(235, 237, 239);
`;
const SearchTeam = styled.div`
  font-size: 14px;
  line-height: 1.4;
`;
const NoMatchingData = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 14px;
  background-color: #c1355a;
  padding: 3px;
  border-radius: 5px;
`;

function SearchInfo({ matchingData }) {
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
                  <p>Team: {schedule.team.teamname}</p>
                  <p>schedule.start_date} ~ {schedule.end_date}</p>
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
