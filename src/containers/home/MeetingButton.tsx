// import Icon from '../../../public/svgs/icon';
import CameraIcon from '../../../public/svgs/camera.svg';
import PlusIcon from '../../../public/svgs/plus.svg';

interface MeetingButton {
  children: string;
  onClick?: () => void;
}

const MeetingButton: React.FC<MeetingButton> = ({ children, onClick }) => {
  return (
    <div className="flex flex-col items-center" onClick={onClick}>
      <button
        className={`h-28 w-36 flex justify-center items-center rounded-3xl ${
          children === '새 회의'
            ? 'bg-primary'
            : `bg-white border border-primary`
        }`}
      >
        {children === '새 회의' ? <CameraIcon /> : <PlusIcon />}
      </button>
      <div className="py-2 text-xl font-semibold">{children}</div>
    </div>
  );
};

export default MeetingButton;
