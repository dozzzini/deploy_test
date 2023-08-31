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
  padding: 10px;
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
  margin-left: 10px;
  background-color: #c1355a;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
`;
const RejectButton = styled.button`
  background-color: none;
  border: none;
  color: #c1355a;
  background-color: transparent;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
  width: 100%;
  display: flex;
  justify-content: end;
  margin-top: -80px;
  font-weight: 800;
`;
const FormBox = styled.div``;
const PutNickname = styled.div`
  width: 100%;
  text-align: center;
  font-size: 20px;
  color: #c1355a;
  font-weight: 600;
  margin-top: 30px;
  margin-bottom: 20px;
`;

const NicknameInput = styled.input`
  width: 230px;
  margin-top: 10px;
  border: 1px solid #c1355a;
  outline: none;
  border-radius: 5px;
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
      <RejectButton onClick={() => navigate(-1)}>X</RejectButton>

      {/* <EntryConfirm>초대된 팀에 입장하시겠습니까?</EntryConfirm> */}
      <FormBox>
        <form onSubmit={handleSubmit(handleOnClick)}>
          {showNicknameInput && (
            <>
              <PutNickname>닉네임 설정</PutNickname>
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
      </FormBox>
    </EntryPage>
  );
}

export default LinkEntry;
