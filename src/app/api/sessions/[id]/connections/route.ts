import { NextRequest, NextResponse } from 'next/server';
import { OpenVidu } from 'openvidu-node-client';

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse,
// ) {
//   await runMiddleware(req, res, cors);

//   if (req.method === 'POST') {
//     if (req.url === '/api/sessions') {
//       try {
//         const session = await openvidu.createSession(req.body);
//         res.status(200).json({ sessionId: session.sessionId });
//       } catch (error) {
//         res.status(500).json({ error: 'Failed to create session' });
//       }
//     } else if (
//       req.url?.startsWith('/api/sessions/') &&
//       req.url?.endsWith('/connections')
//     ) {
//       const sessionId = req.url.split('/')[3];
//       const session = openvidu.activeSessions.find(
//         s => s.sessionId === sessionId,
//       );
//       if (!session) {
//         res.status(404).json({ error: 'Session not found' });
//       } else {
//         try {
//           const connection = await session.createConnection(req.body);
//           res.status(200).json({ token: connection.token });
//         } catch (error) {
//           res.status(500).json({ error: 'Failed to create connection' });
//         }
//       }
//     } else {s
//       res.status(404).json({ error: 'Not found' });
//     }
//   } else {
//     res.status(405).json({ error: 'Method not allowed' });
//   }
// }

const OPENVIDU_URL = process.env.OPENVIDU_URL || 'http://localhost:4443/';
const OPENVIDU_SECRET = process.env.OPENVIDU_SECRET || 'MY_SECRET';
const openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);

export async function POST(
  req: NextRequest,
  { params }: { params: { sessionId: string } },
) {
  const { sessionId } = params;

  return NextResponse.json({
    result: 'success',
    sessionId: sessionId,
  });
}
