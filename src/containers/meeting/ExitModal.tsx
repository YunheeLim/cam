'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import CloseIcon from '../../../public/svgs/close.svg';
import Input from '@/components/Input';
import { useState, useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import Button from '@/components/Button';

interface ExitModalProps {
  onOk: () => void;
  onClose: () => void;
}

const ExitModal: React.FC<ExitModalProps> = ({ onOk, onClose }) => {
  const [isShortcut, setIsShortcut] = useState(false); // 키보드 단축키

  // 단축키 설정 정보
  useEffect(() => {
    if (window.localStorage.getItem('shortcut') === 'true') {
      setIsShortcut(true);
    }
  }, []);

  // 모달창 외부 클릭 시 모달 닫힘
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useHotkeys('esc', onClose, { enabled: isShortcut }); // 모달창 닫기
  useHotkeys('enter', onOk, { enabled: isShortcut }); // 회의 나가기 확인

  return (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50 p-5"
      onClick={handleBackgroundClick}
    >
      <div className="relative flex w-96 flex-col items-center rounded-2xl bg-white p-5">
        <div className="absolute right-5 top-5">
          <button onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <div className="mt-10 flex w-full flex-grow flex-col items-center justify-between gap-10">
          <div className="flex w-full flex-col text-center text-2xl font-semibold">
            회의에서 나가시겠습니까?
          </div>
          <div className="flex w-full flex-row gap-4">
            <Button
              onClick={onOk}
              className="w-2/3 rounded-lg bg-secondary py-3 font-semibold text-white hover:bg-secondary-hover"
            >
              나가기
            </Button>
            <Button
              onClick={onClose}
              className="w-1/3 rounded-lg bg-primary py-3 font-semibold text-white"
            >
              취소
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExitModal;
