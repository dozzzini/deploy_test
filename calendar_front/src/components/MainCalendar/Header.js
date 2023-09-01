import { styled } from 'styled-components';
import { LuSettings } from 'react-icons/lu';
import SearchInfo from './SearchInfo';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { logoutApi } from '../../api';
import UserInfoContent from '../RightBar/UserInfo';
const HeaderContainer = styled.div`
  width: 100%;
  padding: 8px 10px;
  position: relative;
`;

const Form = styled.form`
  width: 100%;
`;

//검색어 입력하는 곳
const SearchBox = styled.input`
  margin-top: 35px;
  font-size: 14px;
  text-align: center;
  border: none;
  border-radius: 6px;
  background-color: white;
  box-shadow: inset 2px 5px 10px rgba(100, 100, 100, 0.1);
  transition: 300ms ease-in-out;
  width: 100%;
  &&:focus {
    outline: none;
    box-shadow:
      -3px -3px 8px rgba(235, 245, 235, 1),
      3px 3px 8px rgba(100, 100, 100, 0.1);
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

const OptionBtn = styled.button`
  margin-top: 5px;
  font-size: 13px;
  border: none;
  font-weight: 100;
  background-color: white;
  width: 100%;
  cursor: pointer; /* 호버 시 포인터 스타일 추가 */
  transition: background-color 0.3s ease; /* 호버 시 배경 색상 변화를 부드럽게 적용 */

  &:hover {
    background-color: #f0f0f0; /* 호버 시 배경 색상 변경 */
  }
`;

const CloseIcon = styled.button`
  width: 100%;
  text-align: end;
  background-color: transparent;
  border: none;
  z-index: 2001;
`;
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: transparent;
`;
const UserInfoContainer = styled.div`
  position: absolute;
  top: 0%;
  background-color: white;
  width: 200px;
  border-radius: 10px;
  background-color: white;
  padding: 10px;
`;
function Header({ schedules }) {
  const [searchIsOpen, setSearchIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const [isEditingUserInfo, setIsEditingUserInfo] = useState(false);
  const navigate = useNavigate();

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
  const closeUserIfo = () => {
    setActiveModal(null);
    setIsEditingUserInfo(false);
  };
  const handleLogout = () => {
    logoutApi({ refresh_token: localStorage.getItem('refresh_token') })
      .then(() => {
        closeModal();
        localStorage.clear();
        navigate('/', { replace: true });
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
            <OptionBtn onClick={() => setIsEditingUserInfo(true)}>
              회원정보수정
            </OptionBtn>
          </Content>

          {isEditingUserInfo ? (
            <UserInfoContainer>
              <Content>
                <CloseIcon onClick={closeUserIfo}>&times;</CloseIcon>
                <UserInfoContent />
              </Content>{' '}
            </UserInfoContainer>
          ) : null}
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
