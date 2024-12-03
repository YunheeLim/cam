import Input from '@/components/Input';
import { MdContentCopy } from 'react-icons/md';
import { useState } from 'react';

interface CopyMeetingIdProps {
  meetingId: string;
}

const CopyMeetingId: React.FC<CopyMeetingIdProps> = ({ meetingId }) => {
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

  // 복사 후 팝업 알림
  const handleShowPopup = () => {
    setShowPopup(true); // 팝업 표시
    setTimeout(() => {
      setShowPopup(false); // 1초 후 팝업 숨기기
    }, 1000); // 1000ms = 1초
  };

  return (
    <div
      className={`absolute bottom-16 right-0 flex w-fit flex-col gap-2 overflow-hidden rounded-lg bg-white p-4 shadow-lg`}
    >
      <div className=" text-gray-700">
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
  );
};

export default CopyMeetingId;
