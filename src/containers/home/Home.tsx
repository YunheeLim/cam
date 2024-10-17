'use client';

import { useState, useEffect } from 'react';
import Button from './Button';

const Home = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formattedDate = `${currentTime.getFullYear()}년 ${
    currentTime.getMonth() + 1
  }월 ${currentTime.getDate()}일`;

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12; // Convert to 12-hour format
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes; // Add leading zero if needed

  const formattedTime = `${formattedHours} : ${formattedMinutes} ${ampm}`;

  return (
    <div className="h-full flex my-16 justify-center items-start">
      <div className="h-4/6 w-3/6 px-44 py-16 rounded-3xl flex flex-col justify-center items-center bg-primary-1 text-primary">
        <div>{formattedTime}</div>
        <div>{formattedDate}</div>
        <div className="flex flex-row gap-14">
          <Button>새 회의</Button>
          <Button>참가</Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
