import { NextRequest, NextResponse } from 'next/server';
import { OpenVidu } from 'openvidu-node-client';
import { openviduClient } from '@/lib/openviduClient';

export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json();
    var session = await openviduClient.createSession(requestBody);
    console.log(
      '출력1:',
      requestBody.sessionId,
      openviduClient.activeSessions,
      session,
    );
    return NextResponse.json(
      {
        sessionId: session.sessionId,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);

    return NextResponse.json({}, { status: 500 });
  }
}
