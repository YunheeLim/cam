'use client';

import fireStore from '../../../firebase/firestore';
import { collection, addDoc } from 'firebase/firestore';
import { useState } from 'react';

export default function Home() {
  const [user_id, setValue] = useState<string>();

  const onClickUpLoadButton = async () => {
    //    addDoc(collection(db       , "컬렉션이름") , { 추가할 데이터 }
    await addDoc(collection(fireStore, `users`), {
      user_id,
    });
  };

  return (
    <div>
      <form onSubmit={event => event.preventDefault()}>
        <input onChange={event => setValue(event.target.value)} />
        <button onClick={onClickUpLoadButton}>전송</button>
      </form>
    </div>
  );
}
