import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import Cookies from 'js-cookie';

import classes from './LoginSignup.module.css';
import { signupApi, checkIdAvailabilityApi, loginApi } from '../api';
import { logedIn } from '../recoilState';

function LoginSignup() {
  let csrftoken = Cookies.get('csrftoken');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isIdAvailable, setIsIdAvailable] = useState();
  const navigate = useNavigate();
  const setIsLogin = useSetRecoilState(logedIn);

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
      Cookies.delete('sessionid');
      const response = await signupApi({
        username: data.id,
        name: data.name,
        password: data.password,
        email: data.email,
      });
      setIsLogin(true);

      console.log(response.data);

      // if (response.status === 201) {
      //   navigate('/', { replace: true });
      // }
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
      setIsLogin(true);

      console.log(response.data);

      // if (response.status === 200) {
      //   navigate('/', { replace: true });
      // }
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
        setIsIdAvailable(true);
        clearErrors('id');
      } else {
        setError('id', {
          type: 'manual',
          message: '이미 사용 중인 아이디입니다.',
        });
      }
    } catch (error) {
      console.error('중복확인 실패:', error);
    }

    console.log(id);
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
            <h1>Create Account</h1>
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
            {/* {isIdAvailable || (
              <small role="alert">이미 사용 중인 아이디입니다.</small>
            )} */}
            <div onClick={checkIdAvailability}>중복확인</div>
            {/* {' '} */}
            {errors.id && <div role="alert">{errors.id.message}</div>}

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
            <button className={classes.form_btn}>Sign Up</button>
          </form>
        </div>

        {/* LOGIN */}
        <div className={classes.sign_In_container}>
          <form
            onSubmit={handleLoginSubmit(onLogInSubmit)}
            className={classes.login_form}
          >
            <h1>Sign In</h1>
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
              <small role="alert">{loginErrors.id.message}</small>
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
              <small role="alert">{loginErrors.password.message}</small>
            )}
            <button className={classes.form_btn}>Sign In</button>
          </form>
        </div>

        <div className={classes.overlay_container}>
          <div className={classes.overlay_left}>
            <h1>Welcome Back</h1>
            <p className={classes.p}>
              To keep connected with us please login with your personal info
            </p>
            <button
              id="signIn"
              onClick={clickHandler}
              className={classes.overlay_btn}
            >
              Sign In
            </button>
          </div>
          <div className={classes.overlay_right}>
            <h1>Hello, Friend</h1>
            <p className={classes.p}>
              Enter your personal details and start journey with us
            </p>
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
