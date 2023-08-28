import React, { useState } from 'react';
import { createCommentApi } from '../../api';

const CommentEdit = ({ schedule, author, addComment }) => {
  const [description, setDescription] = useState('');
  const inputRef = React.useRef(null);

  const inputStyle = {
    border: 'none',
    outline: 'none',
    fontSize: '12px',
    width: '100%',
    marginTop: '30px',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (description.trim() === '') {
      inputRef.current.focus();
      return;
    }

    try {
      const response = await createCommentApi({
        schedule_id: schedule,
        description: description,
      });

      const newComment = response.data;
      addComment(newComment);
      setDescription('');
    } catch (error) {
      console.error('댓글 생성 중 오류:', error);
    }
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
    </form>
  );
};

export default CommentEdit;
