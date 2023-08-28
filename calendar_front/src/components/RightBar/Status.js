import React, { useState, useEffect } from 'react';
import CommentList from './CommentList';
import CommentEdit from './CommentEdit';
import { eventDetailEditApi } from '../../api';
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
  /* border: 2px solid black; */
  width: 100%;
  height: auto;
  margin-top: 15px;
  padding-left: 5px;
  padding-right: 5px;
  font-size: 10px;
  font-weight: 600;
  line-height: 2;
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

export default function Status({ selectedEvent }) {
  const [comments, setComments] = useState([]);
  console.log(selectedEvent, '냐냐냐');

  useEffect(() => {
    const eventComments = comments.filter(
      (comment) => comment.schedule === selectedEvent?.id,
    );
    setComments(eventComments);
  }, [selectedEvent]);

  const addComment = (newComment) => {
    setComments([...comments, newComment]);
  };

  if (!selectedEvent) {
    return <StatusContent>일정 없음</StatusContent>;
  }

  const { calendarId, title, location, start, end, isAllday, state } =
    selectedEvent;

  console.log(selectedEvent);
  const startDate = new Date(start);
  const endDate = new Date(end);

  const startTime = startDate.toLocaleTimeString('ko-KR', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  const endTime = endDate.toLocaleTimeString('ko-KR', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

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

  return (
    <ScheduleDetailBox>
      <ScheduleDetailTitle>📌 일정 상세 정보 📌</ScheduleDetailTitle>
      <ButtonBox>
        <ScheduleEditBtn>편집</ScheduleEditBtn>
        <ScheduleDeleteBtn>삭제</ScheduleDeleteBtn>
      </ButtonBox>
      <p>♦️ {calendarId}</p>
      <p>♦️ {title}</p>
      <p>{location ? location : ''}</p>
      <p>
        ⏰ 시작일시 ⏰
        <br /> {startTime} <br />
        ⏰ 종료일시 ⏰
        <br /> {endTime}
      </p>
      <p>{isAllday ? '하루종일' : ''}</p>
      <p>✔️{state === 'Free' ? 'Done' : 'Todo'}✔️</p>

      {comments.map((comment) => (
        <CommentList
          key={comment.id}
          comment={comment}
          removeComment={removeComment}
          editComment={editComment}
        />
      ))}
      <CommentEdit
        schedule={selectedEvent.id}
        author="nickname"
        addComment={addComment}
      />
    </ScheduleDetailBox>
  );
}
