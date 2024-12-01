import CheckIcon from '../../public/svgs/check.svg';
import { FaCheck } from 'react-icons/fa6';

interface DeviceModalProps {
  list: MediaDeviceInfo[];
  selectedDeviceId: string;
  onSetSelectedDeviceId: React.Dispatch<React.SetStateAction<string>>;
  onClose: () => void;
}

interface ItemProps {
  deviceId: string;
  groupId: string;
  kind: string;
  label: string;
}

const DeviceModal: React.FC<DeviceModalProps> = ({
  list,
  selectedDeviceId,
  onSetSelectedDeviceId,
  onClose,
}) => {
  const handleSelect = (deviceId: string) => {
    onSetSelectedDeviceId(deviceId);
    onClose();
  };

  return (
    <div className="absolute left-0 top-14 w-fit overflow-hidden rounded-lg bg-primary shadow-lg">
      {list?.map((item: ItemProps) => (
        <div
          key={item.deviceId}
          onClick={() => handleSelect(item.deviceId)}
          className="flex cursor-pointer flex-row items-center gap-2 whitespace-nowrap border-b border-primary-hover p-3 font-semibold text-white hover:bg-primary-hover"
        >
          {item.label}
          {item.deviceId === selectedDeviceId && <FaCheck size={20} />}
        </div>
      ))}
    </div>
  );
};

export default DeviceModal;
