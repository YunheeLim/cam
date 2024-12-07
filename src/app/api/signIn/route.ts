import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, Firestore } from 'firebase/firestore';
import db from '../../../../firebase/firestore';

export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json();
    const { user_id, user_email, user_name, user_password } = requestBody;
    console.log('asdfasdfadsf', user_id, user_email, user_name);

    if (!user_id || !user_email || !user_name) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 },
      );
    }

    // Firestore에 데이터 추가
    const docRef = await addDoc(collection(db, 'users'), {
      user_id,
      user_email,
      user_name,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: '회원가입 저장 성공', docId: docRef.id },
      { status: 200 },
    );
  } catch (err) {
    console.error('데이터 저장 실패:', err);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
