import { styled } from 'styled-components';
import { LuSettings } from 'react-icons/lu';
import SearchInfo from './SearchInfo';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { deleteAccountApi, updateUserInfoApi } from '../../api';
import { scheduleSearchApi, logoutApi } from '../../api';
const HeaderContainer = styled.div`
  width: 100%;
  padding: 10px;
  position: relative;
`;

const Form = styled.form`
  width: 100%;
`;

//검색어 입력하는 곳
const SearchBox = styled.input`
  margin-top: 45px;
  font-size: 11px;
  text-align: center;
  border: none;
  border-radius: 6px;
  background-color: white;
  box-shadow: inset 2px 5px 10px rgba(0, 0, 0, 0.1);
  transition: 300ms ease-in-out;
  width: 100%;
  &&:focus {
    outline: none;
    box-shadow:
      -3px -3px 8px rgba(235, 245, 235, 1),
      3px 3px 8px rgba(0, 0, 70, 0.3);
  }
`;

// LuSettings를 감싸고 있는 div
const IconBox = styled.div`
  padding-right: 3px;
  display: flex;
  justify-content: end;
  opacity: 0.6;
  width: 100%;
`;

//설정 눌렀을 때 나오는 모달창
const Modal = styled.div`
  position: absolute;
  z-index: 2000;
  top: 30%;
  right: 10%;
  background-color: white;
  width: 200px;
  border-radius: 10px;
  height: 100px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  max-width: 200px; /* 모달 최대 너비 조정 */
  max-height: 100px; /* 모달 최대 높이 조정 */
`;

const Content = styled.div`
  background-color: none;
  width: 100%;
`;
const UserInfoContent = styled.div`
  position: absolute;
  top: 0%;
  right: 0%;
  background-color: white;
  border-radius: 10px;
  width: 200px;
  height: 200px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  max-width: 200px; /* 모달 최대 너비 조정 */
`;
const OptionBtn = styled.button`
  margin-top: 10px;
  font-size: 12px;
  border: none;
  background-color: white;
  margin-left: 70px;
`;

const CloseIcon = styled.button`
  width: 100%;
  text-align: end;
  background-color: transparent;
  border: none;
`;
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: transparent;
`;
function Header({ schedules }) {
  const [searchIsOpen, setSearchIsOpen] = useState(false);
  const [UserInfoIsOpen, setUserInfoIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const [username, setUsername] = useState('');

  useEffect(() => {
    // schedules를 가져오는 비동기 작업이 완료되면 username을 설정합니다.
    if (schedules && schedules.user) {
      setUsername(schedules.user.username);
    }
  }, [schedules]);

  if (!schedules) {
    return <div>Loading...</div>; // 혹은 로딩 표시 UI를 보여줄 수 있습니다.
  }
  const handleUserInfoUpdate = (newPassword, confirmPassword) => {
    console.log('handleUserInfoUpdate 함수 시작');

    if (newPassword === confirmPassword) {
      console.log('새 비밀번호와 확인 비밀번호가 일치합니다.');

      updateUserInfoApi(username, {
        new_password: newPassword,
        confirm_password: confirmPassword,
      })
        .then((response) => {
          console.log('비밀번호가 성공적으로 변경되었습니다.', response);
          setNewPassword('');
          setConfirmPassword('');
          // 모달 닫기
          closeUserInfo();
        })
        .catch((error) => {
          console.error('비밀번호 변경 오류:', error);
        });
    } else {
      console.error('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
    }
    console.log('handleUserInfoUpdate 함수 종료');
  };
  const handleAccountDeletion = () => {
    console.log('handleAccountDeletion 함수 시작');
    console.log('schedules:', schedules); // 확인용 로그
    console.log('username:', schedules.user.username);
    if (window.confirm('정말로 회원탈퇴하시겠습니까?')) {
      deleteAccountApi(schedules.user.username, {
        refresh_token: localStorage.getItem('refresh_token'),
      })
        .then(() => {
          closeModal();
          localStorage.clear();
          navigate('/login', { replace: true });
        })
        .catch((error) => {
          console.error('회원탈퇴 오류:', error);
        });
    }
    console.log('handleAccountDeletion 함수 종료');
  };
  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    if (value.length >= 1) {
      setSearchIsOpen(true);
      const filteredSchedules = schedules.filter((schedule) =>
        schedule.title.includes(value),
      );
      setSearchResults(filteredSchedules);
    } else {
      setSearchIsOpen(false);
      setSearchResults([]);
    }
  };
  const openModal = (modalType) => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };
  const openUserInfo = () => {
    setUserInfoIsOpen(true);
  };
  const closeUserInfo = () => {
    setUserInfoIsOpen(false);
    setActiveModal(null);
  };

  const handleLogout = () => {
    logoutApi({ refresh_token: localStorage.getItem('refresh_token') })
      .then(() => {
        closeModal();
        localStorage.clear();
        navigate('/login', { replace: true });
      })
      .catch((error) => {
        console.error('로그아웃 오류:', error);
      });
  };
  const handleOverlayClick = () => {
    setSearchIsOpen(false);
  };

  return (
    <HeaderContainer>
      <IconBox>
        <LuSettings onClick={() => openModal('LuSettings')}></LuSettings>{' '}
      </IconBox>
      {activeModal === 'LuSettings' && (
        <Modal>
          <Content>
            <CloseIcon onClick={closeModal}>&times;</CloseIcon>
            <OptionBtn onClick={handleLogout}>로그아웃</OptionBtn>
            <OptionBtn onClick={openUserInfo}>회원정보수정</OptionBtn>
          </Content>
          {UserInfoIsOpen && (
            <UserInfoContent>
              <CloseIcon onClick={closeUserInfo}>&times;</CloseIcon>
              <form>
                {/* <input placeholder="email@email.com"></input>
                <input placeholder="name"></input> */}
                <input type="password" placeholder="new password" />
                <input type="password" placeholder="confirm new password" />
                <button onClick={''}>비밀번호 변경</button>
                <br />
                <button onClick={''}>회원탈퇴</button>
              </form>
            </UserInfoContent>
          )}
        </Modal>
      )}
      <Form>
        <SearchBox
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="search"
        />
      </Form>
      {searchIsOpen ? <SearchInfo matchingData={searchResults} /> : null}

      {searchIsOpen && <Overlay onClick={handleOverlayClick} />}
    </HeaderContainer>
  );
}
export default Header;
