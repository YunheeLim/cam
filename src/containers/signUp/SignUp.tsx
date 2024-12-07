'use client';

import Logo from '../../../public/svgs/logo.svg';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import axios from 'axios';
import LoadingIndicator from '@/components/LoadingIndicator';

const SignUp = () => {
  const router = useRouter();

  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [pw, setPw] = useState('');
  const [pwCheck, setPwCheck] = useState('');

  const [warningId, setWarningId] = useState('');
  const [warningEmail, setWarningEmail] = useState('');
  const [warningName, setWarningName] = useState('');
  const [warningPw, setWarningPw] = useState('');
  const [warningPwCheck, setWarningPwCheck] = useState('');

  const [isPw, setIsPw] = useState(false); // 비밀번호 보기
  const [isPwCheck, setIsPwCheck] = useState(false); // 비밀번호 확인 보기
  const [isLoading, setIsLoading] = useState(false); // 로딩

  // 아이디 입력
  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
    setWarningId('');

    if (e.target.value.length < 5) {
      setWarningId('아이디는 5글자 이상으로 입력해주세요.');
    }
  };

  // 이메일 입력
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setWarningEmail('');

    // 이메일 형식 확인
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(e.target.value)) {
      setWarningEmail('유효한 이메일 주소를 입력하세요.');
    } else {
      setWarningEmail('');
    }
  };

  // 이름 입력
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setWarningName('');
  };

  // 비밀번호 입력
  const handlePwChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPw(e.target.value);
    setWarningId('');

    // 비밀번호 규칙
    const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!pwRegex.test(e.target.value)) {
      setWarningPw('비밀번호는 8글자 이상, 영어와 숫자를 섞어서 입력하세요.');
    } else {
      setWarningPw('');
    }
    setWarningId('');
  };

  // 비밀번호 확인 입력
  const handlePwCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPwCheck(e.target.value);
    setWarningPwCheck('');

    if (e.target.value !== pw) {
      setWarningPwCheck('비밀번호가 일치하지 않습니다.');
    }
  };

  const handleSignUp = async () => {
    if (!id) {
      setWarningId('아이디를 입력해주세요.');
    }
    if (!email) {
      setWarningEmail('이메일을 입력해주세요.');
    }
    if (!name) {
      setWarningName('이름을 입력해주세요.');
    }
    if (!pw) {
      setWarningPw('비밀번호를 입력해주세요.');
    }
    if (!pwCheck) {
      setWarningPwCheck('비밀번호를 확인해주세요.');
    }
    if (id && email && name && pw && pwCheck) {
      if (
        !warningId &&
        !warningEmail &&
        !warningName &&
        !warningPw &&
        !warningPwCheck
      ) {
        setIsLoading(true);
        try {
          const response = await axios.post('/api/signUp', {
            user_id: id,
            user_email: email,
            user_name: name,
            user_password: pw,
          });
          console.log('res:', response);
          if (response.status === 200) {
            router.push('/signIn');
          } else {
            console.log('Failed to sign up', response);
          }
          setIsLoading(false);
        } catch (err) {
          console.error('Failed to sign up', err);
          setIsLoading(false);
        }
      }
    }
  };

  return (
    <>
      {isLoading && <LoadingIndicator />}
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="flex w-[416px] flex-col items-center gap-8">
          <div className="flex w-full flex-col items-center gap-3 font-semibold text-primary">
            <Logo width="32" height="32" />
            <div className="text-3xl">회원가입</div>
          </div>

          {/* 아이디 */}
          <div className="flex w-full flex-col items-center gap-3">
            <div className="flex w-full flex-col ">
              <Input
                onChange={handleIdChange}
                className="text-black"
                placeholder="아이디"
              />
              <div className=" px-2 text-sm font-medium text-red-500">
                {warningId ?? ''}
              </div>
            </div>

            {/* 이메일 */}
            <div className="flex w-full flex-col ">
              <Input
                type="email"
                onChange={handleEmailChange}
                className="text-black"
                placeholder="이메일 주소"
              />
              <div className=" px-2 text-sm font-medium text-red-500">
                {warningEmail ?? ''}
              </div>
            </div>

            {/* 이름 */}
            <div className="flex w-full flex-col ">
              <Input
                type="text"
                onChange={handleNameChange}
                className="text-black"
                placeholder="이름"
              />
              <div className=" px-2 text-sm font-medium text-red-500">
                {warningName ?? ''}
              </div>
            </div>

            {/* 비밀번호 */}
            <div className="flex w-full flex-col">
              <div className="relative flex items-center">
                <Input
                  onChange={handlePwChange}
                  placeholder="비밀번호"
                  type={isPw ? 'text' : 'password'}
                  className="w-full"
                />
                <div
                  onClick={() => setIsPw(prev => !prev)}
                  className="absolute right-2 flex h-full items-center"
                >
                  {isPw ? (
                    <IoEyeOutline size={24} color="#8c8c8c" />
                  ) : (
                    <IoEyeOffOutline size={24} color="#8c8c8c" />
                  )}
                </div>
              </div>

              <div className="px-2 text-sm font-medium text-red-500">
                {warningPw ?? ''}
              </div>
            </div>

            {/* 비밀번호 확인 */}
            <div className="flex w-full flex-col">
              <div className="relative flex items-center">
                <Input
                  onChange={handlePwCheckChange}
                  placeholder="비밀번호 확인"
                  type={isPwCheck ? 'text' : 'password'}
                  className="w-full"
                />
                <div
                  onClick={() => setIsPwCheck(prev => !prev)}
                  className="absolute right-2 flex h-full items-center"
                >
                  {isPwCheck ? (
                    <IoEyeOutline size={24} color="#8c8c8c" />
                  ) : (
                    <IoEyeOffOutline size={24} color="#8c8c8c" />
                  )}
                </div>
              </div>

              <div className="px-2 text-sm font-medium text-red-500">
                {warningPwCheck ?? ''}
              </div>
            </div>
          </div>

          {/* 회원가입 버튼 */}
          <Button onClick={handleSignUp} className="w-full">
            회원가입
          </Button>
        </div>
      </div>
    </>
  );
};

export default SignUp;
