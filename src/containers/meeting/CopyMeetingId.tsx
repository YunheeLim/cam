import Input from '@/components/Input';
import { MdContentCopy } from 'react-icons/md';
import { useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';

interface CopyMeetingIdProps {
  meetingId: string;
  onClose: () => void;
}

const CopyMeetingId: React.FC<CopyMeetingIdProps> = ({
  meetingId,
  onClose,
}) => {
  const [copyStatus, setCopyStatus] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  // 회의 아이디 복사
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(meetingId);
      setCopyStatus('회의 ID가 복사되었습니다!');
    } catch (err) {
      setCopyStatus('회의 ID 복사 실패');
      console.error('Error copying to clipboard: ', err);
    }
  };

  // 복사 후 2초 팝업
  useEffect(() => {
    if (copyStatus) {
      setTimeout(() => {
        setCopyStatus('');
      }, 1500);
    }
  }, [copyStatus]);

  return (
    <div
      className={`absolute bottom-20 right-0 rounded-lg bg-white px-7 py-6 shadow-lg`}
    >
      <div className="relative flex flex-col gap-2 pt-1">
        <div
          onClick={onClose}
          className="absolute -right-6 -top-5 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full hover:bg-gray-200"
        >
          <IoMdClose size={20} color="#696969" />
        </div>
        <div className="text-gray-700">
          회의에 참여하기를 원하는 다른 사용자와 이 회의 ID를 공유하세요.
        </div>
        <Input
          className="bg-gray-200 pr-11"
          defaultValue={meetingId}
          disabled
          icon={<MdContentCopy size={20} />}
          onClick={handleCopy}
        />
      </div>
      {copyStatus && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 transform rounded bg-black bg-opacity-70 px-4 py-2 text-white">
          {copyStatus}
        </div>
      )}
    </div>
  );
};

export default CopyMeetingId;
