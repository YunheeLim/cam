import { OpenVidu, Session, Publisher, StreamManager } from 'openvidu-browser';

interface ParticipantsModalProps {
  publisher: Publisher;
  subscribers: StreamManager[];
}

const ParticipantsModal: React.FC<ParticipantsModalProps> = ({
  publisher,
  subscribers,
}) => {
  const publisherName =
    JSON.parse(publisher?.session?.options?.metadata).clientData + ' (나)';
  const subscribersName = subscribers.map(
    item => JSON.parse(item.stream.connection.data).clientData,
  );

  const participantsList = [publisherName, ...subscribersName];
  return (
    <div
      className={`absolute bottom-16 right-0 w-fit overflow-hidden rounded-lg bg-white shadow-lg`}
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
