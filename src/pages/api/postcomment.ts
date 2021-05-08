import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import { load } from 'ts-dotenv';
import github, { getOctokit } from '@actions/github';

const env = load({
  CLIENT_ID: String,
  CLIENT_SECRET: String,
  ACCESS_TOKEN: String,
  NODE_ENV: ['production' as const, 'development' as const],
});

const token = env.ACCESS_TOKEN;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log('entering');
  if (req.method === 'POST') {
    console.log('entering post', req);
    const okto = await getOctokit(token);
    const owner = req.body['owner'] || 'patcito';
    const repo = req.body['repo'] || 'wftest';
    const number = parseInt(req.body['number']) || 14;
    const summary = req.body['summary'] || 'Found something!';
    const label = req.body['label'] || 'label';

    console.log('entering request', {
      owner: owner,
      repo: repo,
      issue_number: number,
      body: `## ${label}
${summary}
`,
    });
    const request = await okto.issues.createComment({
      owner: owner,
      repo: repo,
      issue_number: number,
      body: `## ${label}
${summary}
`,
    });
    res.json({
      response: request,
      client_id: env.CLIENT_ID,
      client_secret: env.CLIENT_SECRET,
    });
    return;
  }
  res.json({
    client_id: env.CLIENT_ID,
    client_secret: env.CLIENT_SECRET,
  });
};
