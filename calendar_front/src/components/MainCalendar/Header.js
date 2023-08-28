import { styled } from 'styled-components';
import { LuSettings } from 'react-icons/lu';
import SearchInfo from './SearchInfo';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

import { scheduleSearchApi } from '../../api';
import { useSetRecoilState } from 'recoil';
import { loggedIn } from '../../recoilState';

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
  height: 100px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
  max-width: 200px; /* 모달 최대 너비 조정 */
  max-height: 100px; /* 모달 최대 높이 조정 */
`;

const Content = styled.div`
  background-color: none;
  width: 100%;
`;

const Logout = styled.button`
  margin-top: 20px;
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
  const [inputValue, setInputValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const setIsLogin = useSetRecoilState(loggedIn);
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

  const handleLogout = () => {
    // logoutApi({ refresh: localStorage.getItem('refresh_token') })
    //   .then((res) => {
    //     localStorage.clear();
    //     setIsLogin(false);
    //     closeModal();
    //   })
    //   .catch((error) => {
    //     console.error('로그아웃 오류:', error);
    //   });
    localStorage.clear();
    closeModal();
    setIsLogin(false);
    navigate('/login', { replace: true });
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
            <Logout onClick={handleLogout}>로그아웃</Logout>
          </Content>
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
