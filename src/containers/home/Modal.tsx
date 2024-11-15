'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import CloseIcon from '../../../public/svgs/close.svg';
import Input from '@/components/Input';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();

  if (!isOpen) return null;

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-5"
      onClick={handleBackgroundClick}
    >
      <div className="relative flex w-96 flex-col rounded-2xl bg-white p-5">
        <div className="absolute right-5 top-5">
          <button onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <h1 className="text-lg font-semibold">회의 참가</h1>
        <div className="mt-5 flex flex-grow flex-col items-center justify-between gap-5">
          <Input placeholder="회의 ID 또는 링크" />
          <button
            onClick={() => router.push('/preview')}
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
