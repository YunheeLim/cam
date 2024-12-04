import { NextRequest, NextResponse } from 'next/server';
import { OpenVidu } from 'openvidu-node-client';
import { openviduClient } from '@/lib/openviduClient';

// OpenVidu 서버 연결 확인
// (async () => {
//   try {
//     // 간단한 요청으로 연결 테스트
//     await openvidu.fetch();
//     console.log(`Connected to OpenVidu server at ${OPENVIDU_URL}`);
//   } catch (error) {
//     console.error(`Failed to connect to OpenVidu server at ${OPENVIDU_URL}`);
//     console.error('Error:', error);
//   }
// })();

export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json();

    var session = openviduClient.activeSessions.find(
      s => s.sessionId === requestBody.sessionId,
    );
    console.log(
      '출력2:',
      requestBody.sessionId,
      openviduClient.activeSessions,
      session,
    );

    if (!session) {
      return NextResponse.json({}, { status: 404 });
    } else {
      var connection = await session.createConnection();
      return NextResponse.json({ token: connection.token });
    }
  } catch (err) {
    return NextResponse.json({}, { status: 500 });
  }
}
