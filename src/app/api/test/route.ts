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

const OPENVIDU_URL = process.env.OPENVIDU_URL || 'http://localhost:4443/';
const OPENVIDU_SECRET = process.env.OPENVIDU_SECRET || 'MY_SECRET';
const openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);

// app/api/users/route.ts
export async function GET(req: NextRequest) {
  return NextResponse.json({
    name: 'John Doe',
  });
}
