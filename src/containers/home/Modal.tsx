'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import CloseIcon from '../../../public/svgs/close.svg';
import Input from '@/components/Input';
import { useState, useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { warn } from 'console';

interface ModalProps {
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ onClose }) => {
  const router = useRouter();
  const [text, setText] = useState('');
  const [warning, setWarning] = useState('');

  // 인풋값
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    setWarning('');
  };

  // 모달창 외부 클릭 시 모달 닫힘
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 회의 참가
  const handleJoinClick = () => {
    if (text === '') {
      setWarning('회의 ID를 입력해주세요.');
    } else {
      router.push(`/preview/${text}?type=exist`);
    }
  };

  // 회의 참가 단축키: enter
  useHotkeys('enter', handleJoinClick, {
    enabled: localStorage.getItem('shortcut') === 'true',
  });

  return (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50 p-5"
      onClick={handleBackgroundClick}
    >
      <div className="relative flex h-56 w-96 flex-col rounded-2xl bg-white p-5">
        <div className="absolute right-5 top-5">
          <button onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <h1 className="text-lg font-semibold">회의 참가</h1>
        <div className="mt-5 flex flex-grow flex-col items-center justify-between">
          <div className="flex w-full flex-col">
            <Input onChange={handleChange} placeholder="회의 ID" />
            <div className="mt-1 px-2 text-sm font-medium text-red-500">
              {warning}
            </div>
          </div>
          <button
            onClick={handleJoinClick}
            className="w-full rounded-lg bg-primary py-3 font-semibold text-white"
          >
            참가
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
