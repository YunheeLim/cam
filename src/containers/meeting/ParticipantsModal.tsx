import { OpenVidu, Session, Publisher, StreamManager } from 'openvidu-browser';
import { useState, useEffect } from 'react';
interface ParticipantsModalProps {
  publisher: Publisher;
  subscribers: StreamManager[];
}

const ParticipantsModal: React.FC<ParticipantsModalProps> = ({
  publisher,
  subscribers,
}) => {
  const [participantsList, setParticipantsList] = useState<string[]>([]);

  useEffect(() => {
    if (publisher) {
      const publisherName =
        JSON.parse(publisher?.session?.options?.metadata).clientData + ' (나)';
      const subscribersName = subscribers
        .filter(item => item.stream.typeOfVideo !== 'SCREEN') // 참여자에서 스크린 스트림 제외
        .map(item => JSON.parse(item.stream.connection.data).clientData);

      // 새로운 참여자 목록 생성
      const newParticipantsList = [publisherName, ...subscribersName];

      // 중복 없이 상태 업데이트
      setParticipantsList(newParticipantsList);
    }
  }, [publisher, subscribers]);

  return (
    <div
      className={`absolute bottom-14 right-0 w-fit overflow-hidden rounded-lg bg-white shadow-lg`}
    >
      {participantsList?.map((item: string) => (
        <div
          key={item}
          className="border-white-hover hover:bg-white-hover flex cursor-pointer flex-row items-center gap-2 whitespace-nowrap border-b p-3 font-semibold text-primary"
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export default ParticipantsModal;
