import React, { useState, useEffect } from 'react';
import { myInfoUpdateAPi, myInfoDeleteApi, getMyInfo } from '../../api';
import { useNavigate } from 'react-router';
import { styled } from 'styled-components';

const Wrapper = styled.div`
  width: 180px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-bottom: 10px;
`;

const Tag = styled.div`
  font-size: 14px;
  font-weight: 800;
  color: grey;
  padding: 3px 2px;
  border-bottom: 1px solid rgb(240, 230, 230);
  margin-bottom: 5px;
`;
const UserNameTag = styled.span`
  padding: 6px;
`;
const Form = styled.form`
  padding-top: 6px;
`;
const Input = styled.input`
  width: 100%;
  margin: 4px 0;
  font-weight: 100;
  border: 1px solid #c1355a;
  border-radius: 5px;
  outline: none;
  padding: 1px;
  &::placeholder {
    color: grey;
    font-size: 12px;
  }
`;
const Button = styled.button`
  /* margin-left: 10px; */
  background-color: #c1355a;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
  width: 100%;
  margin: 4px 0;
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
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  const handleAccountDeletion = async () => {
    try {
      await myInfoDeleteApi({ refresh: localStorage.getItem('refresh_token') });
      alert('계정이 성공적으로 삭제되었습니다.');
      localStorage.clear();
      navigate('/', { replace: true });
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
    <Wrapper>
      <Tag>사용자 정보</Tag>
      <Tag>
        아이디:<UserNameTag> {user.username || '사용자 이름 없음'}</UserNameTag>
      </Tag>

      {/* <Tag>비밀번호 변경</Tag> */}
      <Form>
        <Input
          type="password"
          value={newPassword}
          placeholder={'새 비밀번호를 입력하세요.'}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <Input
          type="password"
          value={confirmPassword}
          placeholder={'비밀번호를 확인하세요.'}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Button onClick={handlePasswordChange}>비밀번호 변경</Button>
      </Form>

      <Button onClick={handleAccountDeletion}>계정 삭제</Button>
    </Wrapper>
  );
};

export default UserInfoContent;
