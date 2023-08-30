import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { myInfoUpdateAPi, myInfoDeleteApi, getMyInfo } from '../../api';

const UserInfoContent = () => {
  const [user, setUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const fetchUserInfo = async () => {
    try {
      const response = await getMyInfo();
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await myInfoUpdateAPi({ password: newPassword });
      alert('비밀번호가 변경되었습니다. 다시 로그인해주세요.');
      // TODO: 로그아웃 또는 홈페이지 이동 로직을 추가하세요.
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  const handleAccountDeletion = async () => {
    try {
      await myInfoDeleteApi({ refresh: localStorage.getItem('refresh_token') });
      alert('계정이 성공적으로 삭제되었습니다.');
      localStorage.clear();
      navigate('/login', { replace: true });
      // TODO: 로그아웃 또는 홈페이지 이동 로직을 추가하세요.
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);
  if (user === null) {
    return <div>Loading...</div>; // 데이터를 기다리는 동안 로딩 표시
  }
  return (
    <div>
      <h2>사용자 정보</h2>
      <p>이름: {user.username || '사용자 이름 없음'}</p>
      <h2>비밀번호 변경</h2>
      <Form>
        <Form.Group controlId="newPassword">
          <Form.Label>새 비밀번호</Form.Label>
          <Form.Control
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="confirmPassword">
          <Form.Label>비밀번호 확인</Form.Label>
          <Form.Control
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" onClick={handlePasswordChange}>
          비밀번호 변경
        </Button>
      </Form>

      <Button variant="danger" onClick={handleAccountDeletion}>
        계정 삭제
      </Button>
    </div>
  );
};

export default UserInfoContent;
