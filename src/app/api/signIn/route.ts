import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, getDocs } from 'firebase/firestore';
import db from '../../../../firebase/firestore'; // Firestore 초기화 파일

export async function POST(req: NextRequest) {
  try {
    // 요청 본문에서 데이터 추출
    const requestBody = await req.json();
    const { user_id, user_password } = requestBody;

    console.log('로그인 시도:', user_id, user_password);

    if (!user_id || !user_password) {
      return NextResponse.json(
        { error: '아이디와 비밀번호를 입력하세요.' },
        { status: 400 },
      );
    }

    // Firestore에서 사용자 검색
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where('user_id', '==', user_id));
    const querySnapshot = await getDocs(q);

    console.log('querySnapshot: ', querySnapshot);

    if (querySnapshot.empty) {
      return NextResponse.json(
        { error: '해당 아이디가 존재하지 않습니다.' },
        { status: 404 },
      );
    }

    let userFound = false;

    querySnapshot.forEach(doc => {
      const userData = doc.data();
      if (userData.user_password === user_password) {
        userFound = true;
      }
    });

    if (!userFound) {
      return NextResponse.json(
        { error: '비밀번호가 일치하지 않습니다.' },
        { status: 401 },
      );
    }

    // 로그인 성공 응답
    return NextResponse.json({ message: '로그인 성공' }, { status: 200 });
  } catch (err) {
    console.error('로그인 실패:', err);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
