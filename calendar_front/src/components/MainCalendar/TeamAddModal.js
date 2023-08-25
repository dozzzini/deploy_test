import { styled } from 'styled-components';
import ColorPicker from './ColorPicker';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createTeamApi, nicknameCreateApi } from '../../api';

const TeamAddContainer = styled.div`
  padding-top: 200px;
  width: 100%;
  height: 30px;
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: center;
`;
const Wrapper = styled.div`
  height: 30px;
`;
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
    formState: { errors },
  } = useForm();
  const [teamAddModalIsOpen, setTeamAddModalIsOpen] = useState(false);
  const [teamname, setTeamname] = useState('');
  const [nickname, setNickname] = useState('');
  const [selectedColor, setSelectedColor] = useState('#F44E3B');
  const [isTeamCreated, setIsTeamCreated] = useState();

  const toggleModal = () => {
    setTeamAddModalIsOpen(!teamAddModalIsOpen);
  };

  const handleFormSubmit = async (data) => {
    if (!isTeamCreated) {
      try {
        const response = await createTeamApi({
          teamname: teamname,
          color: selectedColor,
        });
        console.log('팀 생성 성공:', response.data);
        setIsTeamCreated(true);
        setTeamname(data.teamname); // 팀명 저장
      } catch (error) {
        console.error('팀 생성 실패:', error);
        setIsTeamCreated(true);
      }
    }
    setTeamname('');
  };

  const handleNicknameCheck = async () => {
    if (nickname.trim() !== '') {
      try {
        const nicknameResponse = await nicknameCreateApi({
          nickname,
        });
        console.log('닉네임 생성 성공:', nicknameResponse.data);
        setTeamAddModalIsOpen(false);
      } catch (error) {
        console.error('닉네임 생성 실패:', error);
      }
    }
  };

  return (
    <TeamAddContainer>
      <Wrapper>
        <TeamAddBtn onClick={toggleModal}>+</TeamAddBtn>
      </Wrapper>
      {teamAddModalIsOpen && (
        <TAddModal>
          <TModalWrapper>
            {isTeamCreated ? (
              <TMForm onSubmit={handleSubmit(handleNicknameCheck)}>
                <>
                  <h2>팀 "{teamname}" 닉네임 설정</h2>
                  <TAMinput
                    type="text"
                    placeholder="nickname"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                  />
                  <BtnColumn>
                    <ATMbutton
                      type="button"
                      onClick={() => setTeamAddModalIsOpen(false)}
                    >
                      cancel
                    </ATMbutton>
                    <ATMbutton type="submit">완료</ATMbutton>
                  </BtnColumn>
                </>
              </TMForm>
            ) : (
              <TMForm onSubmit={handleSubmit(handleFormSubmit)}>
                <>
                  <h2>ADD CALENDAR</h2>
                  <TAMinput
                    type="text"
                    placeholder="teamname"
                    value={teamname}
                    onChange={(e) => setTeamname(e.target.value)}
                    // {...register('teamname', {
                    //   required: '팀명을 입력해주세요',
                    // })}
                  />
                  {errors.teamname && <p>{errors.teamname.message}</p>}
                  select team color
                  <ColorPicker onSelectColor={setSelectedColor} />
                  <BtnColumn>
                    <ATMbutton
                      type="button"
                      onClick={() => setTeamAddModalIsOpen(false)}
                    >
                      cancel
                    </ATMbutton>
                    <ATMbutton type="submit">팀 생성</ATMbutton>
                  </BtnColumn>
                </>
              </TMForm>
            )}
          </TModalWrapper>
        </TAddModal>
      )}
    </TeamAddContainer>
  );
}
export default TeamAddModal;
