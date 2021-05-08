import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import { load } from 'ts-dotenv';
import github, { getOctokit } from '@actions/github';

const env = load({
  CLIENT_ID: String,
  CLIENT_SECRET: String,
  NODE_ENV: ['production' as const, 'development' as const],
});

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
