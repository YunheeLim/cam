import { NextRequest, NextResponse } from 'next/server';

// app/api/users/route.ts
export async function GET(req: NextRequest) {
  return NextResponse.json({
    name: 'John Doe',
  });
}
