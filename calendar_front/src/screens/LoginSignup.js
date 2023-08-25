import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSetRecoilState } from 'recoil';
import classes from './LoginSignup.module.css';
import { signupApi, checkIdAvailabilityApi, loginApi } from '../api';
import { loggedIn } from '../recoilState';

function LoginSignup() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isIdAvailable, setIsIdAvailable] = useState(0);
  const setIsLogin = useSetRecoilState(loggedIn);

  const clickHandler = () => {
    setIsSignUp((prev) => !prev);
  };

  const {
    register,
    handleSubmit,
    formState: { isSubmitted, errors },
    getValues,
    setError,
    clearErrors,
  } = useForm();

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { isSubmitted: isLoginSubmitted, errors: loginErrors },
  } = useForm();

  const onSignUpSubmit = async (data) => {
    try {
      const response = await signupApi({
        username: data.id,
        name: data.name,
        password: data.password,
        email: data.email,
      });
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);

      setIsLogin(true);
    } catch (error) {
      console.error('회원가입 실패:', error);
    }
  };

  const onLogInSubmit = async (data) => {
    try {
      const response = await loginApi({
        username: data.id,
        password: data.password,
      });

      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

      setIsLogin(true);
    } catch (error) {
      console.error('로그인 실패:', error);
    }
  };

  const checkIdAvailability = async () => {
    const id = getValues('id');
    // 아이디 중복 확인을 위한 서버 요청을 보냅니다.
    try {
      const response = await checkIdAvailabilityApi({ username: id });

      if (response.status === 200) {
        setIsIdAvailable(1);
        clearErrors('id');
      } else {
        setIsIdAvailable(-1);
      }
      console.log('중복확인 성공:', response.status);
    } catch (error) {
      console.error('중복확인 실패:', error);
    }
  };

  return (
    <div className={classes.wrapper_login}>
      <div
        className={`${classes.container_login} ${
          isSignUp ? classes.right_panel_active : null
        }`}
      >
        {/* SIGNUP */}
        <div className={classes.sign_up_container}>
          <form
            onSubmit={handleSubmit(onSignUpSubmit)}
            className={classes.login_form}
          >
            <h1>회원 가입</h1>
            <input
              id="id"
              type="text"
              placeholder="아이디"
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
            {isIdAvailable === 1 && (
              <span className={classes.success_message}>
                사용 가능한 아이디입니다.
              </span>
            )}
            {!(isIdAvailable === -1) || (
              <span role="alert" className={classes.error_message}>
                이미 사용 중인 아이디입니다.
              </span>
            )}
            {errors.id && (
              <span className={classes.error_message}>{errors.id.message}</span>
            )}

            <input
              id="password"
              type="password"
              placeholder="비밀번호"
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
              <div role="alert" className={classes.error_message}>
                {errors.password.message}
              </div>
            )}

            <input
              id="passwordConfirm"
              type="password"
              placeholder="비밀번호 확인"
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
              <div role="alert" className={classes.error_message}>
                {errors.passwordConfirm.message}
              </div>
            )}

            <input
              id="name"
              type="text"
              placeholder="이름"
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

            {errors.name && (
              <div role="alert" className={classes.error_message}>
                {errors.name.message}
              </div>
            )}

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

            {errors.email && (
              <div role="alert" className={classes.error_message}>
                {errors.email.message}
              </div>
            )}

            <button className={classes.form_btn}>Sign Up</button>
          </form>
        </div>

        {/* LOGIN */}
        <div className={classes.sign_In_container}>
          <form
            onSubmit={handleLoginSubmit(onLogInSubmit)}
            className={classes.login_form}
          >
            <h1>로그인</h1>
            <input
              type="text"
              placeholder="아이디"
              aria-invalid={
                isLoginSubmitted
                  ? loginErrors.id
                    ? 'true'
                    : 'false'
                  : undefined
              }
              {...loginRegister('id', {
                required: '아이디는 필수 입력입니다.',
                minLength: {
                  value: 4,
                  message: '4자리 이상 입력해주세요.',
                },
              })}
            />
            {loginErrors.id && (
              <small role="alert" className={classes.error_message}>
                {loginErrors.id.message}
              </small>
            )}
            <input
              type="password"
              placeholder="비밀번호"
              aria-invalid={
                isLoginSubmitted
                  ? loginErrors.password
                    ? 'true'
                    : 'false'
                  : undefined
              }
              {...loginRegister('password', {
                required: '비밀번호는 필수 입력입니다.',
                minLength: {
                  value: 7,
                  message: '7자리 이상 비밀번호를 사용하세요.',
                },
              })}
            />
            {loginErrors.password && (
              <small role="alert" className={classes.error_message}>
                {loginErrors.password.message}
              </small>
            )}
            <button className={classes.form_btn}>Login</button>
          </form>
        </div>

        <div className={classes.overlay_container}>
          <div className={classes.overlay_left}>
            <p className={classes.p}>이미 회원가입하셨나요?</p>
            <h1>로그인하고 기존 일정을 관리해보세요!</h1>
            <button
              id="signIn"
              onClick={clickHandler}
              className={classes.overlay_btn}
            >
              Login
            </button>
          </div>
          <div className={classes.overlay_right}>
            <p className={classes.p}>
              나의 달력 너의 달력에 오신 것을 환영합니다!
            </p>
            <h1>회원가입하고 일정을 효율적으로 관리해보세요.</h1>
            <button
              id="signUp"
              onClick={clickHandler}
              className={classes.overlay_btn}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginSignup;
