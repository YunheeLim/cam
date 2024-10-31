import React from 'react';
import OpenViduVideoComponent from './OvVideo';

interface UserVideoComponentProps {
  streamManager: any;
}

const UserVideoComponent: React.FC<UserVideoComponentProps> = ({ streamManager }) => {

  const getNicknameTag = () => {
    // Gets the nickName of the user
    return JSON.parse(streamManager.stream.connection.data).clientData;
  };

  return (
    <div>
      {streamManager ? (
        <div className="streamcomponent">
          <OpenViduVideoComponent streamManager={streamManager} />
          <div><p>{getNicknameTag()}</p></div>
        </div>
      ) : null}
    </div>
  );
};

export default UserVideoComponent;
