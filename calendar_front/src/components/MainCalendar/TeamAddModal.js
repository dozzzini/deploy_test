import { styled } from 'styled-components';
import ColorPicker from './ColorPicker';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createTeamApi } from '../../api';
import { LuX } from 'react-icons/lu';

const TeamAddContainer = styled.div`
  padding-top: 200px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: center;
`;
const Wrapper = styled.div``;
const TeamAddBtn = styled.button`
  font-size: 30px;
  font-weight: 100;
  color: grey;
  background-color: rgb(254, 250, 250);
  cursor: pointer;
  border: none;
  &&:hover {
    transform: translateY(1px);
    box-shadow: none;
    color: black;
  }
  &&:active {
    opacity: 0.5;
  }
`;
const TAddModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(200, 200, 200, 0.2);
  z-index: 1000;
`;
const CloseIcon = styled(LuX)`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;

  &&:hover {
    color: black;
    font-weight: bold;
  }
`;
const TModalWrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  width: 400px;
  height: 410px;
  background-color: white;
  z-index: 1005;
  top: 46%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 20px;
  font-weight: 100;
  line-height: 1.5;
`;
const TMForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 80%;
  height: 78%;
  justify-content: space-between;
  padding-bottom: 14px;
  h2 {
    font-size: 15px;
    text-align: center;
  }
`;

const TAMinput = styled.input`
  width: 98%;
  padding: 3px 0 3px 10px;
  border: none;
  outline: none;
  border-radius: 6px;
  background-color: white;
  box-shadow: inset 2px 5px 10px rgba(0, 0, 0, 0.1);
  transition: 300ms ease-in-out;
  font-size: 15px;
`;

const BtnColumn = styled.div`
  display: flex;
  justify-content: space-between;
`;
const ATMbutton = styled.button`
  width: 48%;
  font-size: 21px;
  font-weight: 100;
  color: grey;
  border-radius: 15px;
  background-color: rgb(254, 250, 250);
  box-shadow:
    -4px -4px 13px rgba(242, 242, 242, 1),
    4px 4px 13px rgba(242, 242, 242, 1);
  outline: none;
  cursor: pointer;
  border: none;
  &&:hover {
    transform: translateY(1px);
    box-shadow: none;
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

  const toggleModal = () => {
    setTeamAddModalIsOpen(!teamAddModalIsOpen);
    if (!teamAddModalIsOpen) {
      reset(); // react-hook-form의 reset 함수 호출
      setSelectedColor('#F44E3B'); // 색상도 초기 상태로 설정
    }
  };

  const handleFormSubmit = async (data) => {
    console.log({
      team: { teamname: data.teamname, color: selectedColor },
      nickname: { nickname: data.nickname },
    });
    try {
      const response = await createTeamApi({
        team: { teamname: data.teamname, color: selectedColor },
        nickname: { nickname: data.nickname },
      });
      console.log('팀 생성 성공:', response.data);
      setTeamAddModalIsOpen(false);
      reset();
    } catch (error) {
      console.error('팀 생성 실패:', error);
      reset();
    }
  };

  return (
    <TeamAddContainer>
      <Wrapper>
        <TeamAddBtn onClick={toggleModal}>+</TeamAddBtn>
      </Wrapper>
      {teamAddModalIsOpen && (
        <TAddModal>
          <CloseIcon
            onClick={() => {
              setTeamAddModalIsOpen(false);
            }}
          />
          <TModalWrapper>
            <TMForm onSubmit={handleSubmit(handleFormSubmit)}>
              <>
                <h2>ADD CALENDAR</h2>
                <TAMinput
                  type="text"
                  placeholder="teamname"
                  {...register('teamname', {
                    required: '팀명을 입력해주세요',
                  })}
                />
                <TAMinput
                  type="text"
                  placeholder="nickname"
                  {...register('nickname', {
                    required: '닉네임을 입력해주세요',
                  })}
                />
                {errors.nickname && <p>{errors.nickname.message}</p>}
                select team color
                <ColorPicker onSelectColor={setSelectedColor} />
                <BtnColumn>
                  {/* <ATMbutton
                    type="button"
                    onClick={() => {
                      setTeamAddModalIsOpen(false);
                    }}
                  >
                    <LuX />
                  </ATMbutton> */}
                  <ATMbutton type="submit">팀 생성</ATMbutton>
                </BtnColumn>
              </>
            </TMForm>
          </TModalWrapper>
        </TAddModal>
      )}
    </TeamAddContainer>
  );
}
export default TeamAddModal;
