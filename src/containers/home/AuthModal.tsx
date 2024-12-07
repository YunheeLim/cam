import CheckIcon from '../../public/svgs/check.svg';
import { FaCheck } from 'react-icons/fa6';

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  return (
    <div
      className={`'top-14' absolute left-0 z-10 w-fit overflow-hidden rounded-lg bg-white shadow-custom-all`}
    >
      <div className="hover:bg-white-hover-1 flex cursor-pointer flex-row items-center gap-2 whitespace-nowrap border-b border-white-hover p-3 font-semibold text-primary">
        {window.localStorage.getItem('user_name')}
      </div>
    </div>
  );
};

export default AuthModal;
