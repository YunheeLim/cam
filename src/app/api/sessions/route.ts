import { NextRequest, NextResponse } from 'next/server';
import { OpenVidu } from 'openvidu-node-client';
import Cors from 'cors';

// Initialize CORS middleware
const cors = Cors({
  origin: '*',
});

// Helper method to wait for a middleware to execute before continuing
function runMiddleware(req: NextRequest, res: NextResponse, fn: Function) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

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
//     } else {
//       res.status(404).json({ error: 'Not found' });
//     }
//   } else {
//     res.status(405).json({ error: 'Method not allowed' });
//   }
// }

const OPENVIDU_URL = process.env.OPENVIDU_URL || 'http://localhost:4443/';
const OPENVIDU_SECRET = process.env.OPENVIDU_SECRET || 'MY_SECRET';
const openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);

export async function POST(req: NextRequest, res: NextResponse) {
  await runMiddleware(req, res, cors);

  const requestBody = await req.json();
  const { customSessionId } = requestBody;

  return NextResponse.json({
    result: 'success',
    data: customSessionId,
  });
}
