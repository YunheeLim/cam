'use client';

import { useState, useEffect } from 'react';
import MeetingButton from './MeetingButton';
import Accessibility from './Accessibility';
import Button from '@/components/Button';
import Modal from '@/containers/home/Modal';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

const Home = () => {
  const router = useRouter();
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateMeeting = async () => {
    // 회의 ID 생성 규칙: 회의 생성 날짜 + 랜덤숫자
    const createdId = currentTime.getTime() + Math.floor(Math.random() * 100000);
    router.push(`preview/${createdId}`)
  }


  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

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

  const formattedDate = `${dayName}, ${currentTime.getMonth() + 1
    }월 ${currentTime.getDate()}일`;

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12; // Convert to 12-hour format
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes; // Add leading zero if needed
  const formattedTime = `${formattedHours} : ${formattedMinutes} ${ampm}`;

  return (
    <div className="flex flex-row h-full w-full justify-center items-center">
      {/* Wrapper */}
      <div className="w-11/12 md:w-[700px] py-16 px-6 sm:px-0 rounded-3xl flex flex-col justify-center items-center bg-primary-1 text-primary">
        <div className="text-5xl font-semibold">{formattedTime}</div>
        <div className="mt-5 text-xl font-semibold">{formattedDate}</div>
        <div className="mt-14 max-w-344 w-full flex flex-row justify-between">
          <MeetingButton onClick={handleCreateMeeting}>새 회의</MeetingButton>
          <MeetingButton onClick={handleOpenModal}>참가</MeetingButton>
        </div>
        {/* 수평선 */}
        <div className="my-10 h-px w-4/6 bg-primary"></div>
        <div className="w-full sm:w-[416px] flex flex-col items-center">
          <Accessibility>스크린 리더</Accessibility>
          <Accessibility>단축키</Accessibility>
          <Button className="mt-3 w-full">저장</Button>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default Home;
