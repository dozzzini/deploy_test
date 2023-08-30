import React, { useState, useEffect } from 'react';
import { myInfoUpdateAPi, myInfoDeleteApi, getMyInfo } from '../../api';
import { useNavigate } from 'react-router';
import { styled } from 'styled-components';

const UserInfoContainer = styled.div`
  position: fixed;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  top: 8%;
  width: 200px;
  height: 300px;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const Wrapper = styled.div`
  width: 160px;
  height: 210px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const Tag = styled.div`
  color: grey;
  font-size: 14px;
`;
const UserNameTag = styled.span`
  color: black;
  padding-left: 10px;
`;
const Form = styled.form``;
const Input = styled.input`
  width: 100%;
  margin: 4px 0;
`;
const Button = styled.button`
  width: 100%;
  margin: 10px 0;
`;

const UserInfoContent = () => {
  const [user, setUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

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
      localStorage.clear();
      navigate('/login', { replace: true });
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
    <UserInfoContainer>
      <Wrapper>
        <Tag>사용자 정보</Tag>
        <Tag>
          이름:<UserNameTag> {user.username || '사용자 이름 없음'}</UserNameTag>
        </Tag>

        <Tag>비밀번호 변경</Tag>
        <Form>
          <Input
            type="password"
            value={newPassword}
            placeholder={'new psaaword'}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <Input
            type="password"
            value={confirmPassword}
            placeholder={'confirmPassword'}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button onClick={handlePasswordChange}>비밀번호 변경</Button>
        </Form>

        <Button onClick={handleAccountDeletion}>계정 삭제</Button>
      </Wrapper>
    </UserInfoContainer>
  );
};

export default UserInfoContent;
