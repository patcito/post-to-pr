## Summary

This apps look for certain keywords in diffs and post a comment to a PR if it find these keywords.

Right now, the keywords it searches for are ethereum addresses and web3 calls.

## How to install
Two things you need:
- You need to create a github app
- You need a supabase account 

 On your Supabase account, you need to create a database with the following table:
 
 
```sql
 CREATE TABLE public.users (
    id integer NOT NULL,
    login character varying NOT NULL,
    user_json json,
    access_token character varying
);
```


Deploy to vercel by pushing to your repo. You need to add the environment variables to your vercel project settings.

```
CLIENT_ID: XXX
CLIENT_SECRET: YYY
SUPABASE_KEY: ZZZ
SUPABASE_URL: TTT
 ```
 
 
Here is how to call the action from a repo https://github.com/yearn/yearn-finance/blob/develop/.github/workflows/check-payment-code.yml
