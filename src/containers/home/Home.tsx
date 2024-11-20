'use client';

import { useState, useEffect } from 'react';
import MeetingButton from './MeetingButton';
import Accessibility from './Accessibility';
import Button from '@/components/Button';
import Modal from '@/containers/home/Modal';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useHotkeys } from 'react-hotkeys-hook';

const Home = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isKeyboard, setIsKeyBoard] = useState(false);

  const handleCreateMeeting = async () => {
    // 회의 ID 생성 규칙: 회의 생성 날짜 + 랜덤숫자
    const createdId =
      currentTime.getTime() + Math.floor(Math.random() * 100000);
    router.push(`preview/${createdId}?type=new`);
  };
  useHotkeys('1', handleCreateMeeting, { enabled: isKeyboard });

  // 단축키 설정
  const handleKeyboard = () => {
    setIsKeyBoard(prev => {
      window.sessionStorage.setItem('shortcut', JSON.stringify(!prev));
      return !prev;
    });
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  useHotkeys('2', handleOpenModal, { enabled: isKeyboard });

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const daysOfWeek = [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ];
  const dayName = daysOfWeek[currentTime.getDay()];

  const formattedDate = `${dayName}, ${
    currentTime.getMonth() + 1
  }월 ${currentTime.getDate()}일`;

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12; // Convert to 12-hour format
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes; // Add leading zero if needed
  const formattedTime = `${formattedHours} : ${formattedMinutes} ${ampm}`;

  return (
    <div
      id="container"
      className="flex h-full w-full flex-row items-center justify-center"
    >
      {/* Wrapper */}
      <div className="flex w-11/12 flex-col items-center justify-center rounded-3xl bg-primary-1 px-6 py-16 text-primary sm:px-0 md:w-[700px]">
        <div className="text-5xl font-semibold">{formattedTime}</div>
        <div className="mt-5 text-xl font-semibold">{formattedDate}</div>
        <div className="mt-14 flex w-full max-w-344 flex-row justify-between">
          <MeetingButton onClick={handleCreateMeeting}>새 회의</MeetingButton>
          <MeetingButton onClick={handleOpenModal}>참가</MeetingButton>
        </div>
        {/* 수평선 */}
        <div className="my-10 h-px w-4/6 bg-primary"></div>
        <div className="flex w-full flex-col items-center sm:w-[416px]">
          {/* <Accessibility>스크린 리더</Accessibility> */}
          <Accessibility isToggled={isKeyboard} onClick={handleKeyboard}>
            단축키
          </Accessibility>
          <Button className="mt-3 w-full">저장</Button>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default Home;
