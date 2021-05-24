import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';

type AccessToken = {
  access_token: string;
};
type Data = {
  data: AccessToken;
};
const Starting: React.FC<{ code: string }> = (props) => {
  const router = useRouter();
  const { query } = router;
  const [token, setToken] = useState(``);
  const [user, setUser] = useState<any>();
  const [done, setDone] = useState(false);
  const { code } = props;
  useEffect(() => {
    console.log(query);
    const getUser = async (atoken: string) => {
      const json = await fetch(`https://api.github.com/user`, {
        headers: {
          'Content-Type': `application/json`,
          Authorization: `token ${atoken}`,
        },
      });

      const user = await json.json();
      setUser(user);
      createUser(atoken, user);
      return user;
    };

    const createUser = async (atoken: string, juser: any) => {
      const json = await fetch(`/api/createuser`, {
        method: `POST`,
        body: JSON.stringify({
          access_token: atoken,
          user: juser,
        }),
      });
      const ret = await json.json();
      setDone(true);
    };

    const getToken = async (code: string) => {
      const request = await fetch(`/api/callback?code=${code}`);
      const json: any = await request.json();
      const data: Data = json;
      const atoken = data.data;
      setToken(atoken.access_token);
      const user = await getUser(atoken.access_token);
      const ujson = user;
    };

    const access_token = getToken(code);
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
          {done && <p>Ok, you're good to go {user?.login} </p>}
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
};
export default Starting;
