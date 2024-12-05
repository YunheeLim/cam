import { NextRequest, NextResponse } from 'next/server';
import { OpenVidu } from 'openvidu-node-client';

const OPENVIDU_URL =
  process.env.NEXT_PUBLIC_OPENVIDU_URL || 'http://localhost:4443/';
const OPENVIDU_SECRET = process.env.NEXT_PUBLIC_OPENVIDU_SECRET || 'MY_SECRET';

const openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url || '');
    const sessionId = url.searchParams.get('sessionId');
    const body = await req.json();

    if (!sessionId || sessionId === 'test') {
      // Handle POST /api/test
      const session = await openvidu.createSession(body);
      return NextResponse.json(
        { sessionId: session.sessionId },
        { status: 200 },
      );
    } else {
      // Handle POST /api/test/:sessionId
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

      console.log('aaaaaaaaaaaaaaa', session, connection.token);

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
