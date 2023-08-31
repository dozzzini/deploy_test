import { styled } from 'styled-components';
import React, { useState, useEffect } from 'react';
import moment from 'moment';

import {
  getEventCommentsApi,
  deleteCommentApi,
  editCommentApi,
  createCommentApi,
} from '../../api';
const CommentContainer = styled.div`
  margin-top: 4px;
  width: 100%;
`;
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  /* align-items: center; */
  margin-left: 5px;
  width: 100%;
  height: 260px;
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
const CommentBox = styled.div``;
const CommentList = styled.div``;
const CommentEdit = styled.form``;
const Button = styled.button`
  transform: scale(0.6);
  background-color: transparent;
  border: none;
  margin-right: -20px;
  color: grey;
`;
function Comment({ selectedEvent }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  useEffect(() => {
    if (selectedEvent) {
      try {
        getEventCommentsApi(selectedEvent.id)
          .then((res) => {
            setComments(res.data);
          })
          .catch((err) => console.log('gmldms err', err));
      } catch (error) {
        console.error('An error occurred:', error);
      }
    }
  }, [selectedEvent]);

  const handleEditComment = async (commentId, updatedDescription) => {
    try {
      const response = await editCommentApi(commentId, updatedDescription);
      const updatedComment = response.data;
      const updatedComments = comments.map((comment) =>
        comment.id === updatedComment.id ? updatedComment : comment,
      );
      setComments(updatedComments);
      setEditingCommentId(null);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
  //   const removeComment = (commentId) => {
  //     setComments(comments.filter((comment) => comment.id !== commentId));
  //   };

  const handleDelete = async (commentId) => {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      try {
        await deleteCommentApi(commentId); // 댓글 삭제 API 호출

        // 댓글 삭제 후 상태 업데이트
        setComments(comments.filter((comment) => comment.id !== commentId));
      } catch (error) {
        console.error('댓글 삭제 중 오류:', error);
      }
    }
  };

  //   const handleAddComment = async () => {
  //     if (newComment.trim() === '') {
  //       return;
  //     }

  //     try {
  //       const response = await createCommentApi(selectedEvent.id, newComment);
  //       const addedComment = response.data;
  //       setComments([...comments, addedComment]);
  //       setNewComment('');
  //     } catch (error) {
  //       console.error('An error occurred:', error);
  //     }
  //   };
  return (
    <CommentContainer>
      <Wrapper>
        <CommentList>
          {comments &&
            comments.map((comment) => (
              <CommentBox key={comment.id}>
                <div>{comment.author.username}</div>
                <div>
                  {moment(comment.createdTime).format('YYYY-MM-DD HH:mm')}{' '}
                </div>
                <div>
                  {editingCommentId === comment.id ? (
                    <input
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                  ) : (
                    <span>{comment.description}</span>
                  )}
                  <span>
                    {editingCommentId === comment.id ? (
                      <Button
                        onClick={() =>
                          handleEditComment(comment.id, newComment)
                        }
                      >
                        저장
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={() => {
                            setEditingCommentId(comment.id);
                            setNewComment(comment.description);
                          }}
                        >
                          편집
                        </Button>
                        <Button onClick={() => handleDelete(comment.id)}>
                          삭제
                        </Button>
                      </>
                    )}
                  </span>
                </div>
              </CommentBox>
            ))}
        </CommentList>
      </Wrapper>
    </CommentContainer>
  );
}

export default Comment;
