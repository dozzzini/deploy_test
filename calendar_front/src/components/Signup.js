import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { signupApi, checkIdAvailabilityApi } from '../api'; // api.js에서 정의한 함수 임포트

const Signup = () => {
  const navigate = useNavigate();
  // 회원가입 폼 제출 시 실행되는 함수
  const onSubmit = async (data) => {
    try {
      // signupApi 함수 사용하여 회원가입 요청 보내기
      const response = await signupApi({
        username: data.id,
        name: data.name,
        password: data.password,
        email: data.email,
      });
      // const response = await axios.post(
      //   'https://port-0-calendar-backend-ac2nll4pdsc1.sel3.cloudtype.app/api/v1/users/signup/',
      //   {
      //     username: data.id,
      //     name: data.name,
      //     password: data.password,
      //     email: data.email,
      //   },
      // );
      console.log(response.data);
      // 회원가입 성공 시 홈 화면으로 이동
      if (response.status === 201) {
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('회원가입 실패:', error);
    }
  };

  // react-hook-form을 사용하여 폼 상태와 입력을 관리합니다.
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isSubmitted, errors },
    getValues,
    setError, // import 추가
    clearErrors,
  } = useForm();

  // 아이디 중복 여부 상태 값
  const [isIdAvailable, setIsIdAvailable] = useState(false);

  // 아이디 중복 확인 요청 함수
  const checkIdAvailability = async () => {
    const id = getValues('id');

    // 아이디 중복 확인을 위한 서버 요청을 보냅니다.
    try {
      // checkIdAvailabilityApi 함수 사용하여 아이디 중복 확인 요청 보내기
      const response = await checkIdAvailabilityApi({ username: id });
      // const response = await axios.post(
      //   'https://port-0-calendar-backend-ac2nll4pdsc1.sel3.cloudtype.app/api/v1/users/idcheck/',
      //   {
      //     username: id,
      //   },
      // );
      // 중복 여부에 따라 상태를 업데이트합니다.
      setIsIdAvailable(response.data.isAvailable);

      if (!response.data.isAvailable) {
        setError('id', {
          type: 'manual',
          message: '이미 사용 중인 아이디입니다.',
        });
      } else {
        clearErrors('id');
      }
    } catch (error) {
      console.error('중복확인 실패:', error);
    }

    console.log(id);
  };

  return (
    <div>
      <div>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h1>회원가입</h1>

            <div>아이디</div>
            <input
              id="id"
              type="text"
              // placeholder="아이디"
              aria-invalid={
                isSubmitted ? (errors.id ? 'true' : 'false') : undefined
              }
              {...register('id', {
                required: '아이디는 필수 입력입니다.',
                minLength: {
                  value: 4,
                  message: '4자리 이상 입력해주세요.',
                },
              })}
              onBlur={checkIdAvailability} // 입력란에서 포커스가 빠져나갈 때 중복 확인 요청 함수 호출
            />
            {errors.id && <span>{errors.id.message}</span>}
            {isIdAvailable && <span>사용 가능한 아이디입니다.</span>}
            <div onClick={checkIdAvailability}>중복확인</div>
            {isIdAvailable === false && (
              <small role="alert">이미 사용 중인 아이디입니다.</small>
            )}
            {/* {' '} */}
            {errors.id && <div role="alert">{errors.id.message}</div>}

            <div>비밀번호</div>
            <input
              id="password"
              type="password"
              aria-invalid={
                isSubmitted ? (errors.password ? 'true' : 'false') : undefined
              }
              {...register('password', {
                required: '비밀번호는 필수 입력입니다.',
                minLength: {
                  value: 7,
                  message: '7자리 이상 비밀번호를 사용하세요.',
                },
              })}
            />

            {errors.password && (
              <div role="alert">{errors.password.message}</div>
            )}

            <div>비밀번호 확인</div>
            <input
              id="passwordConfirm"
              type="password"
              aria-invalid={
                isSubmitted
                  ? errors.passwordConfirm
                    ? 'true'
                    : 'false'
                  : undefined
              }
              {...register('passwordConfirm', {
                required: '비밀번호 확인은 필수 입력입니다.',
                minLength: {
                  value: 7,
                  message: '7자리 이상 비밀번호를 사용하세요.',
                },
                validate: {
                  check: (val) => {
                    if (getValues('password') !== val) {
                      return '비밀번호가 일치하지 않습니다.';
                    }
                  },
                },
              })}
            />

            {errors.passwordConfirm && (
              <div role="alert">{errors.passwordConfirm.message}</div>
            )}

            <div>이메일</div>
            <input
              id="email"
              type="text"
              placeholder="test@email.com"
              {...register('email', {
                required: '이메일은 필수 입력입니다.',
                pattern: {
                  value:
                    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
                  message: '이메일 형식에 맞지 않습니다.',
                },
              })}
            />

            {errors.email && <div role="alert">{errors.email.message}</div>}

            <div>이름</div>
            <input
              id="name"
              type="text"
              aria-invalid={
                isSubmitted ? (errors.name ? 'true' : 'false') : undefined
              }
              {...register('name', {
                required: '이름은 필수 입력입니다.',
                minLength: {
                  value: 2,
                  message: '2자리 이상 입력해주세요.',
                },
              })}
            />

            {errors.name && <div role="alert">{errors.name.message}</div>}
            <button type="submit" disabled={isSubmitting}>
              회원가입
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
