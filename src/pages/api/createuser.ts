import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import { load } from 'ts-dotenv';
import github, { getOctokit } from '@actions/github';

import { createClient } from '@supabase/supabase-js';
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
      const { data, error } = await supabase
        .from('users')
        .insert([{ login: user.login, access_token, user_json: user }]);
      res.json({
        body: req.body,
        data: data,
        error: error,
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
