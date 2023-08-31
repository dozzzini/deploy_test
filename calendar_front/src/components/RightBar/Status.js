import React, { useState, useEffect } from 'react';

import CommentList from './CommentList';
import CommentEdit from './CommentEdit';
import {
  eventDetailEditApi,
  eventDetailDeleteApi,
  getEventCommentsApi,
} from '../../api';
import { styled } from 'styled-components';

const StatusContent = styled.div`
  white-space: nowrap;
  text-align: center;
  width: 100%;
  color: grey;
  font-size: 10px;
  font-weight: 600;
  margin-top: 200px;
`;

const ScheduleDetailBox = styled.div`
  // border: 2px solid black;
  width: 100%;
  height: 80%;
  margin-top: 15px;
  padding-left: 5px;
  padding-right: 5px;
  font-size: 10px;
  font-weight: 600;
  line-height: 2;
  box-shadow: inset 1px 3px 10px rgba(200, 200, 200, 0.1);
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 6px;
    height: 8px;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.1);
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 6px;
  }
`;

const ScheduleDetailTitle = styled.div`
  white-space: nowrap;
  word-wrap: break-word;
  text-align: center;
  width: 100%;
  color: grey;
  font-size: 13px;
  font-weight: 900;
`;
const ButtonBox = styled.div`
  margin-top: -5px;

  display: flex;
  justify-content: end;
  margin-bottom: 10px;
`;
const ScheduleEditBtn = styled.button`
  transform: scale(0.6);
  background-color: transparent;
  border: none;
  margin-right: -20px;
  color: grey;
`;
const ScheduleDeleteBtn = styled.button`
  transform: scale(0.6);
  background-color: transparent;
  border: none;
  color: grey;
  margin-right: -10px;
`;

const MemoList = styled.div``;

export default function Status({ selectedEvent }) {
  const [comments, setComments] = useState([]);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedLocation, setEditedLocation] = useState('');
  const [editedStartTime, setEditedStartTime] = useState('');
  const [editedEndTime, setEditedEndTime] = useState('');
  const [editedIsAllday, setEditedIsAllday] = useState(false);
  const [editedState, setEditedState] = useState('To do');
  const [isEditMode, setIsEditMode] = useState(false);
  const [memoList, setMemoList] = useState([]);

  useEffect(() => {
    if (selectedEvent) {
      try {
        getEventCommentsApi(selectedEvent.id)
          .then((res) => {
            setMemoList(res.data);
          })
          .catch((err) => console.log('err', err));
      } catch (error) {
        console.error('An error occurred:', error);
      }
    }
  }, [selectedEvent]);

  const addComment = (newComment) => {
    setComments([...comments, newComment]);
  };

  if (!selectedEvent) {
    return <StatusContent>일정 없음</StatusContent>;
  }

  const { calendarName, title, location, start, end, isAllday, state } =
    selectedEvent;
  const startDate = new Date(start);
  const endDate = new Date(end);

  const removeComment = (commentId) => {
    setComments(comments.filter((comment) => comment.id !== commentId));
  };

  const editComment = (commentId, updatedDescription) => {
    setComments(
      comments.map((comment) =>
        comment.id === commentId
          ? { ...comment, description: updatedDescription }
          : comment,
      ),
    );
  };

  const handleEditEvent = () => {
    if (isEditMode) {
      const updatedEvent = {
        ...selectedEvent,
        title: editedTitle,
        location: editedLocation,
        start: editedStartTime,
        end: editedEndTime,
        isAllday: editedIsAllday,
        state: editedState,
      };

      eventDetailEditApi(selectedEvent.id, updatedEvent)
        .then((response) => {
          setIsEditMode(false);
        })
        .catch((error) => {
          console.error('일정 수정 실패:', error);
        });
    } else {
      setIsEditMode(true);
    }
  };

  const startTime = isEditMode
    ? editedStartTime
    : startDate.toLocaleTimeString('ko-KR', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });

  const endTime = isEditMode
    ? editedEndTime
    : endDate.toLocaleTimeString('ko-KR', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });

  const handleDeleteEvent = () => {
    eventDetailDeleteApi(selectedEvent.id)
      .then((response) => {
        window.location.reload();
      })
      .catch((error) => {
        console.error('일정 삭제 실패:', error);
      });
  };
  const inputStyle = {
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontSize: '10px',
    width: '100%',
    // marginTop: '30px',
  };

  return (
    <ScheduleDetailBox>
      <ScheduleDetailTitle>📌 일정 상세 정보 📌</ScheduleDetailTitle>
      <ButtonBox>
        <ScheduleEditBtn onClick={handleEditEvent}>
          {isEditMode ? '저장' : '편집'}
        </ScheduleEditBtn>
        <ScheduleDeleteBtn onClick={handleDeleteEvent}>삭제</ScheduleDeleteBtn>
      </ButtonBox>
      <div>
        <input style={inputStyle} value={calendarName} readOnly />
        <input
          placeholder={
            isEditMode ? '일정명을 수정하세요' : '일정명이 없습니다.'
          }
          style={inputStyle}
          value={isEditMode ? `${editedTitle}` : title}
          onChange={(e) => setEditedTitle(e.target.value)}
          readOnly={!isEditMode}
        />
        <input
          placeholder={
            isEditMode
              ? '일정의 세부내용을 수정하세요'
              : '일정의 세부내용이 없습니다'
          }
          style={inputStyle}
          value={isEditMode ? editedLocation : location ? location : ''}
          onChange={(e) => setEditedLocation(e.target.value)}
          readOnly={!isEditMode}
        />
        ⏰ 시작일시 ⏰
        <input
          placeholder={
            isEditMode
              ? '일정의 시작일시를 수정하세요'
              : '일정의 시작일시를 입력하세요'
          }
          style={inputStyle}
          value={isEditMode ? editedStartTime : startTime}
          onChange={(e) => setEditedStartTime(e.target.value)}
          // style={{ whiteSpace: 'pre-line' }}
          readOnly={!isEditMode}
        />
        ⏰ 종료일시 ⏰
        <input
          placeholder={
            isEditMode
              ? '일정의 종료일시를 수정하세요'
              : '일정의 종료일시를 입력하세요'
          }
          style={inputStyle}
          value={isEditMode ? editedEndTime : endTime}
          onChange={(e) => setEditedEndTime(e.target.value)}
          // style={{ whiteSpace: 'pre-line' }}
          readOnly={!isEditMode}
        />
        <label>
          <input
            type="checkbox"
            checked={editedIsAllday}
            onChange={() => setEditedIsAllday(!editedIsAllday)}
            disabled={!isEditMode}
          />
          하루종일
        </label>
        <label>
          <input
            type="checkbox"
            checked={editedState === 'Done'}
            onChange={() =>
              setEditedState(editedState === 'To do' ? 'Done' : 'To do')
            }
          />
          {editedState === 'Done' ? 'Done' : 'To do'}
        </label>
      </div>

      {comments.map((comment) => (
        <CommentList
          key={comment.id}
          comment={comment}
          removeComment={removeComment}
          editComment={editComment}
        />
      ))}
      {selectedEvent && (
        <CommentEdit
          schedule={selectedEvent.id}
          author="nickname"
          addComment={addComment}
        />
      )}
      <MemoList>
        {memoList &&
          memoList.map((memoItem, index) => {
            // created_at 값을 Date 객체로 파싱합니다.
            const createdAtDate = new Date(memoItem.created_at);

            // 날짜 포맷을 설정합니다. 원하는 형식으로 조정 가능합니다.
            const dateFormat = new Intl.DateTimeFormat('ko-KR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            });

            // 날짜를 원하는 형식으로 포맷합니다.
            const formattedDate = dateFormat.format(createdAtDate);
            const dateStyle = {
              fontSize: '5px',
              color: 'grey',
              fontWeight: '300',
              marginTop: '-10px',
            };
            const memoStyle = {
              marginTop: '-5px',
              borderBottom: '1px solid rgb(226,226,226)',
            };
            return (
              <div key={index}>
                <p>{memoItem.author.username}</p>
                <p style={dateStyle}>{formattedDate}</p>{' '}
                <p style={memoStyle}>{memoItem.description}</p>
                {/* 포맷된 날짜 표시 */}
              </div>
            );
          })}
      </MemoList>
    </ScheduleDetailBox>
  );
}
