import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { enterTeamApi } from '../../api';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';

const EntryPage = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 220px;
  width: 100%;
  max-width: 430px;
  background-color: #f9f3f4;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const EntryConfirm = styled.div``;

const EntryButton = styled.button`
  background-color: #c1355a;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
`;
const RejectButton = styled.button`
  margin-left: 20px;
  background-color: #c1355a;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
`;
const ButtonBox = styled.div`
  display: flex;
  margin-top: 20px;
`;
const PutNickname = styled.div`
  margin-top: 30px;
  margin-bottom: 20px;
`;

const NicknameInput = styled.input`
  /* padding: 10px 20px; */
  width: 230px;
  border: 1px solid #c1355a;
  outline: none;
`;

function LinkEntry() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { encodedTeamId } = useParams();
  const navigate = useNavigate();
  const [showNicknameInput, setShowNicknameInput] = useState(false);
  const [nicknameDuplicate, setNicknameDuplicate] = useState(null);

  const redirectToLoginIfNoToken = () => {
    const access_token = localStorage.getItem('access_token');
    const refresh_token = localStorage.getItem('refresh_token');
    if (!(access_token && refresh_token)) {
      localStorage.setItem('TeamId', encodedTeamId);
      navigate('/teamlogin', { replace: true });
      return false;
    }
    return true;
  };

  useEffect(() => {
    const access_token = localStorage.getItem('access_token');
    if (access_token) {
      setShowNicknameInput(true);
    }
  }, []);

  const handleOnClick = async (data) => {
    if (redirectToLoginIfNoToken()) {
      try {
        const teamId = atob(encodedTeamId);
        const response = await enterTeamApi(teamId, {
          nickname: data.nickname,
        });
        if (response.status === 200) {
          navigate('/calendar');
        } else if (response.request.status === 400) {
          setNicknameDuplicate('이미 존재하는 닉네임입니다.');
        }
      } catch (error) {
        console.error('팀 가입 중 오류:', error);
      }
    }
    return;
  };

  return (
    <EntryPage>
      <EntryConfirm>초대된 팀에 입장하시겠습니까?</EntryConfirm>
      <ButtonBox>
        <form onSubmit={handleSubmit(handleOnClick)}>
          {showNicknameInput && (
            <>
              <PutNickname>팀에서 사용할 닉네임을 입력해주세요.</PutNickname>
              <NicknameInput
                type="text"
                placeholder="팀에서 사용할 닉네임을 입력하세요."
                {...register('nickname', {
                  required: '닉네임을 입력해주세요',
                })}
              />
              {errors.nickname && (
                <p style={{ fontSize: 12 }}>{errors.nickname.message}</p>
              )}
              {nicknameDuplicate && (
                <p style={{ color: 'red' }}>{nicknameDuplicate}</p>
              )}
            </>
          )}
          <EntryButton type="submit">입장</EntryButton>
        </form>
        <RejectButton onClick={() => navigate(-1)}>거부</RejectButton>
      </ButtonBox>
    </EntryPage>
  );
}

export default LinkEntry;
