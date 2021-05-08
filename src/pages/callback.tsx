import { useRouter } from 'next/dist/client/router';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
  const router = useRouter();
  const { query } = router;
  let code: string = '';
  if (typeof query.code === 'string') {
    code = query.code;
  }
  const StartingBlock = dynamic(() => import('../components/starting'));
  return code !== '' && <StartingBlock code={code} />;
}
