import React, { useState } from 'react';
import { styled } from 'styled-components';
import moment from 'moment';
import { deleteCommentApi, editCommentApi } from '../../api';

import {
  MdOutlineEdit,
  MdOutlineDelete,
  MdOutlineCancel,
} from 'react-icons/md';

const CommentDetailBox = styled.div`
  margin-top: 10px;
`;
const CommentItem = styled.div`
  width: 100%;
  height: 100%;
`;

const CommentAuthor = styled.div`
  font-size: 10px;
  color: black;
`;

const CommentBox = styled.div`
  border-bottom: 1px solid rgb(235, 237, 239);
  display: flex;
`;

const CommentContent = styled.div`
  width: 70%;
  height: auto;
  background-color: transparent;
  color: black;
  word-wrap: break-word;
  font-size: 10px;
`;

const CommentDate = styled.div`
  width: 100%;
  font-size: 5px;
  white-space: nowrap;
  font-weight: 100;
`;

const CommentBtnGroup = styled.div`
  display: flex;
  justify-content: end;
  width: 30%;
`;

const CommentEditButton = styled.button`
  border: none;
  transform: scale(0.8);
  background-color: transparent;
  padding-inline: unset;
`;
const CommentDeleteButton = styled.button`
  border: none;
  transform: scale(0.8);
  background-color: transparent;
  padding-inline: unset;
`;

const CommentList = ({ comment, removeComment, editComment }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedComment, setEditedComment] = useState(comment.description);

  const handleEdit = async () => {
    try {
      await editCommentApi(comment.id, editedComment);

      editComment(comment.id, editedComment);
      setEditMode(false);
    } catch (error) {
      console.error('댓글 수정 중 오류:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      try {
        await deleteCommentApi(comment.id);

        removeComment(comment.id);
      } catch (error) {
        console.error('댓글 삭제 중 오류:', error);
      }
    }
  };
  const inputStyle = {
    border: 'none',
    outline: 'none',
    fontSize: '12px',
    width: '100%',
    marginTop: '30px',
  };
  return (
    <CommentDetailBox>
      <CommentItem>
        <CommentAuthor>{comment.author.username} </CommentAuthor>
        <CommentDate>
          {moment(comment.createdTime).format('YYYY-MM-DD HH:mm')}{' '}
        </CommentDate>

        <CommentBox>
          {editMode ? (
            <input
              type="text"
              value={editedComment}
              onChange={(e) => setEditedComment(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleEdit();
                }
              }}
            />
          ) : (
            <CommentContent>{editedComment} </CommentContent>
          )}{' '}
          <CommentBtnGroup>
            <CommentEditButton onClick={() => setEditMode(!editMode)}>
              {editMode ? <MdOutlineCancel /> : <MdOutlineEdit />}
            </CommentEditButton>
            <CommentDeleteButton onClick={handleDelete}>
              <MdOutlineDelete />
            </CommentDeleteButton>
          </CommentBtnGroup>
        </CommentBox>
      </CommentItem>
    </CommentDetailBox>
  );
};

export default CommentList;
