import React, { useRef } from 'react';
import { styled } from 'styled-components';

const Overlay = styled.div`
  border: 1px solid black;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0);
  // z-index: 1000;
`;

const SearchInfoContainer = styled.div`
  border: 1px solid red;

  position: fixed;
  // display: flex;
  right: 0;
  top: 0;
  border-radius: 6px;
  width: 10vw;
  background-color: rgb(249, 249, 249);
  box-shadow:
    -3px -3px 8px rgba(235, 245, 235, 1),
    3px 3px 8px rgba(10, 50, 70, 0.3);
  // z-index: 1005;
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
  color: lightgrey;
  font-size: 14px;
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
            <NoMatchingData>No matching events</NoMatchingData>
          )}
        </Wrapper>
      </SearchInfoContainer>
    </Overlay>
  );
}

export default SearchInfo;
