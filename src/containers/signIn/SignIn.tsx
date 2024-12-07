'use client';

import Logo from '../../../public/svgs/logo.svg';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SignIn = () => {
  const router = useRouter();
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [warningId, setWarningId] = useState('');
  const [warningPw, setWarningPw] = useState('');

  // 아이디 입력
  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
    setWarningId('');
  };

  // 비밀번호 입력
  const handlePwChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPw(e.target.value);
    setWarningId('');
  };

  const handleSignIn = () => {
    if (!id) {
      setWarningId('아이디를 입력해주세요.');
    }
    if (!pw) {
      setWarningPw('비밀번호를 입력해주세요.');
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="flex w-[416px] flex-col items-center gap-8">
        <div className="flex w-full flex-col items-center gap-1 font-semibold text-primary">
          <Logo width="32" height="32" />
          <div className="text-4xl">C A M</div>
          <div className="text-center">
            <div className="text-base">환영합니다!</div>
            <div className="text-base">로그인하여 바로 회의에 참여하세요</div>
          </div>
        </div>
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
          <div className="flex w-full flex-col ">
            <Input
              onChange={handlePwChange}
              type="password"
              placeholder="비밀번호"
            />
            <div className=" px-2 text-sm font-medium text-red-500">
              {warningPw ?? ''}
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col items-center gap-3">
          <Button onClick={handleSignIn} className="w-full">
            로그인
          </Button>
          <Button
            onClick={() => router.push('/signUp')}
            className="hover:!bg-white-hover-2 w-full !border !border-primary !bg-[#ffffff] !text-primary"
          >
            회원가입
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
