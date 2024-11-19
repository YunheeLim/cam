import React, { useState } from 'react';

interface ToggleButtonType {
  isToggled: boolean;
  onClick: () => void;
}
const ToggleButton: React.FC<ToggleButtonType> = ({ isToggled, onClick }) => {
  // const [isToggled, setIsToggled] = useState(false);

  // const toggleButton = () => {
  //   setIsToggled(!isToggled);
  // };

  return (
    <button
      onClick={onClick}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
        isToggled ? 'bg-primary' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
          isToggled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
};

export default ToggleButton;
