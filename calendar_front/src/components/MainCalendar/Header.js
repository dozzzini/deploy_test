import { styled } from 'styled-components';
import { LuSettings, LuBell } from 'react-icons/lu';
import SearchInfo from './SearchInfo';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

import { scheduleSearchApi } from '../../api';
import { useSetRecoilState } from 'recoil';
import { loggedIn } from '../../recoilState';

const HeaderContainer = styled.div`
  padding: 10px;
  margin-top: 20px;
`;

const Form = styled.form`
  width: 100%;
`;

//검색어 입력하는 곳
const SearchBox = styled.input`
  margin-bottom: 10px;
  border: none;
  border-radius: 6px;
  background-color: white;
  box-shadow: inset 2px 5px 10px rgba(0, 0, 0, 0.1);
  transition: 300ms ease-in-out;
  width: 100%;
  &&:focus {
    background-color: rgb(249, 249, 249);
    border: 1px;
    outline: none;
    box-shadow:
      -3px -3px 8px rgba(235, 245, 235, 1),
      3px 3px 8px rgba(0, 0, 70, 0.3);
  }
`;

// LuBell, LuSettings를 감싸고 있는 div
const IconBox = styled.div`
  padding-right: 3px;
  display: flex;
  justify-content: end;
  opacity: 0.6;
  width: 100%;
`;

//설정 눌렀을 때 나오는 모달창
const Modal = styled.div`
  position: absolute; /* fixed 대신 absolute로 변경 */
  z-index: 1000; /* 다른 컨텐츠 위에 나타나도록 더 높은 z-index 설정 */
  // margin-top: 100px;
  transform: translate(-50%, -50%); /* 중앙에 정렬 */
  background-color: white;
  width: 200px;
  height: 100px;
  // padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
  max-width: 200px; /* 모달 최대 너비 조정 */
  max-height: 100px; /* 모달 최대 높이 조정 */
  display: flex;
  flex-direction: column;
  align-items: center;
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
// const CloseIcon = styled.span`
//   color: #aaa;
//   font-size: 20px;
//   font-weight: bold;
//   position: absolute;
//   top: 1px;
//   right: 3px;
//   cursor: pointer;
// `;

function Header({ data, initialCalendars, initialEvents }) {
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
    } else {
      setSearchIsOpen(false);
    }
  };
  const handleSearch = (event) => {
    event.preventDefault(); // 기본 제출 동작 방지

    if (inputValue.length >= 1) {
      scheduleSearchApi({ search: inputValue })
        .then((data) => setSearchResults(data))
        .catch((error) => console.error(error));
    } else {
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

  return (
    <HeaderContainer>
      <Form onSubmit={handleSearch}>
        <SearchBox
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="search"
        />
      </Form>
      {searchIsOpen ? (
        <SearchInfo
          onClose={() => setSearchIsOpen(false)}
          matchingData={searchResults}
          initialCalendars={initialCalendars}
          initialEvents={initialEvents}
        />
      ) : null}
      <IconBox>
        <LuBell onClick={() => openModal('LuBell')}></LuBell>
        <LuSettings onClick={() => openModal('LuSettings')}></LuSettings>{' '}
      </IconBox>
      {activeModal === 'LuBell' && (
        <Modal>
          <Content>
            {/* <CloseIcon onClick={closeModal}>&times;</CloseIcon> */}
            <p>LuBell 모달 내용</p>
          </Content>
        </Modal>
      )}
      {activeModal === 'LuSettings' && (
        <Modal>
          <Content>
            {/* <CloseIcon onClick={closeModal}>&times;</CloseIcon> */}
            <Logout onClick={handleLogout}>로그아웃</Logout>
          </Content>
        </Modal>
      )}{' '}
    </HeaderContainer>
  );
}
export default Header;
