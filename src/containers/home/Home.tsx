'use client';

import { useState, useEffect } from 'react';
import MeetingButton from './MeetingButton';
import Accessibility from './Accessibility';
import Button from '@/components/Button';
import Modal from '@/containers/home/Modal';
import { useRouter, usePathname } from 'next/navigation';
import { useHotkeys } from 'react-hotkeys-hook';
import encrypt from '@/lib/encrypt';
import axios from 'axios';
import AuthModal from './AuthModal';

const Home = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false); // 참여 모달
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [tempKeyboard, setTempKeyBoard] = useState(false); // 토글만
  const [isKeyboard, setIsKeyBoard] = useState(false); // 저장
  const [userId, setUserId] = useState<string | null>('');

  useEffect(() => {
    if (window.localStorage.getItem('shortcut') === 'true') {
      setTempKeyBoard(true);
      setIsKeyBoard(true);
    }
    if (window.localStorage.getItem('user_id')) {
      setUserId(window.localStorage.getItem('user_id'));
    }
  }, []);

  const getUser = async () => {
    try {
      const response = await axios.post(`/api/user`, { user_id: userId });
      console.log('res:', response);
      if (response.status === 200) {
        window.localStorage.setItem('user_name', response.data.user_name);
      } else {
        console.log('Failed to get user name', response);
      }
    } catch (err) {
      console.error('Failed to get user name', err);
    }
  };

  useEffect(() => {
    if (userId) {
      getUser();
    }
  }, [userId]);

  // 회의 생성
  const handleCreateMeeting = async () => {
    // 회의 ID 생성 후 암호화
    const meetingId = encrypt();
    router.push(`preview/${meetingId}?type=new`);
  };

  // 회의 참가
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // 참가 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenAuthModal = () => {
    setIsAuthModalOpen(prev => !prev);
  };

  // 유저 모달 닫기
  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // 단축키 토글
  const handleKeyboard = () => {
    setTempKeyBoard(prev => !prev);
  };

  // 단축키 설정 저장
  const saveKeyboard = () => {
    setIsKeyBoard(tempKeyboard);
    localStorage.setItem('shortcut', JSON.stringify(tempKeyboard));
  };

  useHotkeys('left', () => router.back(), { enabled: isKeyboard }); // 뒤로가기
  useHotkeys('1', handleCreateMeeting, { enabled: isKeyboard }); // 회의 생성
  useHotkeys('2', handleOpenModal, { enabled: isKeyboard }); // 회의 참가
  useHotkeys('esc', handleCloseModal, { enabled: isKeyboard }); // 참가 모달 닫기
  useHotkeys('s', saveKeyboard); // 단축키 설정 저장

  // 시간
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
    <>
      {isModalOpen && <Modal onClose={handleCloseModal} />}
      {isAuthModalOpen && <AuthModal onClose={handleCloseAuthModal} />}

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
            <Accessibility isToggled={tempKeyboard} onClick={handleKeyboard}>
              단축키
            </Accessibility>
            <Button onClick={saveKeyboard} className="mt-3 w-full">
              저장
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
