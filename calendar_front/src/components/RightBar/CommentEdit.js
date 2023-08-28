import React, { useState } from 'react';
// import { MdOutlineInsertComment } from 'react-icons/md';
import { styled } from 'styled-components';

const CommentEdit = ({ schedule, author, addComment }) => {
  const [description, setDescription] = useState('');
  const inputRef = React.useRef(null);

  const inputStyle = {
    // border: '1px solid blue',
    border: 'none',
    outline: 'none',
    fontSize: '12px',
    width: '100%',
    marginTop: '30px',
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (description.trim() === '') {
      inputRef.current.focus();
      return;
    }

    addComment({
      schedule,
      author,
      description,
      createdTime: new Date(),
    });

    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        style={inputStyle}
        ref={inputRef}
        type="text"
        placeholder="댓글을 입력하세요"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      {/* <button type="submit">
        <MdOutlineInsertComment />
      </button> */}
    </form>
  );
};

export default CommentEdit;
