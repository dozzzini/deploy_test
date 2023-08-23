import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.API_URL, //장고 서버 주소
  withCredentials: true, // 쿠키를 포함시키기 위한 설정 추가
});

export default instance;

// 로그인 API 함수
export const loginApi = (data) => {
  return instance.post('/api/v1/users/login/', data);
};

// 회원가입 API 함수
export const signupApi = (data) => {
  return instance.post('/api/v1/users/signup/', data);
};

// 아이디 중복 확인 API 함수
export const checkIdAvailabilityApi = (data) => {
  return instance.post('/api/v1/users/idcheck/', data);
};
