import { NextRequest, NextResponse } from 'next/server';
import { OpenVidu } from 'openvidu-node-client';

const OPENVIDU_URL = process.env.NEXT_PUBLIC_OPENVIDU_URL || '';
const OPENVIDU_SECRET = process.env.NEXT_PUBLIC_OPENVIDU_SECRET || '';

const openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);

export async function POST(req: NextRequest) {
  console.log('openvidu url', OPENVIDU_URL);
  try {
    const url = new URL(req.url || '');
    const sessionId = url.searchParams.get('sessionId');
    const body = await req.json();
    console.log('session cnt: ', openvidu?.activeSessions?.length);

    if (!sessionId) {
      // Handle POST /api/signaling
      const session = await openvidu.createSession(body);
      return NextResponse.json(
        { sessionId: session.sessionId, cnt: openvidu?.activeSessions?.length },
        { status: 200 },
      );
    } else {
      // Handle POST /api/signaling?sessionId=sessionId
      const session = openvidu.activeSessions.find(
        s => s.sessionId === sessionId,
      );

      if (!session) {
        return NextResponse.json(
          { error: 'Session not found' },
          { status: 404 },
        );
      }
      const connection = await session.createConnection(body);

      return NextResponse.json({ token: connection.token }, { status: 200 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
