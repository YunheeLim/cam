import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, getDocs } from 'firebase/firestore';
import db from '../../../../firebase/firestore'; // Firestore 초기화 파일

export async function POST(req: NextRequest) {
  try {
    // 요청 본문에서 데이터 추출
    const requestBody = await req.json();
    const { user_id } = requestBody;

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id는 필수 값입니다.' },
        { status: 400 },
      );
    }

    // Firestore에서 user_id로 사용자 검색
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where('user_id', '==', user_id));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json(
        { error: '해당 user_id를 가진 사용자가 존재하지 않습니다.' },
        { status: 404 },
      );
    }

    // 첫 번째 도큐먼트에서 user_name 추출
    let userName = null;
    querySnapshot.forEach(doc => {
      const data = doc.data();
      userName = data.user_name;
    });

    if (!userName) {
      return NextResponse.json(
        { error: 'user_name 필드가 존재하지 않습니다.' },
        { status: 500 },
      );
    }

    // 성공 응답
    return NextResponse.json(
      { message: '유저 정보 불러오기 성공', user_name: userName },
      { status: 200 },
    );
  } catch (err) {
    console.error('서버 오류:', err);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
