import React from 'react';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-50">
      <div className="relative h-16 w-16">
        {/* 회색 바깥 원 */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-300"></div>
        {/* 회전하는 윗부분 강조 원 */}
        <div className="animate-spinSlow absolute inset-0 rounded-full border-4 border-gray-300 border-t-primary"></div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
