import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
type AccessToken = {
  access_token: string;
};
export default function Home() {
  const router = useRouter();
  const query = router.query;
  const [token, setToken] = useState('');
  const [user, setUser] = useState<any>();
  const [faunaDone, setFaunaDone] = useState(false);
  useEffect(() => {
    console.log(query);
    const getUser = async (atoken: string) => {
      const json = await fetch('https://api.github.com/user', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `token ${atoken}`,
        },
      });

      const user = await json.json();
      console.log('user', user);
      setUser(user);
      createUser(atoken, user);
      return user;
    };

    const createUser = async (atoken: string, juser: any) => {
      const json = await fetch('/api/createuser', {
        method: 'POST',
        body: JSON.stringify({
          access_token: atoken,
          user: juser,
        }),
      });
      const ret = await json.json();
      console.log('ret faunadb', ret);
      setFaunaDone(true);
    };

    const getToken = async () => {
      const request = await fetch('/api/callback?code=' + query['code']);
      const json: any = await request.json();
      const atoken: AccessToken = json;
      console.log(json);
      setToken(atoken.access_token);
      const user = await getUser(atoken.access_token);
      const ujson = user;
      console.log('user from getToken', ujson);
    };

    const access_token = getToken();
    console.log('got access', access_token);
  }, []);
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome, please wait a couple of seconds before closing the tab !
          {faunaDone && <p>Ok, you're good to go {user?.login} </p>}
        </h1>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=typescript-nextjs-starter"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{` `}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}
