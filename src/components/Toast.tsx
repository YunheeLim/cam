import { useEffect } from 'react';

interface ToastProps {
  message: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed left-1/2 top-5 z-50 -translate-x-1/2 transform rounded bg-gray-800 px-4 py-2 text-white shadow-lg">
      {message}
    </div>
  );
};

export default Toast;
