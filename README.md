## Summary

This apps look for certain keywords in diffs and post a comment to a PR if it find these keywords.

Right now, the keywords it searches for are ethereum addresses and web3 calls.

## How to install
Two things you need:
- You need to create a github app
- You need a supabase account 

Then add the following to a .env file:

```
CLIENT_ID: XXX
CLIENT_SECRET: YYY
SUPABASE_KEY: ZZZ
SUPABASE_URL: TTT
 ```
 
 
 On your Supabase account, you need to create a table with the following table:
 
 
 ```sql
 CREATE TABLE public.users (
    id integer NOT NULL,
    login character varying NOT NULL,
    user_json json,
    access_token character varying
);```
