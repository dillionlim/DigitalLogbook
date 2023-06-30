# MTC Digital Logbook

This repository holds the code for the Telegram bot for Motor Transport Centre, making use of the FormSG API to receive encrypted POST requests containing form responses, and filtering and outputting these responses to telegram.

The bot was hosted on Cloudflare, using the free tier.

## Installation and Setup Guide

**Prerequisites:** Node.JS (this bot was tested on V18.13.0), NPM (this bot was tested on V8.19.1)

1. Heavy development will be done locally, so it is recommended to install Wrangler CLI. You can do so through npm:

```npm
npm install -g wrangler
```

You may see detailed [installation instructions](https://developers.cloudflare.com/workers/wrangler/install-and-update/).

2. Sign up for a Cloudflare account if you do not have one. You then need to authenticate Wrangler with your Cloudflare account.

```npm
wrangler login
```

When wrangler automatically opens your browser to display Cloudflare’s consent screen, click the Allow button. This will send an API Token to Wrangler.


3. Initialise your Wrangler workspace.
```npm
wrangler init
```

For the questions, answer as follows to the respective prompts:
- digital-logbook
- Common Worker functions
- no
- n
- y

4. Navigate to the `src` directory, and remove all the JS files in it.
```console
cd digital-logbook/src
rm *
```

5. Pull the files from Github.
```console

```
