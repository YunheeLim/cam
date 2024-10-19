'use client';

import { useState, useEffect } from 'react';
import MeetingButton from './MeetingButton';
import Accessibility from './Accessibility';
import Button from '@/components/Button';

const Home = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

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
    <div className="flex flex-row h-full w-full justify-center items-start">
      {/* Wrapper */}
      <div className="h-[733px] w-11/12 md:w-[772px] py-16 rounded-3xl flex flex-col justify-center items-center bg-primary-1 text-primary">
        <div className="text-5xl font-semibold">{formattedTime}</div>
        <div className="mt-5 text-xl font-semibold">{formattedDate}</div>
        <div className="mt-14 flex flex-row gap-5 xs:gap-14">
          <MeetingButton>새 회의</MeetingButton>
          <MeetingButton>참가</MeetingButton>
        </div>
        {/* 수평선 */}
        <div className="my-12 h-0.5 w-4/6 bg-primary" />
        <div className="w-[416px] flex flex-col items-center">
          <Accessibility>스크린 리더</Accessibility>
          <Accessibility>단축키</Accessibility>
          <Button className="mt-3">저장</Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
