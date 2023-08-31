import React from 'react';
import { styled } from 'styled-components';
import moment from 'moment';

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
  padding-top: 10px;
  color: black;
  font-size: 14px;
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
                  {schedule.title}
                  <p>
                    {schedule.color} {schedule.team.teamname}
                  </p>
                  <p>
                    {moment(schedule.start_date).format('YYYY-MM-DD HH:mm')} ~{' '}
                    {moment(schedule.end_date).format('YYYY-MM-DD HH:mm')}
                  </p>
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
