import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { joinTeamApi, nicknameCreateApi } from '../../api';
import { useForm } from 'react-hook-form';

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

  return (
    <div>
      <>
        <p>{teamId}에 입장하시겠습니까?</p>
        {showNicknameInput && (
          <>
            <div>{teamId}에서 사용할 닉네임을 입력해주세요.</div>
            <form onSubmit={handleSubmit(onSubmitNickname)}>
              <input
                type="text"
                placeholder="nickname"
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
              <button type="submit">입장</button>
            </form>
          </>
        )}
        {showAlert && (
          <div style={{ color: 'red' }}>
            이미 가입된 팀입니다. 나의 달력으로 이동합니다.
          </div>
        )}
        <button onClick={handleOnClick}>입장</button>
        <button onClick={() => navigate(-1)}>거부</button>
      </>
    </div>
  );
}

export default LinkEntry;
