import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import { load } from 'ts-dotenv';
import github, { getOctokit } from '@actions/github';

import { createClient } from '@supabase/supabase-js';
import { definitions } from '../../../types/supabase';
const env = load({
  CLIENT_ID: String,
  CLIENT_SECRET: String,
  SUPABASE_KEY: String,
  SUPABASE_URL: String,
  NODE_ENV: ['production' as const, 'development' as const],
});

const supabaseUrl = env.SUPABASE_URL;
const supabaseKey = env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log('entering');
  const owner = req.body['owner'];
  if (req.method === 'POST') {
    let { data: users, error } = await supabase
      .from<definitions['users']>('users')
      .select('*')
      .eq('login', owner);
    if (users && users.length > 0) {
      const user = users[0];
      if (user.access_token) {
        console.log('entering post', req);
        const okto = await getOctokit(user.access_token);
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
      }
    }
    return;
  }
  res.json({
    client_id: env.CLIENT_ID,
    client_secret: env.CLIENT_SECRET,
  });
};
