import React, { useState } from 'react';
import { styled } from 'styled-components';

import {
  //...
  MdOutlineEdit, // 수정 아이콘
  MdOutlineDelete, // 삭제 아이콘
} from 'react-icons/md';

const CommentItem = styled.div`
  /* border: 3px solid palegreen; */

  width: 100%;
  height: auto;
  margin-top: 40px;
`;

const MemoBox = styled.div`
  text-align: center;
  font-weight: 900;
`;

const CommentAuthor = styled.div`
  /* border: 5px solid purple; */
  font-size: 12px;
  color: grey;
`;

const CommentBox = styled.div`
  /* border: 5px solid yellow; */

  display: flex;
  flex-direction: column;
`;

const CommentContent = styled.div`
  /* border: 5px solid red; */

  width: 100%;
  height: auto;
  background-color: #e2e2e2;
  color: black;
  padding: 7px;
  margin-top: 5px;
  word-wrap: break-word;
`;
const CommentDate = styled.span`
  /* border: 5px solid blue; */

  font-size: 5px;
`;

const CommentBtnGroup = styled.div`
  border: 5px solid black;
  display: flex;
`;

const CommentEditButton = styled.button`
  border: none;
  background-color: transparent;
`;
const CommentDeleteButton = styled.button`
  border: none;
  background-color: transparent;
`;

const CommentList = ({ comment, removeComment, editComment }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedComment, setEditedComment] = useState(comment.description);

  const handleEdit = () => {
    if (editMode) {
      editComment(comment.id, editedComment);
    }
    setEditMode(!editMode);
  };

  const handleDelete = () => {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      removeComment(comment.id);
    }
  };

  return (
    <CommentItem>
      <MemoBox>📝MEMO📝</MemoBox>
      <CommentAuthor>{comment.author}</CommentAuthor>
      <CommentBox>
        {editMode ? (
          <input
            type="text"
            value={editedComment}
            onChange={(e) => setEditedComment(e.target.value)}
          />
        ) : (
          <CommentContent>{comment.description}</CommentContent>
        )}
        <CommentDate>
          {new Date(comment.createdTime).toISOString().slice(0, 10) +
            ' ' +
            new Date(comment.createdTime).toLocaleString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })}{' '}
          <CommentBtnGroup>
            <CommentEditButton onClick={handleEdit}>
              <MdOutlineEdit />
            </CommentEditButton>
            <CommentDeleteButton onClick={handleDelete}>
              <MdOutlineDelete />
            </CommentDeleteButton>
          </CommentBtnGroup>
        </CommentDate>
      </CommentBox>
    </CommentItem>
  );
};

export default CommentList;
