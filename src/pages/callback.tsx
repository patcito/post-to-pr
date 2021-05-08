import { useRouter } from 'next/dist/client/router';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
type AccessToken = {
  access_token: string;
};

export default function Home() {
  const StartingBlock = dynamic(() => import('../components/starting'));
  return <StartingBlock />;
}
