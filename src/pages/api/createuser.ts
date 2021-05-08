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
  console.log('entering');
  if (req.method === 'POST') {
    console.log('entering post', req);
    const body = JSON.parse(req.body);
    const access_token = body['access_token'];
    const user = body['user'];
    try {
      const data = {
        access_token: access_token,
        user,
      };
      const resF = await client.query(
        q.Create(q.Collection('userRepoToken'), {
          data: data,
        }),
      );
      console.log(resF);
      res.json({
        body: req.body,
        text: data,
        f: resF,
      });
      return;
    } catch (error) {
      res.json({
        error,
      });
    }
  }
  res.json({
    text: 'no token found',
  });
};
