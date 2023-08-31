import styled from 'styled-components';
import ColorPicker from './ColorPicker';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createTeamApi } from '../../api';
import { LuX } from 'react-icons/lu';
import TeamLinkModal from './TeamLinkModal';

const TeamListContainer = styled.div`
  /* border: 1px solid blue; */
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const TeamListWrapper = styled.div`
  /* border: 1px solid red; */
  position: relative;
`;
const TeamBtnWrapper = styled.div`
  /* border: 1px solid greenyellow; */

  width: auto;
  margin-top: 200px;
  display: flex;
  justify-content: center;
  position: absolute;
`;
const TeamAddBtn = styled.button`
  font-size: 30px;
  font-weight: 100;
  color: grey;
  background-color: rgb(254, 250, 250);
  cursor: pointer;
  border: none;
  border-radius: 30px;
  &&:hover {
    transform: translateY(1px);
    box-shadow: none;
    color: black;
  }
  &&:active {
    opacity: 0.5;
  }
`;
const TeamModalCloseBtn = styled(LuX)`
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;

  &&:hover {
    color: black;
    font-weight: bold;
  }
`;
const TeamInputModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: 430px;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  z-index: 10;
`;
const TeamInputModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 20px;
  font-weight: 100;
  margin: 10px;
`;
const TMForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 89%;
  height: 78%;
  justify-content: center;
  padding-bottom: 18px;
  h2 {
    font-size: 18px;
    text-align: center;
    font-weight: 100;
    margin: 18px 0;
  }
`;
const TAMinput = styled.input`
  padding: 7px 0 7px 10px;
  margin: 10px 0;
  border: none;
  font-weight: 100;
  border-radius: 10px;
  background-color: white;
  box-shadow: inset 2px 5px 10px rgba(0, 0, 0, 0.1);
  transition: 300ms ease-in-out;
  font-size: 15px;
`;
const ATMbuttonbox = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;
const ATMbutton = styled.button`
  margin-top: 20px;
  width: 30%;
  font-size: 15px;
  /* font-weight: 100; */
  color: grey;
  font-weight: 100;
  border-radius: 15px;
  background-color: rgb(254, 250, 250);
  box-shadow:
    -4px -4px 13px rgba(242, 242, 242, 1),
    4px 4px 13px rgba(242, 242, 242, 1);
  outline: none;
  cursor: pointer;
  border: none;
  &&:hover {
    /* transform: translateY(1px); */
    /* box-shadow: none; */
    color: black;
  }
  &&:active {
    opacity: 0.5;
  }
`;

function TeamAddModal() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [teamAddModalIsOpen, setTeamAddModalIsOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#F44E3B');
  const [nickname, setNickname] = useState('');
  const [teamId, setTeamId] = useState(null);

  const toggleModal = () => {
    setTeamAddModalIsOpen(!teamAddModalIsOpen);
    if (!teamAddModalIsOpen) {
      reset();
      setSelectedColor('#F44E3B');
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      const response = await createTeamApi({
        team: { teamname: data.teamname, color: selectedColor },
        nickname: { nickname: data.nickname },
      });
      console.log('팀 생성 성공:', response.data);
      setTeamAddModalIsOpen(false);
      setNickname(data.nickname);
      setTeamId(response.data.team.id);
      reset();
    } catch (error) {
      console.error('팀 생성 실패:', error);
      reset();
    }
  };

  const handleCopyClick = () => {
    if (teamId) {
      console.log('생성된 팀의 아이디:', teamId);
      const link = `http://localhost:3000/api/v1/teams/members/${btoa(
        teamId + '',
      )}/`;
      navigator.clipboard
        .writeText(link)
        .then(() => {
          alert('링크가 복사되었습니다.');
        })
        .catch((error) => {
          console.error('링크 복사 실패:', error);
          alert('링크 복사에 실패했습니다.');
        });
    } else {
      alert('복사할 링크가 없습니다.');
    }
  };
  const redirectToCalendar = () => {
    window.location.replace('/calendar');
  };
  return (
    <TeamListContainer>
      <TeamListWrapper>
        {teamAddModalIsOpen && (
          <TeamInputModal>
            <TeamModalCloseBtn
              onClick={() => {
                setTeamAddModalIsOpen(false);
              }}
            />
            <TeamInputModalWrapper>
              <TMForm onSubmit={handleSubmit(handleFormSubmit)}>
                <>
                  <h2>ADD CALENDAR</h2>
                  <TAMinput
                    type="text"
                    placeholder="teamname"
                    {...register('teamname', {
                      required: '팀명과 닉네임을 모두 입력해주세요',
                    })}
                  />
                  <TAMinput
                    type="text"
                    placeholder="nickname"
                    {...register('nickname', {
                      required: '팀명과 닉네임을 모두 입력해주세요',
                    })}
                  />
                  {errors.nickname && (
                    <p style={{ fontSize: 12 }}>{errors.nickname.message}</p>
                  )}
                  <h2>SELECT TEAM COLOR</h2>
                  <ColorPicker onSelectColor={setSelectedColor} />
                  <ATMbuttonbox>
                    <ATMbutton type="submit">팀 생성</ATMbutton>
                  </ATMbuttonbox>
                </>
              </TMForm>
            </TeamInputModalWrapper>
          </TeamInputModal>
        )}
      </TeamListWrapper>
      <TeamBtnWrapper>
        <TeamAddBtn onClick={toggleModal}>+</TeamAddBtn>
      </TeamBtnWrapper>
      <TeamLinkModal
        isOpen={!!teamId}
        teamId={teamId}
        setTeamId={setTeamId}
        handleCopyClick={handleCopyClick}
        redirectToCalendar={redirectToCalendar}
      />
    </TeamListContainer>
  );
}
export default TeamAddModal;
