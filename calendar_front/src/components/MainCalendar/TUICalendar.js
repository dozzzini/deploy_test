import React, { useCallback, useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';

// import Header from './Header';
import TeamAddModal from './TeamAddModal';
import TeamLinkModal from './TeamLinkModal';
import Calendar from '@toast-ui/react-calendar';
import { TZDate } from '@toast-ui/calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import 'tui-date-picker/dist/tui-date-picker.css';
import 'tui-time-picker/dist/tui-time-picker.css';
import { theme } from './theme';
import { addDate, addHours, subtractDate } from './utils';
import ColorPicker from '../MainCalendar/ColorPicker';
import moment from 'moment';
import instance from '../../api';

import { MdOutlineEdit, MdOutlineDelete } from 'react-icons/md';
import { BiShareAlt } from 'react-icons/bi';
import { teamDeleteApi } from '../../api';
import { teamEditApi } from '../../api';

const viewModeOptions = [
  {
    title: 'MONTHLY',
    value: 'month',
  },
  {
    title: 'WEEKLY',
    value: 'week',
  },
  {
    title: 'DAILY',
    value: 'day',
  },
];

const CalendarContainer = styled.div`
  display: flex;
  height: 90vh;
`;
const ShowMenuBar = styled.div`
  border-right: 1px solid rgb(235, 237, 239);
  display: flex;
  flex-direction: column;
  width: 200px;
`;

const TeamBox = styled.div`
  overflow-y: auto;
  height: 450px;
  width: 100%;
  margin-top: 30px;
`;
const TeamList = styled.label`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 15px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  opacity: 1;
  -webkit-appearance: none;
  cursor: pointer;
  height: 26px;
  width: 26px;
  box-shadow:
    -10px -10px 10px rgba(255, 255, 255, 0.8),
    10px 10px 10px rgba(0, 0, 70, 0.18);
  border-radius: 50%;
  border: none;

  transition: 0.5s;
  &:checked {
    box-shadow:
      -10px -10px 10px rgba(255, 255, 255, 0.8),
      10px 10px 10px rgba(70, 70, 70, 0.18),
      inset -10px -10px 10px rgba(255, 255, 255, 0.3),
      inset 10px 10px 10px rgba(70, 70, 70, 0.18);
    transition: 0.5s;
    background-color: ${(props) => props.bgColor};
  }
`;

const CalendarName = styled.div`
  width: 100%;
  font-weight: 500;
  overflow-wrap: break-word;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  color: grey;
`;
const CalendarButtonBox = styled.div`
  /* border: 1px solid red; */
  margin-top: 5px;
  display: flex;
  justify-content: center;
  width: 100%;
`;
const CalendarEditButton = styled.button`
  border: none;
  transform: scale(0.8);
  background-color: transparent;
  padding-inline: unset;
  opacity: 0.1; /* 초기 투명도 설정 */
  transition: opacity 0.3s ease; /* 호버 시 투명도 변화를 부드럽게 적용 */

  &:hover {
    opacity: 1; /* 호버 시 투명도 증가 */
  }
`;
const CalendarDeleteButton = styled.button`
  border: none;
  transform: scale(0.8);
  background-color: transparent;
  padding-inline: unset;
  opacity: 0.1; /* 초기 투명도 설정 */
  transition: opacity 0.3s ease; /* 호버 시 투명도 변화를 부드럽게 적용 */

  &:hover {
    opacity: 1; /* 호버 시 투명도 증가 */
  }
`;
const CalendarInviteButton = styled.button`
  cursor: pointer;
  border: none;
  transform: scale(0.8);
  background-color: transparent;
  padding-inline: unset;
  opacity: 0.1; /* 초기 투명도 설정 */
  transition: opacity 0.3s ease; /* 호버 시 투명도 변화를 부드럽게 적용 */

  &:hover {
    opacity: 1; /* 호버 시 투명도 증가 */
  }
`;

const MIDContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 60vw;
`;
const CalendarBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;
const CalendarHeader = styled.div`
  width: 100%;
  height: 100px;
  color: grey;
`;
const DateControlBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const DateBox = styled.div`
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
`;
const PrevBtn = styled.button`
  border-radius: 50px;
  outline: none;
  cursor: pointer;
  border: none;
  font-weight: 100;
  font-size: 14px;
  background-color: transparent;
  color: grey;
  &&:hover {
    transform: translateY(1px);
    box-shadow: none;
  }
  &&:active {
    opacity: 0.5;
  }
`;
const NumberBox = styled.div`
  display: flex;
  justify-content: center;
  width: 250px;
  font-size: 18px;
  font-weight: 900;
`;
const NextBtn = styled.button`
  border-radius: 50px;
  outline: none;
  cursor: pointer;
  border: none;
  font-size: 14px;
  background-color: transparent;
  color: grey;
  &&:hover {
    transform: translateY(1px);
    box-shadow: none;
  }
  &&:active {
    opacity: 0.5;
  }
`;

const ClickBox = styled.div`
  width: 100%;
  margin-top: 10px;
  display: flex;
  justify-content: center;
`;
const TodayBtn = styled.button`
  border: none;
  background-color: rgb(254, 250, 250);
  outline: none;
  cursor: pointer;
  font-size: 14px;
  color: grey;
  &&:hover {
    transform: translateY(1px);
    box-shadow: none;
  }
  &&:active {
    opacity: 0.5;
  }
`;
const DateViewSelectBox = styled.div`
  margin-top: 10px;
  width: 250px;
  display: flex;
  justify-content: space-between;
  button {
    border: none;
    background-color: rgb(254, 250, 250);
    font-size: 12px;
    color: grey;
  }
`;

export default function TUICalendar({
  schedules,
  view,
  events,
  setEvents,
  setSelectedEvent,
  teams,
  setTeams,
}) {
  const calendarRef = useRef(null);
  const [selectedDateRangeText, setSelectedDateRangeText] = useState('');
  const [selectedView, setSelectedView] = useState(view);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [showTeamLinkModal, setShowTeamLinkModal] = useState(false);

  const initialCalendars = teams?.map((team) => ({
    id: team.id,
    name: team.teamname,
    backgroundColor: team.color,
    borderColor: team.color,
    dragBackgroundColor: team.color,
    isChecked: true,
  }));

  const initialEvents = schedules?.map((schedule) => ({
    id: schedule.id,
    calendarId: schedule.team.id,
    title: schedule.title,
    start: new TZDate(schedule.start_date),
    end: new TZDate(schedule.end_date),
  }));

  const [selectedCalendars, setSelectedCalendars] = useState(
    initialCalendars.map((calendar) => ({
      ...calendar,
      isChecked: true,
    })),
  );

  const filteredEvents = initialEvents.filter(
    (event) =>
      selectedCalendars.find((calendar) => calendar.id === event.calendarId)
        ?.isChecked,
  );

  const toggleModal = (teamId) => {
    setShowTeamLinkModal((prev) => !prev);
    if (showTeamLinkModal) {
      setSelectedTeamId(teamId);
    }
  };

  const handleCopyClick = (selectedTeamId) => {
    if (selectedTeamId) {
      const link = `https://yourmodeuniljung.shop/members/${btoa(
        selectedTeamId + '',
      )}/`;
      navigator.clipboard
        .writeText(link)
        .then(() => {
          alert('링크가 복사되었습니다.');
        })
        .catch((error) => {
          console.error('링크 복사 실패:', error);
          alert('링크 복사에 실패했습니다.');
        });
    } else {
      alert('복사할 링크가 없습니다.');
    }
  };

  const getCalInstance = useCallback(
    () => calendarRef.current?.getInstance?.(),
    [],
  );

  const updateRenderRangeText = useCallback(() => {
    const calInstance = getCalInstance();
    if (!calInstance) {
      setSelectedDateRangeText('');
    }

    const viewName = calInstance.getViewName();
    const calDate = calInstance.getDate();
    const rangeStart = calInstance.getDateRangeStart();
    const rangeEnd = calInstance.getDateRangeEnd();

    let year = calDate.getFullYear();
    let month = calDate.getMonth() + 1;
    let date = calDate.getDate();
    let dateRangeText;

    switch (viewName) {
      case 'month': {
        dateRangeText = `${year}-${month}`;
        break;
      }
      case 'week': {
        year = rangeStart.getFullYear();
        month = rangeStart.getMonth() + 1;
        date = rangeStart.getDate();
        const endMonth = rangeEnd.getMonth() + 1;
        const endDate = rangeEnd.getDate();

        const start = `${year}-${month < 10 ? '0' : ''}${month}-${
          date < 10 ? '0' : ''
        }${date}`;
        const end = `${year}-${endMonth < 10 ? '0' : ''}${endMonth}-${
          endDate < 10 ? '0' : ''
        }${endDate}`;
        dateRangeText = `${start} ~ ${end}`;
        break;
      }
      default:
        dateRangeText = `${year}-${month}-${date}`;
    }

    setSelectedDateRangeText(dateRangeText);
  }, [getCalInstance]);

  useEffect(() => {
    setSelectedView(view);
  }, [view]);

  useEffect(() => {
    updateRenderRangeText();
  }, [selectedView, updateRenderRangeText]);

  const onAfterRenderEvent = (res) => {
    console.group('onAfterRenderEvent');
    console.log('Event Info : ', res.title);
    console.groupEnd();
  };

  const onBeforeDeleteEvent = (res) => {
    console.group('onBeforeDeleteEvent');
    console.log('Event Info : ', res.title);
    console.groupEnd();

    const { id, calendarId } = res;

    getCalInstance().deleteEvent(id, calendarId);
  };

  const onChangeSelect = (ev) => {
    setSelectedView(ev.target.value);
  };

  const onClickDayName = (res) => {
    console.group('onClickDayName');
    console.log('Date : ', res.date);
    console.groupEnd();
  };

  const onClickNavi = (ev) => {
    if (ev.target.tagName === 'BUTTON') {
      const button = ev.target;
      const actionName = (
        button.getAttribute('data-action') ?? 'month'
      ).replace('move-', '');
      getCalInstance()[actionName]();
      updateRenderRangeText();
    }
  };

  const onClickEvent = (res) => {
    const selectedCalendar = initialCalendars.find(
      (calendar) => calendar.id === res.event.calendarId,
    );

    const updatedEvent = {
      ...res.event,
      calendarName: selectedCalendar ? selectedCalendar.name : '',
    };

    setSelectedEvent(updatedEvent);
  };

  const onClickTimezonesCollapseBtn = (timezoneCollapsed) => {
    const newTheme = {
      'week.daygridLeft.width': '100px',
      'week.timegridLeft.width': '100px',
    };

    getCalInstance().setTheme(newTheme);
  };

  const onBeforeUpdateEvent = (updateData) => {
    console.group('onBeforeUpdateEvent');
    console.log('Event Info: ', updateData);
    console.groupEnd();

    const targetEvent = updateData.event;
    const changes = { ...updateData.changes };

    getCalInstance().updateEvent(
      targetEvent.id,
      targetEvent.calendarId,
      changes,
    );

    getCalInstance().render();
  };

  const onBeforeCreateEvent = async (eventData) => {
    const start_date = moment(eventData.start.d.d).format('YYYY-MM-DD HH:mm');
    const end_date = moment(eventData.end.d.d).format('YYYY-MM-DD HH:mm');
    try {
      const eventForBack = await instance.post('/api/v1/schedules/', {
        title: eventData.title,
        description: eventData.location,
        state: eventData.state === 'Busy' ? 'To do' : 'Done',
        start_date,
        end_date,
        team: eventData.calendarId,
      });

      const selectedCalendar = initialCalendars.find(
        (calendar) => calendar.id === eventData.calendarId,
      );

      const event = {
        calendarId: eventData.calendarId || '',
        calendarName: selectedCalendar ? selectedCalendar.name : '',
        id: eventForBack.id,
        title: eventData.title,
        isAllday: eventData.isAllday,
        start: eventData.start,
        end: eventData.end,
        category: eventData.isAllday ? 'allday' : 'time',
        dueDateClass: '',
        location: eventData.location,
        state: eventData.state,
        isPrivate: eventData.isPrivate,
      };

      getCalInstance().createEvents([event]);
      setEvents([...events, event]);
      setSelectedEvent(event);
    } catch (error) {
      console.log('일정 생성 API 요청 실패', error);
    }
  };

  const showConfirmDialog = (teamId) => {
    const result = window.confirm('일정을 삭제하시겠습니까?');
    if (result) {
      // 확인을 선택한 경우 삭제 작업 수행
      handleDeleteEvent(teamId);
    }
  };

  // 삭제 작업 수행 함수
  const handleDeleteEvent = async (teamId) => {
    try {
      await teamDeleteApi(teamId);
      // 삭제가 완료되면 캘린더에서 해당 일정을 제거하도록 업데이트합니다.
      const updatedCalendars = selectedCalendars.map((item) =>
        item.id === teamId ? { ...item, isChecked: false } : item,
      );
      setSelectedCalendars(updatedCalendars);
      window.location.replace('/calendar');

      // getCalInstance().render();
    } catch (error) {
      console.error('삭제 중 오류 발생:', error);
    }
  };

  const onClickDeleteButton = (teamId) => {
    showConfirmDialog(teamId);
  };
  //수정 작업 수행 함수
  const handleEditEvent = async (teamId, newName, newColor) => {
    try {
      // 수정할 팀 정보를 요청 데이터에 포함합니다.
      const eventData = { teamname: newName, color: newColor };

      const updatedTeamResponse = await teamEditApi(teamId, eventData);

      // 수정이 성공하면 해당 팀 정보를 업데이트합니다.
      const updatedTeams = teams.map((team) =>
        team.id === teamId
          ? { ...team, name: updatedTeamResponse.data.name }
          : team,
      );

      // 업데이트된 팀 목록을 적용합니다.
      setTeams(updatedTeams);
      window.location.replace('/calendar');
    } catch (error) {
      console.error('팀 정보 수정 중 오류 발생:', error);
    }
  };
  return (
    <CalendarContainer>
      <ShowMenuBar>
        <TeamBox>
          {selectedCalendars.map((calendar) => (
            <TeamList key={calendar.id}>
              <Input
                type="checkbox"
                checked={calendar.isChecked}
                bgColor={calendar.backgroundColor}
                onChange={() => {
                  const updatedCalendars = selectedCalendars.map((item) =>
                    item.id === calendar.id
                      ? { ...item, isChecked: !item.isChecked }
                      : item,
                  );
                  setSelectedCalendars(updatedCalendars);
                }}
              />{' '}
              <CalendarButtonBox>
                <CalendarEditButton
                  onClick={() => {
                    // 수정할 팀명을 사용자 입력 또는 다른 방법으로 얻어옵니다.
                    const newName = prompt('새로운 팀명을 입력하세요');

                    if (newName) {
                      handleEditEvent(
                        calendar.id,
                        newName,
                        calendar.backgroundColor,
                      );
                    }
                  }}
                >
                  <MdOutlineEdit />
                </CalendarEditButton>
                <CalendarDeleteButton
                  selectedCalendars={selectedCalendars}
                  onClick={() => onClickDeleteButton(calendar.id)}
                >
                  <MdOutlineDelete />
                </CalendarDeleteButton>
                <CalendarInviteButton
                  selectedCalendars={selectedCalendars}
                  onClick={() => toggleModal(calendar.id)}
                >
                  <BiShareAlt />
                </CalendarInviteButton>
                {showTeamLinkModal && (
                  <TeamLinkModal
                    isOpen={showTeamLinkModal}
                    teamId={selectedTeamId}
                    setTeamId={setSelectedTeamId}
                    handleCopyClick={handleCopyClick}
                    // redirectToCalendar={redirectToCalendar}
                  />
                )}
              </CalendarButtonBox>
              <CalendarName>{calendar.name}</CalendarName>
            </TeamList>
          ))}
        </TeamBox>
        <TeamAddModal />
      </ShowMenuBar>
      <MIDContainer>
        <CalendarBox>
          <CalendarHeader>
            <DateControlBox>
              <DateBox>
                <PrevBtn
                  type="button"
                  className="btn btn-default btn-sm move-day"
                  data-action="move-prev"
                  onClick={onClickNavi}
                >
                  ◀️
                </PrevBtn>
                <NumberBox>
                  <span className="render-range">{selectedDateRangeText}</span>
                </NumberBox>

                <NextBtn
                  type="button"
                  className="btn btn-default btn-sm move-day"
                  data-action="move-next"
                  onClick={onClickNavi}
                >
                  ▶️
                </NextBtn>
              </DateBox>

              <ClickBox>
                <DateViewSelectBox>
                  {viewModeOptions.map((option, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        onChangeSelect({ target: { value: option.value } })
                      }
                      className={selectedView === option.value ? 'active' : ''}
                    >
                      {option.title}
                    </button>
                  ))}
                  <TodayBtn
                    type="button"
                    className="btn btn-default btn-sm move-today"
                    data-action="move-today"
                    onClick={onClickNavi}
                  >
                    TODAY
                  </TodayBtn>
                </DateViewSelectBox>
              </ClickBox>
            </DateControlBox>
          </CalendarHeader>{' '}
          <Calendar
            height="77vh"
            calendars={selectedCalendars}
            month={{
              startDayOfWeek: 0,
              isAlways6Weeks: false,
            }}
            events={filteredEvents}
            template={{
              allday(event) {
                return `[All day] ${event.title}`;
              },
              popupIsAllday() {
                return '하루 종일';
              },
              popupSave() {
                return '저장';
              },
              titlePlaceholder() {
                return '제목';
              },
              popupStateFree() {
                return 'Done';
              },
              popupStateBusy() {
                return 'Todo';
              },
              locationPlaceholder() {
                return '세부 내용';
              },
              popupEdit() {
                return '편집';
              },
              popupDelete() {
                return '삭제';
              },
              popupUpdate() {
                return '저장';
              },
            }}
            theme={theme}
            timezone={{
              zones: [
                {
                  timezoneName: 'Asia/Seoul',
                  displayLabel: 'Seoul',
                  tooltip: 'UTC+09:00',
                },
              ],
            }}
            useDetailPopup={false}
            useFormPopup={true}
            view={selectedView}
            week={{
              showTimezoneCollapseButton: true,
              timezonesCollapsed: false,
              eventView: true,
              taskView: true,
            }}
            ref={calendarRef}
            onAfterRenderEvent={onAfterRenderEvent}
            onBeforeDeleteEvent={onBeforeDeleteEvent}
            onClickDayname={onClickDayName}
            onClickEvent={onClickEvent}
            onClickTimezonesCollapseBtn={onClickTimezonesCollapseBtn}
            onBeforeUpdateEvent={onBeforeUpdateEvent}
            onBeforeCreateEvent={onBeforeCreateEvent}
          />{' '}
        </CalendarBox>
        {showTeamLinkModal && (
          <TeamLinkModal
            teamId={selectedTeamId} // 선택된 팀 ID를 모달에 전달
            onClose={() => setShowTeamLinkModal(false)} // 모달 닫기
          />
        )}
      </MIDContainer>
    </CalendarContainer>
  );
}
