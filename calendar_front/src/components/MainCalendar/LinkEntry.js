import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { joinTeamApi, nicknameCreateApi } from '../../api';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';

function LinkEntry() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [showNicknameInput, setShowNicknameInput] = useState(false);
  const [nicknameDuplicate, setNicknameDuplicate] = useState(null);

  const redirectToLoginIfNoToken = () => {
    const access_token = localStorage.getItem('access_token');
    const refresh_token = localStorage.getItem('refresh_token');
    if (!(access_token && refresh_token)) {
      localStorage.setItem('TeamId', teamId);
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

  const handleOnClick = async () => {
    if (redirectToLoginIfNoToken()) {
      try {
        const response = await joinTeamApi(teamId);
        if (response.request.status === 202) {
          navigate('/teamlogin');
          // setShowNicknameInput(true);
        } else if (response.request.status === 400) {
          setShowAlert(true);
          setTimeout(() => {
            navigate('/calendar');
          }, 3000);
        }
      } catch (error) {
        console.error('팀 가입 중 오류:', error);
      }
    }
    return;
  };

  const onSubmitNickname = async (data) => {
    try {
      const response = await nicknameCreateApi(teamId, {
        nickname: data.nickname,
      });
      if (response.status === 400) {
        // If the status code is 400, set the error message
        setNicknameDuplicate('이미 존재하는 닉네임입니다.');
      } else {
        console.log('링크 가입자 닉네임: ', response.data);
      }
    } catch (error) {
      console.error('닉네임 생성 중 오류 발생:', error);
    }
  };

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
    background: linear-gradient(45deg, #a2c0c8, #e7a7c9);
    color: #ffffff;
    /* padding: 10px 20px; */
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s ease;
  `;
  const RejectButton = styled.button`
    margin-left: 20px;
    background: linear-gradient(45deg, #a2c0c8, #e7a7c9);
    color: #ffffff;
    /* padding: 10px 20px; */
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
  const NicknameConfirmBtn = styled.button`
    background: linear-gradient(45deg, #a2c0c8, #e7a7c9);
    color: #ffffff;
    margin-left: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s ease;
  `;
  const NicknameInput = styled.input`
    /* padding: 10px 20px; */
    width: 230px;
    border: 3px solid transparent;
    border-image: linear-gradient(45deg, #a2c0c8, #e7a7c9) 1;
    border-image-slice: 1;
    color: #ffffff;
    border-radius: 5px;
    cursor: pointer;
    transition: border-image 0.3s ease;
  `;
  return (
    <EntryPage>
      <EntryConfirm>팀{teamId}에 입장하시겠습니까?</EntryConfirm>
      {showNicknameInput && (
        <>
          <ButtonBox>
            <EntryButton onClick={handleOnClick}>입장</EntryButton>
            <RejectButton onClick={() => navigate(-1)}>거부</RejectButton>
          </ButtonBox>
          <PutNickname>
            팀 {teamId}에서 사용할 닉네임을 입력해주세요.
          </PutNickname>
          <form onSubmit={handleSubmit(onSubmitNickname)}>
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
            <NicknameConfirmBtn type="submit">확인</NicknameConfirmBtn>
          </form>
        </>
      )}
      {showAlert && (
        <div style={{ color: 'red' }}>
          이미 가입된 팀입니다. 나의 달력으로 이동합니다.
        </div>
      )}
    </EntryPage>
  );
}

export default LinkEntry;
