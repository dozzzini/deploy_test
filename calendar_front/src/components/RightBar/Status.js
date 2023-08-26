import React, { useState, useEffect } from 'react';
import CommentList from './CommentList';
import CommentEdit from './CommentEdit';
import { eventDetailEditApi } from '../../api';
import { styled } from 'styled-components';

const StatusContent = styled.div`
  width: 100%;
  height: 200px;
  margin-top: 50px;
  padding: 10px;
  font-size: 13px;
  font-weight: 600;
  color: grey;
  text-align: center;
`;

const ScheduleDetailBox = styled.div`
  border: 2px solid black;
  width: 100%;
  height: 400px;
  margin-top: 20px;
  padding-left: 5px;
  padding-right: 5px;
  font-size: 12px;
  font-weight: 600;
  line-height: normal;
  color: grey;
`;

const ScheduleDetailTitle = styled.div`
  text-align: center;
  color: grey;
  font-size: 13px;
  font-weight: 900;
  margin-bottom: 20px;
`;

export default function Status({ selectedEvent }) {
  // const [eventPick, setEventPick] = useState({
  //   title: selectedEvent.title,
  //   description: selectedEvent.location,
  //   start: selectedEvent.start,
  //   end: selectedEvent.end,
  //   calendarName: selectedEvent.calendarId,
  //   state: selectedEvent.state,
  // });

  const [comments, setComments] = useState([]);

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
    return <StatusContent>이날의 일정이 없습니다.</StatusContent>;
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
      <ScheduleDetailTitle>📌일정 상세 정보📌</ScheduleDetailTitle>
      <p>🔶{calendarId}</p>
      <p>🔶{title}</p>
      <p>🔶세부 내용 {location}</p>
      <p>
        ⏰시작일시: {startTime} <br />
        ⏰종료일시: {endTime}
      </p>
      <p>{isAllday ? '하루종일' : ''}</p>
      <p>✔️{state === 'Free' ? 'Done' : 'Todo'}</p>

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
      <button>편집</button>
      <button>삭제</button>
    </ScheduleDetailBox>
  );
}
