import CheckIcon from '../../public/svgs/check.svg';
import { FaCheck } from 'react-icons/fa6';

interface DeviceModalProps {
  page: string;
  list: MediaDeviceInfo[];
  selectedDeviceId: string;
  prevDeviceId: string;
  onSetSelectedDeviceId: React.Dispatch<React.SetStateAction<string>>;
  onSetPrevDeviceId: React.Dispatch<React.SetStateAction<string>>;
  onSetIsNewStream: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
}

interface ItemProps {
  deviceId: string;
  groupId: string;
  kind: string;
  label: string;
}

const DeviceModal: React.FC<DeviceModalProps> = ({
  page,
  list,
  selectedDeviceId,
  prevDeviceId,
  onSetSelectedDeviceId,
  onSetPrevDeviceId,
  onSetIsNewStream,
  onClose,
}) => {
  const handleSelect = (deviceId: string) => {
    if (deviceId !== prevDeviceId) {
      onSetSelectedDeviceId(deviceId);
      onSetPrevDeviceId(deviceId);
      onSetIsNewStream(true);
    }
    onClose();
  };

  return (
    <div
      className={`absolute left-0 ${
        page === 'meeting' ? 'bottom-14' : 'top-14'
      }  shadow-custom-all z-10 w-fit overflow-hidden rounded-lg bg-white`}
    >
      {list?.map((item: ItemProps) => (
        <div
          key={item.deviceId}
          onClick={() => handleSelect(item.deviceId)}
          className="border-white-hover hover:bg-white-hover flex cursor-pointer flex-row items-center gap-2 whitespace-nowrap border-b p-3 font-semibold text-primary"
        >
          {item.label}
          {item.deviceId === selectedDeviceId && <FaCheck size={20} />}
        </div>
      ))}
    </div>
  );
};

export default DeviceModal;
