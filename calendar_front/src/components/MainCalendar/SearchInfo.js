import React, { useRef } from 'react';
import { styled } from 'styled-components';

const Overlay = styled.div`
  /* border: 1px solid black; */
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const SearchInfoContainer = styled.div`
  /* border: 1px solid red; */
  position: absolute;
  top: 140px;
  right: 80px;
  transform: translate(-50%, -50%);
  white-space: nowrap;
  width: auto;
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
  width: 29vw;
  border-bottom: 1px solid rgb(235, 237, 239);
  font-weight: 100;
`;
const SearchTeam = styled.span`
  font-size: 17px;
  font-weight: 100;
`;
const NoMatchingData = styled.p`
  color: black;
  font-size: 10px;
`;

function SearchInfo({ onClose, matchingData, initialCalendars }) {
  const overlayRef = useRef(null);

  const handleOverlayClick = (event) => {
    if (overlayRef.current === event.target) {
      onClose();
    }
  };

  return (
    <Overlay ref={overlayRef} onClick={handleOverlayClick}>
      <SearchInfoContainer>
        <Wrapper>
          {matchingData.length >= 1 ? (
            <ul>
              {matchingData.map((item) => {
                console.log('Matching Item:', item);
                const foundCalendar = initialCalendars.find(
                  (calendar) => calendar.id === item.calendarId,
                );

                return (
                  <SearchList key={item.id}>
                    <SearchTeam>
                      {foundCalendar ? foundCalendar.name : 'N/A'}
                    </SearchTeam>
                    <br />
                    Title: {item.title}
                    <br />
                    Start:{' '}
                    {item.start instanceof Date ? item.start.toString() : 'N/A'}
                    <br />
                    End:{' '}
                    {item.end instanceof Date ? item.end.toString() : 'N/A'}
                  </SearchList>
                );
              })}
            </ul>
          ) : (
            <NoMatchingData>검색한 일정이 없습니다.</NoMatchingData>
          )}
        </Wrapper>
      </SearchInfoContainer>
    </Overlay>
  );
}

export default SearchInfo;
