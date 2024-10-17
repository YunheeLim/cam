'use client';

import Image from 'next/image';
import styles from './page.module.css';
import { useState } from 'react';
import styled from '@emotion/styled';
import Home from '@/components/home/Home';

const Box = styled.div`
  background-color: red;
`;

export default function HomePage() {
  const [data, setData] = useState('usestate data');

  return (
    <>
      <Home />
    </>
  );
}
