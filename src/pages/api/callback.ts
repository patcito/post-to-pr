import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import { load } from 'ts-dotenv';
import github, { getOctokit } from '@actions/github';
import faunadb from 'faunadb';

const env = load({
  CLIENT_ID: String,
  CLIENT_SECRET: String,
  FAUNA_SECRET: String,
  NODE_ENV: ['production' as const, 'development' as const],
});

const client = new faunadb.Client({
  secret: env.FAUNA_SECRET,
  domain: 'db.fauna.com',
  scheme: 'https',
});
const q = faunadb.query;

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
export default async (req: NextApiRequest, res: NextApiResponse) => {
  res.statusCode = 200;
  const body = req.query;
  const code = req.query['code'];
  if (code) {
    const request = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: env.CLIENT_ID,
        client_secret: env.CLIENT_SECRET,
        code,
      }),
    });

    const text = await request.text();
    const user = await fetch('https://api.github.com/user', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'token ghu_EtXuMFEnfNSMG9zK08GFcQzRHTZecJ1YwPhp',
      },
    });

    const json = await request.json();
    console.log(text);
    const access_token_str = text.split('&')[0].split('=')[1];
    const data = {
      access_token: access_token_str,
    };
    client
      .query(
        q.Create(q.Collection('userRepoToken'), {
          data: { data, user },
        }),
      )
      .then((ret) => console.log(ret));
    res.json({
      body,
      text: text,
    });
    return;
  }
  res.json({
    body,
    text: 'no token found',
  });
};
