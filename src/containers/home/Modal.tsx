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
      className="fixed inset-0 p-5 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackgroundClick}
    >
      <div className="relative flex flex-col w-96 bg-white p-5 rounded-2xl">
        <div className="absolute top-5 right-5">
          <button onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <h1 className="font-semibold text-lg">회의 참가</h1>
        <div className="mt-5 flex flex-col items-center justify-between gap-5 flex-grow">
          <Input placeholder="회의 ID 또는 링크" />
          <button
            onClick={() => router.push('/preview')}
            className="w-full py-3 bg-primary text-white font-semibold rounded-lg"
          >
            참가
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
