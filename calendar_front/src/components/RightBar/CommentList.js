import React, { useState } from 'react';
import { styled } from 'styled-components';

import {
  //...
  MdOutlineEdit, // 수정 아이콘
  MdOutlineDelete, // 삭제 아이콘
} from 'react-icons/md';

const CommentDetailBox = styled.div`
  /* border: 3px solid pink; */
  margin-top: 10px;
`;
const CommentItem = styled.div`
  /* border: 2px solid palegreen; */

  width: 100%;
  height: auto;
`;

const CommentAuthor = styled.div`
  /* border: 1px solid purple; */
  font-size: 10px;
  color: black;
`;

const CommentBox = styled.div`
  /* border: 3px solid yellow; */

  border-bottom: 1px solid rgb(235, 237, 239);
  display: flex;
`;

const CommentContent = styled.div`
  /* border: 1px solid red; */

  width: 70%;
  height: auto;
  background-color: transparent;
  color: black;
  word-wrap: break-word;
  font-size: 10px;
`;

const CommentDate = styled.div`
  /* border: 1px solid blue; */
  width: 100%;
  font-size: 5px;
  white-space: nowrap;
  font-weight: 100;
`;

const CommentBtnGroup = styled.div`
  /* border: 1px solid black; */

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
    <CommentDetailBox>
      {/* <MemoBox>MEMO</MemoBox> */}

      <CommentItem>
        <CommentAuthor>{comment.author} </CommentAuthor>
        <CommentDate>
          {new Date(comment.createdTime).toISOString().slice(0, 10) +
            ' ' +
            new Date(comment.createdTime).toLocaleString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })}{' '}
        </CommentDate>

        <CommentBox>
          {editMode ? (
            <input
              type="text"
              value={editedComment}
              onChange={(e) => setEditedComment(e.target.value)}
            />
          ) : (
            <CommentContent>{comment.description} </CommentContent>
          )}{' '}
          <CommentBtnGroup>
            <CommentEditButton onClick={handleEdit}>
              <MdOutlineEdit />
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
