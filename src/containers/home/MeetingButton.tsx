import Icon from '../../../public/svgs/icon';

interface MeetingButton {
  children: string;
}

const MeetingButton: React.FC<MeetingButton> = ({ children }) => {
  return (
    <div className="flex flex-col items-center">
      <button
        className={`h-28 w-36 flex justify-center items-center rounded-3xl ${
          children === '새 회의'
            ? 'bg-primary'
            : `bg-white border border-primary`
        }`}
      >
        {children === '새 회의' ? (
          <Icon id="camera" size="66" className="h-16 w-16" />
        ) : (
          <Icon id="plus" size="66" className="h-16 w-16" />
        )}
      </button>
      <div className="py-2 text-xl font-semibold">{children}</div>
    </div>
  );
};

export default MeetingButton;
