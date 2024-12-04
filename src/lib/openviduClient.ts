import { OpenVidu } from 'openvidu-node-client';

class OpenViduSingleton {
  private static instance: OpenVidu | null = null;

  private constructor() {
    // private constructor로 외부에서 직접 생성 불가능
  }

  public static getInstance(): OpenVidu {
    if (!OpenViduSingleton.instance) {
      const OPENVIDU_URL = process.env.OPENVIDU_URL || 'http://localhost:4443/';
      const OPENVIDU_SECRET = process.env.OPENVIDU_SECRET || 'MY_SECRET';
      OpenViduSingleton.instance = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
      console.log(`OpenVidu client initialized with URL: ${OPENVIDU_URL}`);
    }
    return OpenViduSingleton.instance;
  }
}

export const openviduClient = OpenViduSingleton.getInstance();
